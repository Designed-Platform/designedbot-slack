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

  console.log(response.data.data.getAllJobs[0])

  const jobs = response.data.data.getAllJobs

  const HOURS_INTERVAL = 1;
  
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
  }).filter(el => Date.now() - parseInt(el.publishedOn) * 1000 < HOURS_INTERVAL * 60 * 60 * 1000 )
    .sort((a,b) => b.publishedOn - a.publishedOn)
    .slice(0, 5)
}

export const sendJobsToSlackChannel = async (jobsMessage) => {
  const WEBHOOK_URL = process.env.WEBHOOK_URL;

  console.log('jobsMessage', jobsMessage)

  return axios.post(WEBHOOK_URL, jobsMessage)
}

