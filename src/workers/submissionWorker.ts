import { Job, Worker } from "bullmq";

import redisConnection from "../config/redisConfig";
import SubmissionJob from "../jobs/submissionJob";

export default function SubmissionWorker(queueName: string) {
  new Worker(
    queueName,
    async (job: Job) => {
      console.log("submission job kicking through worker", job);
      if (job.name === "SubmissionJob") {
        const submissionJobInstance = new SubmissionJob(job.data);

        submissionJobInstance.handler(job);
        return true;
      }
    },
    {
      connection: redisConnection,
    }
  );
}
