import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // In production, this URL is set in your Vercel or AWS Amplify environment variables
    const API_GATEWAY_URL = process.env.API_GATEWAY_URL;

    if (!API_GATEWAY_URL) {
      // For local dev when CDK isn't deployed yet, return a mock success
      console.warn('API_GATEWAY_URL is not set. Simulating success.');
      return NextResponse.json({
        message: 'Mock: Logistics request received and queued.',
        requestId: 'mock-' + Date.now(),
      }, { status: 202 });
    }

    // Forward the request to AWS API Gateway
    const response = await fetch(`${API_GATEWAY_URL}/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
