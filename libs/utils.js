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

const getPublishedOnText = timestamp => {
  let t = parseInt(timestamp);
  if (typeof t !== 'number') return '';
  const d = new Date(t * 1000)
  return ":clock9:" + d.toUTCString() + ' | '
}

function buildMessageBlock(job) {

  let companyText = '';
  if (job.company) {
    companyText = `Company: ${job.company.name} | :world_map:Location: ${job.company.location}`
  }

  let remoteFriendlyText = job.remoteFriendly? ":heavy_check_mark:" : ":heavy_multiplication_x:";

  const publishedOnText = getPublishedOnText(job.publishedOn)

  let text = `*${job.title}*\n${companyText}\n${publishedOnText}<${job.url}|View job>`

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

