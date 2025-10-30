import { parentPort } from "worker_threads";

parentPort.on("message", async (task) => {
  // faking some computational work
  await new Promise((res) => setTimeout(res, task.duration));

  // now sending back the result to main thread
  parentPort.postMessage({ taskId: task.id, success: true });
});
