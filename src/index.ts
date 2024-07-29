import express from "express";

import { PORT } from "./config/serverConfig";
// import runCpp from "./containers/runCpp";
import submissionQueueProducer from "./producers/submissionQueueProducer";
// import runJava from "./containers/runJavaDocker";
// import runPython from "./containers/runPythonDocker";
// import sampleQueueProducer from "./producers/sampleQueueProducer";
import apiRouter from "./routes";
import { SubmissionPayload } from "./types/submissionPayload";
import { submission_queue } from "./utils/constants";
import SampleWorker from "./workers/sampleWorker";
import SubmissionWorker from "./workers/submissionWorker";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);

  SampleWorker("SampleQueue");

  SubmissionWorker(submission_queue);

  // const pythonCode = `x = input()\nprint("value of x is ", x)`;
  // runPython(pythonCode, "100");

  // sampleQueueProducer("SampleJob", {
  //   name: "Tousif",
  //   age: 22,
  // });

  // const javaCode = `
  // import java.util.*;
  // public class Main {
  //   public static void main(String[] args) {
  //     Scanner sc = new Scanner(System.in);
  //     int input = sc.nextInt();
  //     System.out.println("value of input is " + input);
  //     for (int i = 0; i < input; i++) {
  //       System.out.println(i);
  //     }
  //   }
  // }
  // `;
  // const inputTestCase = `10
  // `;
  // runJava(javaCode, inputTestCase);

  const cppCode = `
    #include <iostream>

    using namespace std;

    int main() {
      int input;
      cin >> input;
      cout << "value of input is " << input << endl;
      for (int i = 0; i < input; i++) {
        cout << i << endl;
      }
      return 0;
    }
  `;

  const inputTestCase = `10
    `;

  submissionQueueProducer({
    anything: {
      language: "CPP",
      inputCase: inputTestCase,
      code: cppCode,
    } satisfies SubmissionPayload,
  });
  //   runCpp(cppCode, inputTestCase);
});
