import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { v4 as uuidv4 } from 'uuid';

const sqsClient = new SQSClient({});
const QUEUE_URL = process.env.QUEUE_URL;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Received event:', event.body);

    if (!event.body) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ message: 'Request body is required' }),
      };
    }

    const payload = JSON.parse(event.body);
    const requestId = uuidv4();

    // Enrich payload with request ID and timestamp
    const enrichedPayload = {
      ...payload,
      requestId,
      timestamp: new Date().toISOString(),
    };

    // Push to SQS
    await sqsClient.send(
      new SendMessageCommand({
        QueueUrl: QUEUE_URL,
        MessageBody: JSON.stringify(enrichedPayload),
        MessageGroupId: payload.farmerId || 'default', // Using farmerId for FIFO if it was a FIFO queue, but works for standard too if we ever switch.
      })
    );

    return {
      statusCode: 202,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        message: 'Logistics request received and queued for processing.',
        requestId,
      }),
    };
  } catch (error) {
    console.error('Error processing request:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
