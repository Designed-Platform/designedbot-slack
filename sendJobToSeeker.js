import { WebClient } from "@slack/web-api";

const buildBlocks = () => {
  const blocks = [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "Here's a new job someone posted on *TheDesignership* Slack workspace:"
      }
    },
    {
      "type": "divider"
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "Hey guys! :wave:\n\nThe design team in <https://quantium.com/#|Quantium> is looking for a *Lead UX Designer* based in *Sydney, Australia* :flag-au: \n\n We’re a global data science and AI consulting company (Australia, USA, Africa) with a range of clients in different industries, from Facebook in Media, to retail giants like Walmart and Woolworths.\n\nCandidate has ideally 5+ years of experience, with strengths in leading a team, data vis and can own and deliver the whole end to end design experience. You’ll be working along developers, product owners / managers, data scientists, consultants, customer advocates and customers. For more details, see job posting <https://www.linkedin.com/jobs/view/1874868499/?alternateChannel=search|here> and/or DM me with your LinkedIn and Portfolio link! :relaxed:\n\n<https://www.linkedin.com/jobs/view/1874868499/?alternateChannel=search>"
      }
    },
    {
      "type": "divider"
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "style": "primary",
          "text": {
            "type": "plain_text",
            "text": "Apply for this job",
            "emoji": true
          },
          "value": "click_me_123"
        }
      ]
    }
  ];

  return blocks;
}

export const main = async (event, context) => {
  // TODO: parse event if there is one

  // The response we will return to Slack
  let response = {
    statusCode: 200,
    body: {},
  };

  try {
    let result = await sendJobToSeeker();
    response.body = { ok: true, result };
  } catch (err) {
    (response.statusCode = 500), (response.body = JSON.stringify(err));
  } finally {
    return response;
  }
};

/**
 * Process the message and executes an action based on the message received
 * @async
 * @param {Object} event The Slack message object
 */
async function sendJobToSeeker(event) {
  
  // this is Bot User OAuth Access Token
  const token = process.env.BOT_USER_OAUTH_ACCESS_TOKEN;
  const web = new WebClient(token);

  const result = await web.chat.postMessage({
    text: "Here's a new job someone posted on TheDesignership Slack workspace:",
    blocks: buildBlocks(),
    channel: 'U8CPP6ADP', // preshetin user id in Bonanza workspace
  });

  return result;
}


