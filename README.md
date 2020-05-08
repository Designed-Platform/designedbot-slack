# designedbot-slack
The DesignBot for slack keeps our community up to date with the latest news, jobs, events, etc...

This project was bootstapped with [AnomalyInnovations/serverless-nodejs-starter](https://github.com/AnomalyInnovations/serverless-nodejs-starter)

## How to run it locally

After cloning this repo, `cd` into this directory:

```
git clone git@github.com:Designed-Platform/designedbot-slack.git
cd designedbot-slack
```

Then install the dependencies:
```
yarn install
```

Then you need to copy `env.example` to `.env`:
```
cp env.example .env
```

And fill the value for `API_URL` and `WEBHOOK_URL` it. To get the value for `WEBHOOK_URL`, visit settings of the Slack app that you connected. Check out Slack's [incoming webhooks](https://api.slack.com/messaging/webhooks) docs for more info.

To run this locally, run this:
```
serverless invoke local -f fetchJobs
```

As the result, the Slack message should be posted to Slack chanel the incoming webhook in linked to.


