import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const dynamodbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamodbClient);

const TABLE_NAME = process.env.TABLE_NAME;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Fetching latest logistics requests from DynamoDB...');

    // In a real production app, you'd use a QueryCommand on a GSI sorted by timestamp.
    // For the hackathon, a simple Scan limited to recent items is sufficient.
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      Limit: 10, // Fetch top 10 recent items
    });

    const response = await docClient.send(command);

    // Sort by processedAt descending (newest first)
    const sortedItems = (response.Items || []).sort((a, b) => {
      const dateA = new Date(a.processedAt || 0).getTime();
      const dateB = new Date(b.processedAt || 0).getTime();
      return dateB - dateA;
    });

    return {
      statusCode: 200,
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Successfully retrieved AI logistics intelligence.',
        data: sortedItems,
      }),
    };
  } catch (error) {
    console.error('Error fetching data from DynamoDB:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
