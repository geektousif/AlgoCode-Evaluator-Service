// import Docker from "dockerode";

// import { TestCases } from "../types/testCases";
import { JAVA_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import { decodeDockerString } from "./dockerHelper";

async function runJava(code: string, inputTestCase: string) {
  console.log("Initializing a new java docker container");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawLogBuffer: any[] = [];
  const runCommand = `echo '${code.replace(
    /'/g,
    `'\\"`
  )}' > Main.java && javac Main.java && echo '${inputTestCase.replace(
    /'/g,
    `'\\"`
  )}' | java Main`;
  const javaDockerContainer = await createContainer(JAVA_IMAGE, [
    "/bin/sh",
    "-c",
    runCommand,
  ]);

  // starting the container
  await javaDockerContainer.start();
  console.log("Container started");

  const loggerStream = await javaDockerContainer.logs({
    stdout: true,
    stderr: true,
    follow: true, // whether logs are streamed or return as string
    timestamps: false,
  });

  loggerStream.on("data", (chunk) => {
    rawLogBuffer.push(chunk);
  });

  // TODO fork bomb prone code
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  await new Promise((res, _) => {
    loggerStream.on("end", () => {
      console.log(rawLogBuffer);
      const completeBuffer = Buffer.concat(rawLogBuffer);
      const decodedString = decodeDockerString(completeBuffer);

      console.log(decodedString);
      console.log(decodedString.stdout);
      res(decodeDockerString);
    });
  });

  await javaDockerContainer.remove();
}

// TODO TLE for 5 seconds, also Memory limit exceeded error

export default runJava;
