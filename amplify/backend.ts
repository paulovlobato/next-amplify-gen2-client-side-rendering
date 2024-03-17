import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { myDemoFunction } from './functions/my-demo-function/resource';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { myFunction } from './functions/my-function/resource';
import { Stack, aws_apigateway } from 'aws-cdk-lib';

const backend = defineBackend({
  auth,
  data,
  myDemoFunction,
  myFunction
});

const apiGatewayStack = backend.createStack("apigateway-stack");

// REST API resource
const myAPI = new LambdaRestApi(apiGatewayStack, "MyApi", {
  handler: backend.myFunction.resources.lambda,
  
  // defines that the X-API-Key should be present on the header and is required for all endpoints
  apiKeySourceType: aws_apigateway.ApiKeySourceType.HEADER,
  defaultMethodOptions: {
    apiKeyRequired: true
  }
})

// creating API key
const apiKey = new aws_apigateway.ApiKey(apiGatewayStack, 'MyApiKey', {
  description: 'API Key for access',
  enabled: true
})

// create usage plan
const usagePlan = new aws_apigateway.UsagePlan(apiGatewayStack, 'UsagePlan', {
  name: 'MyUsagePlan',
  apiStages: [{
    api: myAPI,
    stage: myAPI.deploymentStage
  }],
  throttle: {
    rateLimit: 10,
    burstLimit: 2
  },
  quota: {
    limit: 1000,
    period: aws_apigateway.Period.MONTH
  }
})

// add api key
usagePlan.addApiKey(apiKey);

backend.addOutput({
  custom: {
    apiId: myAPI.restApiId,
    apiEndpoint: myAPI.url,
    apiName: myAPI.restApiName,
    apiRegion: Stack.of(apiGatewayStack).region
  }
});
