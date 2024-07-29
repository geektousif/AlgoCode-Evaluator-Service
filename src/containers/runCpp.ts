// import Docker from "dockerode";

// import { TestCases } from "../types/testCases";
import { CPP_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import { decodeDockerString } from "./dockerHelper";

async function runCpp(code: string, inputTestCase: string) {
  console.log("Initializing a new Cpp docker container");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawLogBuffer: any[] = [];
  const runCommand = `echo '${code.replace(
    /'/g,
    `'\\"`
  )}' > main.cpp && g++ main.cpp -o main && echo '${inputTestCase.replace(
    /'/g,
    `'\\"`
  )}' | stdbuf -oL -eL ./main`;
  const cppDockerContainer = await createContainer(CPP_IMAGE, [
    "/bin/sh",
    "-c",
    runCommand,
  ]);

  // starting the container
  await cppDockerContainer.start();
  console.log("Container started");

  const loggerStream = await cppDockerContainer.logs({
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
  const response = await new Promise((res, _) => {
    loggerStream.on("end", () => {
      console.log(rawLogBuffer);
      const completeBuffer = Buffer.concat(rawLogBuffer);
      const decodedString = decodeDockerString(completeBuffer);

      console.log(decodedString);
      console.log(decodedString.stdout);
      res(decodeDockerString);
    });
  });

  await cppDockerContainer.remove();
  return response;
}

// TODO TLE for 5 seconds, also Memory limit exceeded error

export default runCpp;
