export const buildSlackMessageFromJobs = jobs => {

  let result = {
    "text": "Here are some recent design jobs I've found",
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "Here are some recent design jobs I've found."
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
				"text": "More jobs available at Designed"
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": "Visit Designed.org"
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
    companyText = `${job.company.name}\n${job.company.location}`
  }

  let remoteFriendlyText = job.remoteFriendly? ":heavy_check_mark:" : ":heavy_multiplication_x:";

  const publishedOnText = getPublishedOnText(job.publishedOn)

  let text = `*${job.title}, ${job.type}*\n${companyText}\n<${job.url}|View Job>`

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
      alt_text: companyText
    }
  }

  return result;
}

