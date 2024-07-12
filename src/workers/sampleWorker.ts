import { Job, Worker } from "bullmq";

import redisConnection from "../config/redisConfig";
import SampleJob from "../jobs/sampleJob";

export default function SampleWorker(queueName: string) {
  new Worker(
    queueName,
    async (job: Job) => {
      console.log("Sample job kicking through worker", job);
      if (job.name === "SampleJob") {
        const sampleJobInstance = new SampleJob(job.data);

        sampleJobInstance.handler();
        return true;
      }
    },
    {
      connection: redisConnection,
    }
  );
}
