// import Docker from "dockerode";

// import { TestCases } from "../types/testCases";
import { PYTHON_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";

async function runPython(code: string /*, inputData: TestCases*/) {
  console.log("Initializing python docker container");
  const pythonDockerContainer = await createContainer(PYTHON_IMAGE, [
    "python3",
    "-c",
    code,
    "stty -echo",
  ]);

  // starting the container
  await pythonDockerContainer.start();
  console.log("Container started");

  const loggerStream = pythonDockerContainer.logs({
    stdout: true,
    stderr: true,
    follow: true, // whether logs are streamed or return as string
    timestamps: false,
  });

  return pythonDockerContainer;
}

export default runPython;
