import { DockerStreamOutput } from "../types/dockerStreamOutput";
import { DOCKER_STREAM_HEADER_SIZE } from "../utils/constants";

export function decodeDockerString(buffer: Buffer): DockerStreamOutput {
  let offset = 0; // this variable keeps track of the current position in the buffer while parsing

  // the output object that will store the accumulated stdout and stderr output as strings
  const output: DockerStreamOutput = {
    stdout: "",
    stderr: "",
  };

  // loop until offset reaches the end of the buffer
  while (offset < buffer.length) {
    // channel is read from buffer and has value of type of stream
    const typeOfStream = buffer[offset];

    // this length variable holds the length of the value
    // We will read this variable on an offset of 4 bytes from the start of the chunk
    const length = buffer.readUint32BE(offset + 4);

    // we have read the header, now move to the value
    offset += DOCKER_STREAM_HEADER_SIZE;

    if (typeOfStream === 1) {
      // stdout
      output.stdout += buffer.toString("utf8", offset, offset + length);
    } else if (typeOfStream === 2) {
      // stderr
      output.stderr += buffer.toString("utf8", offset, offset + length);
    }

    offset += length; // move the offset to next chunk
  }

  return output;
}
