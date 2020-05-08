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

  result.blocks.push({ "type": "divider" })
  result.blocks.push( 		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "You can find more jobs at Designed platform"
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": "Go to Designed.org"
				},
        "url" : "https://www.designed.org/jobs"
			}
		},
  )

  console.log(require('util').inspect(result, false, null, true))

  return result;
}

function buildMessageBlock(job) {

  let companyText = '';
  if (job.company) {
    companyText = `Company: ${job.company.name} | Location: ${job.company.location}`
  }

  let remoteFriendlyText = job.remoteFriendly? ":heavy_check_mark:" : ":heavy_multiplication_x:";

  let text = `*${job.title}*\n${companyText}\n<${job.url}|View job>`

  let result = {
    type: "section",
    text: {
      type: "mrkdwn",
      text
    }
  };

  if (job.company && job.company.logo && job.company.logo !== '{"NULL":true}') {
    result.accessory = {
      type: "image",
      image_url: job.company.logo,
      alt_text: "alt text for image"
    }
  }

  return result;
}
