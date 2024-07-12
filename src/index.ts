import express from "express";

import { PORT } from "./config/serverConfig";
import runPython from "./containers/runPythonDocker";
// import sampleQueueProducer from "./producers/sampleQueueProducer";
import apiRouter from "./routes";
import SampleWorker from "./workers/sampleWorker";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);

  SampleWorker("SampleQueue");

  const code = `print("Hello")`;
  runPython(code);
  // sampleQueueProducer("SampleJob", {
  //   name: "Tousif",
  //   age: 22,
  // });
});
