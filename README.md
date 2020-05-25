## What does this function do
This function is triggered by a time-scheduled CloudWatch event. The event includes an URL to that the function shoud send a HTTP GET request.
 
After getting the response this function will transform RSS+XML to JSON format and send the JSON to a SNS topic, in order to inform the subscribers to work on it.

## Create CloudWatch scheduled event
1. Create a rule in CloudWatch
```bash
aws events rss-url \
  --name my-scheduled-rule \
  --schedule-expression 'rate(1 day)'
```

2. Create permission for the Lambda function
```bash
aws lambda add-permission \
  --function-name rss-picker \
  --statement-id rss-url-event \
  --action 'lambda:InvokeFunction' \
  --principal events.amazonaws.com \
  --source-arn arn:aws:events:eu-central-1:410315750128:rule/rss-url
```

### Source:
https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/RunLambdaSchedule.html

## Create a SNS topic on AWS as the pubishing target
1. `aws sns create-topic --name lambda-rss-feed`

2. Go to AWS IAM to add an inline-policy to the role of rss-picker to enable publishing onto the lambda-rss-feed.

### Source
1. The code to publish the message is learnt from https://gist.github.com/jeremypruitt/ab70d78b815eae84e037

## Tests

### Automatic unit tests
1. `npm rebuild` to make sure the npm modules are compile for your local env (i.e. MacOS instead of Linux)

2. `npm test`

#### Source 
1. https://www.freecodecamp.org/news/the-best-ways-to-test-your-serverless-applications-40b88d6ee31e/
2. https://blog.codecentric.de/en/2019/02/testable-lambda/
3. https://github.com/dwyl/aws-sdk-mock
4. https://medium.com/@maxcbc/mocking-environment-variables-in-node-js-a17a416e127c

### Manual test locally against an endpoint

1. rebuild the node module for Linux to make it run in the aws-lambda-docker
`node docker-npm.js rebuild` 

2. `sam local start-lambda --env-vars env.json`

3. `aws lambda invoke --function-name "RssPickerFunctioin" --endpoint-url "http://127.0.0.1:3001" --no-verify-ssl out.txt`

#### Source:
1. https://github.com/serverless/serverless/issues/308 and https://gist.github.com/jokeyrhyme/d57097a491aa5ecaf27532d057d72461
2. https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-cli-command-reference-sam-local-start-lambda.html
3. see 2.

### Manual test locally via CLI
1. rebuild the node module for Linux to make it run in the aws-lambda-docker
`node docker-npm.js rebuild` 

2. `sam local invoke "RssPickerFunction" -e test/scheduled-event.json --env-vars env.json`
You do not need to start the function before this test.

#### Source:
https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-using-invoke.html

## Deployment

This project uses the GitHub Actions to deploy the lambda function onto AWS. 

1. It is important to move the aws-sdk into section "devDependencies" of the package.json. 

2. When I used Action plugin appleboy, I had to run `npm prune --production` to get rid of the modules brought by the devDependencies before zipping , in order to keep the function package as small as possible.

3. When I used serverless framework, it took care of excluding test dependencies by himself. But the test directory and files had to be removed manually.

#### Source:
1. Deployment with appleboy: https://blog.jakoblind.no/aws-lambda-github-actions/ and https://github.com/appleboy/lambda-action
2. Deployment with serverless: https://levelup.gitconnected.com/deploying-your-first-serverless-node-js-api-to-aws-lambda-eb34044b1fb5 and https://github.com/serverless/github-action

