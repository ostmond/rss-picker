## Create CloudWatch scheduled event
1. Create a rule in CloudWatch
```bash
aws events rss-url \
  --name my-scheduled-rule \
  --schedule-expression 'rate(1 days)'
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

## Create a SNS topic on AWS
1. `aws sns create-topic --name lambda-rss-feed`

2. The code to publish the message is copied from https://gist.github.com/jeremypruitt/ab70d78b815eae84e037

## To run locally:

1. rebuild the node module for Linux to make it run in the aws-lambda-docker
`node docker-npm.js rebuild` 

2. `sam local start-lambda`

3. `aws lambda invoke --function-name "RssPickerFunctioin" --endpoint-url "http://127.0.0.1:3001" --no-verify-ssl out.txt`

### Source:
1. https://github.com/serverless/serverless/issues/308 and https://gist.github.com/jokeyrhyme/d57097a491aa5ecaf27532d057d72461
2. https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-cli-command-reference-sam-local-start-lambda.html
3. see 2.
