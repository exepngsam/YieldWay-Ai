import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. DynamoDB Table for logistics requests
    const table = new dynamodb.Table(this, 'LogisticsRequestsTable', {
      partitionKey: { name: 'RequestId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For hackathon purposes
    });

    // 2. SQS Queue for buffering requests
    const queue = new sqs.Queue(this, 'IngestionQueue', {
      visibilityTimeout: cdk.Duration.seconds(300), // Match max lambda timeout
    });

    // 3. Ingestion Lambda (POST)
    const ingestLambda = new lambdaNodejs.NodejsFunction(this, 'IngestLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: path.join(__dirname, '../lambda/ingest.ts'),
      handler: 'handler',
      environment: {
        QUEUE_URL: queue.queueUrl,
      },
    });

    // Grant Ingestion Lambda permission to send messages to SQS
    queue.grantSendMessages(ingestLambda);

    // 4. Processing Lambda (Worker)
    const processLambda = new lambdaNodejs.NodejsFunction(this, 'ProcessLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: path.join(__dirname, '../lambda/process.ts'),
      handler: 'handler',
      timeout: cdk.Duration.seconds(30), // Bedrock calls can take a few seconds
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    // Grant Processing Lambda permissions
    queue.grantConsumeMessages(processLambda);
    table.grantWriteData(processLambda);

    // Grant Bedrock invocation permissions
    processLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['bedrock:InvokeModel'],
        resources: ['*'], // In production, restrict to specific model ARN
      })
    );

    // Trigger Processing Lambda from SQS
    processLambda.addEventSource(new lambdaEventSources.SqsEventSource(queue));

    // 5. Get Requests Lambda (GET)
    const getRequestsLambda = new lambdaNodejs.NodejsFunction(this, 'GetRequestsLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: path.join(__dirname, '../lambda/getRequests.ts'),
      handler: 'handler',
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    // Grant Get Requests Lambda permission to read from DynamoDB
    table.grantReadData(getRequestsLambda);

    // 6. API Gateway
    const api = new apigateway.RestApi(this, 'YieldWayApi', {
      restApiName: 'YieldWay-Ai Logistics Service',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const requestsResource = api.root.addResource('requests');
    requestsResource.addMethod('POST', new apigateway.LambdaIntegration(ingestLambda));
    requestsResource.addMethod('GET', new apigateway.LambdaIntegration(getRequestsLambda));

    new cdk.CfnOutput(this, 'YieldWayApiEndpoint', {
      value: api.url,
      description: 'The base API Gateway URL for YieldWay-Ai',
    });
  }
}
