import { SQSEvent } from 'aws-lambda';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const bedrockClient = new BedrockRuntimeClient({});
const dynamodbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamodbClient);

const TABLE_NAME = process.env.TABLE_NAME;

export const handler = async (event: SQSEvent): Promise<void> => {
  for (const record of event.Records) {
    try {
      const payload = JSON.parse(record.body);
      console.log('Processing request:', payload.requestId);

      // Construct a prompt for Amazon Bedrock (Claude 3.5 Sonnet)
      const prompt = `You are an AI logistics assistant for KrishiChain AI.
A farmer has requested logistics pickup.
Details:
- Crop: ${payload.cropType}
- Quantity: ${payload.quantity} kg
- Location: ${payload.location}

Provide a short, structured JSON response with exactly two keys:
1. "optimalSellingWindow": Best time to sell based on typical seasonal data for this crop.
2. "routingRecommendation": Best cold-storage route or immediate mandi (market) nearby.
Return ONLY valid JSON.`;

      // Call Bedrock
      const bedrockCommand = new InvokeModelCommand({
        modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
          anthropic_version: 'bedrock-2023-05-31',
          max_tokens: 300,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      let aiRecommendation = {};
      try {
        const response = await bedrockClient.send(bedrockCommand);
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        const aiResponseText = responseBody.content[0].text;
        // Basic extraction if it returns markdown wrapped json
        const jsonMatch = aiResponseText.match(/\{[\s\S]*\}/);
        aiRecommendation = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: 'Failed to parse AI JSON' };
      } catch (bedrockError) {
        console.error('Bedrock invocation failed:', bedrockError);
        aiRecommendation = { error: 'AI routing temporarily unavailable' };
      }

      // Save to DynamoDB
      const dbItem = {
        RequestId: payload.requestId,
        ...payload,
        aiRecommendation,
        processedAt: new Date().toISOString(),
        status: 'PROCESSED'
      };

      await docClient.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: dbItem,
        })
      );

      console.log('Successfully processed and saved:', payload.requestId);
    } catch (err) {
      console.error('Error processing SQS record:', err);
      // In production, we'd throw here to trigger DLQ (Dead Letter Queue) retries.
    }
  }
};
