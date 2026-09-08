# KrishiChain AI (AgriTech Supply Chain)

KrishiChain AI is a highly scalable, serverless AgriTech logistics platform designed to solve India's post-harvest loss crisis by providing intelligent, real-time supply chain routing for smallholder farmers. 

Built for the **WeMakeDevs 'Bharat Builds' AWS Hackathon**.

---

## 🏆 Technical Highlights

* ⚡ **Event-Driven & 100% Serverless:** Built on an asynchronous AWS Lambda + Amazon SQS + EventBridge architecture, ensuring absolute zero data loss during high-concurrency peak harvest loads.
* 🧠 **GenAI-Powered Intelligent Routing:** Deep integration with Amazon Bedrock (Claude 3.5 Sonnet) to process unstructured supply chain variables (weather, mandi prices) and emit deterministic, optimized routing JSONs in real-time.
* 🛡️ **Enterprise-Grade Infrastructure:** Fully reproducible via AWS CDK (TypeScript), secured with AWS WAF & Least-Privilege IAM, and monitored via distributed AWS X-Ray tracing.

---

## Architecture Overview

1. **Frontend**: Next.js 15 + Tailwind CSS (Deployable to Vercel or AWS Amplify). Features a responsive, mobile-first UI for farmers to request pickup.
2. **API Proxy**: Next.js API Routes securely proxy requests to AWS, keeping API Gateway URLs hidden.
3. **AWS Backend (CDK)**:
   - **Amazon API Gateway**: Receives the proxied requests.
   - **Ingestion Lambda**: Validates payloads and immediately pushes them to SQS (returns HTTP 202).
   - **Amazon SQS**: Acts as a shock absorber for sudden traffic spikes.
   - **Processing Lambda**: Pulls from SQS, invokes **Amazon Bedrock (Claude 3.5 Sonnet)** to generate predictive logistics intelligence, and saves the result.
   - **Amazon DynamoDB**: Stores the final, enriched logistics request (On-Demand billing mode).

---

## Getting Started

### 1. Deploy the AWS Infrastructure
*Prerequisites: AWS CLI configured with admin permissions.*

```bash
cd infrastructure
npm install
# Bootstrap CDK if you haven't used it in your region yet
npx cdk bootstrap
# Deploy the stack
npx cdk deploy
```

*Note the `KrishiChainApiEndpoint` URL that is printed in your terminal after a successful deployment.*

### 2. Run the Next.js Frontend Locally

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend/` directory and add your API Gateway URL:
```env
API_GATEWAY_URL="https://your-api-id.execute-api.us-east-1.amazonaws.com/prod"
```

Start the local server:
```bash
npm run dev
```
Visit `http://localhost:3000` to interact with the platform!

---

## Continuous Integration & Deployment (CI/CD)

This repository is configured with a modern GitOps pipeline using GitHub Actions (`.github/workflows/deploy.yml`):
1. **Push to `main`**: Triggers the workflow.
2. **CDK Deploy**: Authenticates with AWS via OIDC (OIDC setup required) and deploys infrastructure updates.
3. **Frontend Deploy**: Triggers a Vercel production build (Vercel token required).
