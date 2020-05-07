import * as api from './libs/api';
import { buildSlackMessageFromJobs } from './libs/utils';

export const hello = async (event, context) => {

  const jobs = await api.getRecentJobsFromDesignedSite();

  const jobsMessage = buildSlackMessageFromJobs(jobs)
  
  await api.sendJobsToSlackChannel(jobsMessage)

  return {
    statusCode: 200,
    body: JSON.stringify({
      jobs,
      message: `ok`,
    }),
  };
};

