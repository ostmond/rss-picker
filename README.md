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

## Create a SNS topic on AWS
1. `aws sns create-topic --name lambda-rss-feed`

2. The code to publish the message is copied from https://gist.github.com/jeremypruitt/ab70d78b815eae84e037

## Tests

### Automatic unit tests
1. `npm rebuild` to make sure the npm modules are compile for your local env (i.e. MacOS instead of Linux)

2. `npm test`

#### Source 
1. https://www.freecodecamp.org/news/the-best-ways-to-test-your-serverless-applications-40b88d6ee31e/
2. https://blog.codecentric.de/en/2019/02/testable-lambda/

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
