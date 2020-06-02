import { WebClient } from "@slack/web-api";
import { sendDismissMessage} from './libs/api';
import { modalView } from './libs/utils';
import qs from 'querystring';

// this is Bot User OAuth Access Token
const token = process.env.BOT_USER_OAUTH_ACCESS_TOKEN;
const web = new WebClient(token);

const openModal = async payload => await web.views.open({
    trigger_id: payload.trigger_id,
    view: modalView(payload)
  });
  

export const main = async (event, context) => {
  const requestPayload = payloadFromBase64(event.body)
  console.log('requestPayload', JSON.stringify(requestPayload))

  switch (requestPayload.type) {
    case 'block_actions':
      if (Array.isArray(requestPayload.actions) && requestPayload.actions.length) {
        switch (requestPayload.actions[0].text.text) {
          case "Let's do this":
            await openModal(requestPayload);
            // replce with Thank you message
            break;
          case "No":
            await sendDismissMessage(requestPayload)
            break;
        }
      }
      break;
    case 'view_submission':
      // save to db
      console.log('view_submission')
      break;
  }

  // Acknowledge the response
  let response = {
    statusCode: 200,
    body: "",
  };

  return response;

//  try {
//    // If the Slack retry header is present, ignore the call to avoid triggering the lambda multiple times
//    if (!("X-Slack-Retry-Num" in event.headers)) {
//      switch (dataObject.type) {
//        case "url_verification":
//          response.body = verifyCall(dataObject);
//          break;
//        case "event_callback":
//          await handleMessage(dataObject.event);
//          response.body = { ok: true };
//          break;
//        default:
//          (response.statusCode = 400), (response.body = "Empty request");
//          break;
//      }
//    }
//  } catch (err) {
//    (response.statusCode = 500), (response.body = JSON.stringify(err));
//  } finally {
//    return response;
//  }
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



    // 

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
            "value": "click_me_123"
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

function payloadFromBase64 (data) {
  let queryString = Buffer.from(data, 'base64').toString('ascii')
  let json = qs.parse(queryString)
  return JSON.parse(json.payload)  
}

