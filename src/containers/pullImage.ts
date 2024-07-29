import Docker from "dockerode";

export default async function pullImage(imageName: string) {
  try {
    const docker = new Docker();

    return new Promise((resolve, reject) => {
      docker.pull(
        imageName,
        (err: Error, stream: NodeJS.ReadableStream) => {
          if (err) throw err;
          docker.modem.followProgress(stream, (err, res) => {
            if (err) throw reject(err);
            resolve(res);
          });
        },
        (event) => {
          console.log(event);
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
}
