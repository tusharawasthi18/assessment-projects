export async function gracefulShutdown(server, processor, err) {
  if (err) console.error("Error:", err);

  console.log("Graceful shutdown started...");

  processor.isShuttingDown = true;

  await processor.batchSave?.(true);

  const maxWaitMs = 20000;
  const checkInterval = 200;
  let waited = 0;

  while (processor.activeWorkers > 0 && waited < maxWaitMs) {
    console.log(`Waiting for ${processor.activeWorkers} workers...`);
    await new Promise((r) => setTimeout(r, checkInterval));
    waited += checkInterval;
  }

  if (processor.activeWorkers > 0) {
    console.warn(
      `Force shutdown: ${processor.activeWorkers} workers stuck after ${maxWaitMs}ms`
    );
  }

  if (server.listening) {
    await new Promise((res) => server.close(res));
  }

  console.log("Shutdown complete.");
  process.exit(err ? 1 : 0);
}
