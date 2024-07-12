import { Job } from "bullmq";

import { IJob } from "../types/bullMqJobDefinition";

export default class SampleJob implements IJob {
  name: string;
  payload: Record<string, unknown> | undefined;
  constructor(payload: Record<string, unknown>) {
    this.payload = payload;
    this.name = this.constructor.name;
  }

  handler = (job?: Job) => {
    console.log("Handler called");
    console.log(this.payload);
    if (job) {
      console.log(job.id, job.name, job.data);
    }
  };

  failed = (job?: Job): void => {
    console.log("Job failed");
    if (job) {
      console.log(job.id);
    }
  };
}
