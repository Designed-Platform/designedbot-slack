import axios from 'axios';

export const getRecentJobsFromDesignedSite = async () => {
  const getAllJobsQuery = `{
        getAllJobs(isAvailable: true) {
          id
          title
          type
          experience
          jobInfoUrl
          postedBy {
            avatarUrl
          }
          remoteFriendly
          company {
            name
            domain
            location
            logo
          }
          publishedOn
          description
        }
      }
  `

  const url = process.env.API_URL + '/graphql';

  const response = await axios({
    url,
    method: 'post',
    data: {
      query: getAllJobsQuery
    }
  })

//  const jobs = [
//    {
//      id: 1,
//      title: "Kiosk Design for Shopping Centre (Pretzels)",
//      description: "Love Pretzels | Anywhere",
//      location: "Anywhere",
//      url: "https://www.behance.net/joblist/72091/Kiosk-Design-for-Shopping-Centre-(Pretzels)?utm_source=designed&utm_medium=organic", 
//    },
//    {
//      id: 2,
//      title: "UI/UX Designer",
//      description: "AltraDimension Technologies Private Linited | Freelance",
//      location: "Anywhere",
//      image_url: "https://mir-s3-cdn-cf.behance.net/team/100/ec1dcc257315.5eac422711974.jpg",
//      url: "https://www.behance.net/joblist/72705/UIUX-Designer?utm_source=designed&utm_medium=organic"
//    },
//  ];

  console.log(response.data.data.getAllJobs[0])

  const jobs = response.data.data.getAllJobs
  
  return jobs.map(job => {
    let result = {
      ...job,
      description: 'some description',
      location: 'some location',
      url: job.jobInfoUrl
    }

    if (job.postedBy && job.postedBy.avatarUrl) {
      result.image_url = job.postedBy.avatarUrl;
    }
    return result;
  }).sort((a,b) => b.publishedOn - a.publishedOn).slice(0, 5)
}

export const sendJobsToSlackChannel = async (jobsMessage) => {
  const WEBHOOK_URL = process.env.WEBHOOK_URL;

  console.log('jobsMessage', jobsMessage)

  return axios.post(WEBHOOK_URL, jobsMessage)
}

