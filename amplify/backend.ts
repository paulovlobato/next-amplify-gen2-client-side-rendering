import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { myDemoFunction } from './functions/my-demo-function/resource';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { myFunction } from './functions/my-function/resource';
import { Stack } from 'aws-cdk-lib';

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
})

backend.addOutput({
  custom: {
    apiId: myAPI.restApiId,
    apiEndpoint: myAPI.url,
    apiName: myAPI.restApiName,
    apiRegion: Stack.of(apiGatewayStack).region
  }
});
