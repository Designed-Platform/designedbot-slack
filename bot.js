import { WebClient } from "@slack/web-api";

export const main = async (event, context) => {
  const dataObject = JSON.parse(event.body);
  console.log("event body", event.body);

  // The response we will return to Slack
  let response = {
    statusCode: 200,
    body: {},
    // Tell slack we don't want retries, to avoid multiple triggers of this lambda
    headers: { "X-Slack-No-Retry": 1 },
  };

  try {
    // If the Slack retry header is present, ignore the call to avoid triggering the lambda multiple times
    if (!("X-Slack-Retry-Num" in event.headers)) {
      switch (dataObject.type) {
        case "url_verification":
          response.body = verifyCall(dataObject);
          break;
        case "event_callback":
          await handleMessage(dataObject.event);
          response.body = { ok: true };
          break;
        default:
          (response.statusCode = 400), (response.body = "Empty request");
          break;
      }
    }
  } catch (err) {
    (response.statusCode = 500), (response.body = JSON.stringify(err));
  } finally {
    return response;
  }
};

function verifyCall(data) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;
  if (data.token === SIGNING_SECRET) {
    return data.challenge;
  } else {
    throw "Verification failed";
  }
}

/**
 * Process the message and executes an action based on the message received
 * @async
 * @param {Object} event The Slack message object
 */
async function handleMessage(event) {
  
  // this is Bot User OAuth Access Token
  const token = process.env.BOT_USER_OAUTH_ACCESS_TOKEN;
  const web = new WebClient(token);

  const auth =  await web.auth.test()
  console.log('auth.user_id', auth.user_id)
  console.log('event.user', event.user)

  if (event.type === "member_joined_channel" && auth.user_id === event.user) {
    const conversationId = event.channel;

    const result = await web.chat.postMessage({
      text: "Hello world!",
      channel: conversationId,
    });

    // The result contains an identifier for the message, `ts`.
    console.log(
      `Successfully send message ${result.ts} in conversation ${conversationId}`
    );
  }

  if (event.type === 'message' && messageIsJobPosting(event.text)) {
    const result = await web.chat.postEphemeral({
      channel: event.channel,
      user: event.user,
      blocks: [
      {"type": "section", "text": {"type": "plain_text", "text": "If you want to include this :point_up_2: job opportunity to our jobs digest please add some info "}},
      {
        "type": "actions",
        "elements": [
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "emoji": true,
              "text": "Let's do this"
            },
            "style": "primary",
            "value": event.text
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "emoji": true,
              "text": "No"
            },
            "style": "danger",
            "value": "click_me_456"
          }
        ]
      }
    ],
    });
  }
}

/*
 * Check if a message is actually a job opportunity. 
 */
function messageIsJobPosting (text = '') {
  const list = ['looking for', 'role', 'job', 'hiring', 'hire','team', 'experience', 'contract', 'remote work', 'internship' ]
  // TODO: Add AI based classification
  for (const el of list) {
    if (text.toLowerCase().includes(el)) return true;
  }
  return false;
}

