export const buildSlackMessageFromJobs = jobs => {

  let result = {
    "text": "Here are job posts I've recently run into.",
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "Here are job posts I've recently run into.\n\n *Check them out:*"
        }
      },
      {
        "type": "divider"
      }
    ]
  }; 

  for (const job of jobs) {
    result.blocks = [...result.blocks, buildMessageBlock(job) ]
  }

  return result;
}

function buildMessageBlock(job) {

  let text = `*${job.title}*\n${job.description}\nLocation: ${job.location}\n<${job.url}|View job>`

  let result = {
    type: "section",
    text: {
      type: "mrkdwn",
      text
    }
  };

  if (job.image_url) {
    result.accessory = {
      type: "image",
      image_url: job.image_url,
      alt_text: "alt text for image"
    }
  }

  return result;
}
