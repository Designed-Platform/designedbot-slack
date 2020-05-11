import { WebClient } from "@slack/web-api";

export const main = async (event, context) => {
  const dataObject = JSON.parse(event.body);

  console.log("event", event);
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
 * @param {Object} message The Slack message object
 */
async function handleMessage(message) {
  
  // this is Bot User OAuth Access Token
  const token = process.env.BOT_USER_OAUTH_ACCESS_TOKEN;
  const web = new WebClient(token);

  const auth =  await web.auth.test()
  console.log('auth.user_id', auth.user_id)
  console.log('message.user', message.user)

  if (message.type === "member_joined_channel" && auth.user_id === message.user) {
    const conversationId = message.channel;

    const result = await web.chat.postMessage({
      text: "Hello world!",
      channel: conversationId,
    });

    // The result contains an identifier for the message, `ts`.
    console.log(
      `Successfully send message ${result.ts} in conversation ${conversationId}`
    );
  }
}
