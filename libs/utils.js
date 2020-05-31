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

export const modalView = payload => {
  return {
    "type": "modal",
    "title": {
      "type": "plain_text",
      "text": "Job Opportunity",
      "emoji": true
    },
    "submit": {
      "type": "plain_text",
      "text": "Submit",
      "emoji": true
    },
    "close": {
      "type": "plain_text",
      "text": "Cancel",
      "emoji": true
    },
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "emoji": true,
          "text": "Please fill your opportunity details:"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "input",
        "block_id": "job_description",
        "element": {
          "type": "plain_text_input",
          "action_id": "job_description",
          "initial_value": payload.actions[0].value,
          "placeholder": {
            "type": "plain_text",
            "text": "Enter your job description"
          },
          "multiline": true
        },
        "label": {
          "type": "plain_text",
          "text": "Job description",
          "emoji": true
        }
      },
      {
        "type": "context",
        "elements": [
          {
            "type": "plain_text",
            "text": "Post here your job description details",
            "emoji": true
          }
        ]
      },
      {
        "type": "input",
        "element": {
          "type": "plain_text_input"
        },
        "label": {
          "type": "plain_text",
          "text": "Company name",
          "emoji": true
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*Filters and categories*"
        }
      },
      {
        "type": "context",
        "elements": [
          {
            "type": "plain_text",
            "text": "Filters would help candidates find your opportunity",
            "emoji": true
          }
        ]
      },
      {
        "type": "divider"
      },
      {
        "type": "input",
        "element": {
          "type": "plain_text_input"
        },
        "label": {
          "type": "plain_text",
          "text": "Location",
          "emoji": true
        }
      },
      {
        "type": "input",
        "element": {
          "type": "checkboxes",
          "options": [
            {
              "text": {
                "type": "plain_text",
                "text": "Junior",
                "emoji": true
              },
              "value": "value-0"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "Middle",
                "emoji": true
              },
              "value": "value-1"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "Senior",
                "emoji": true
              },
              "value": "value-2"
            }
          ]
        },
        "label": {
          "type": "plain_text",
          "text": "Level",
          "emoji": true
        }
      },
      {
        "type": "input",
        "element": {
          "type": "checkboxes",
          "options": [
            {
              "text": {
                "type": "plain_text",
                "text": "Full-time",
                "emoji": true
              },
              "value": "value-0"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "Part-time",
                "emoji": true
              },
              "value": "value-1"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "Remote friendly",
                "emoji": true
              },
              "value": "value-2"
            }
          ]
        },
        "label": {
          "type": "plain_text",
          "text": "Availability",
          "emoji": true
        }
      }
    ]
  }
}


