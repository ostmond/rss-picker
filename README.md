## To run locally:

1. rebuild the node module for Linux to make it run in the aws-lambda-docker
`node docker-npm.js rebuild` 
2. `sam local start-lambda --region eu-central-1`
3. `aws lambda invoke --function-name "RssPickerFunctioin" --endpoint-url "http://127.0.0.1:3001" --no-verify-ssl out.txt`