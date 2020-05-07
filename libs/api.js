import axios from 'axios';

export const getRecentJobsFromDesignedSite = async () => {
  // TODO: Make http request to Designed API. Or get from DynamoDb.
  const jobs = [
    {
      id: 1,
      title: "Kiosk Design for Shopping Centre (Pretzels)",
      description: "Love Pretzels | Anywhere",
      location: "Anywhere",
      url: "https://www.behance.net/joblist/72091/Kiosk-Design-for-Shopping-Centre-(Pretzels)?utm_source=designed&utm_medium=organic", 
    },
    {
      id: 2,
      title: "UI/UX Designer",
      description: "AltraDimension Technologies Private Linited | Freelance",
      location: "Anywhere",
      image_url: "https://mir-s3-cdn-cf.behance.net/team/100/ec1dcc257315.5eac422711974.jpg",
      url: "https://www.behance.net/joblist/72705/UIUX-Designer?utm_source=designed&utm_medium=organic"
    },
  ];

  return jobs; 
}

export const sendJobsToSlackChannel = async (jobsMessage) => {
  const WEBHOOK_URL = process.env.WEBHOOK_URL;

  console.log('jobsMessage', jobsMessage)

  return axios.post(WEBHOOK_URL, jobsMessage)
}

