import fs from "fs";
import { Worker } from "worker_threads";

// job status : 'queued' | 'in-progress' | 'complete' | 'failed'
// task status : 'pending' | 'in-progress' | 'complete' | 'failed'

export class OnDemandProcessor {
  static instance = null;
  static creating = false;

  constructor(workerCount) {
    if (!OnDemandProcessor.creating) {
      throw new Error("Use OnDemandProcessor.getInstance() instead of new.");
    }

    this.jobs = [];
    this.isProcessing = false;

    this.MAX_WORKERS = workerCount;
    this.activeWorkers = 0;
    this.taskQueue = [];

    // for saving data in jobs.json
    this.debounceSave = null;

    // for graceful shutdown
    this.isShuttingDown = false;
  }

  init(io) {
    this.io = io;

    try {
      const data = fs.readFileSync("jobs.json", "utf-8");
      this.jobs = JSON.parse(data);

      // convert all in-progress jobs to queue to start the process again
      this.jobs.forEach((job) => {
        if (job.status === "in-progress") {
          job.status = "queued";
        }

        job.tasks.forEach((task) => {
          if (task.status === "in-progress") task.status = "pending";
        });
      });

      console.log("Loaded jobs from previous session.");
    } catch (err) {
      this.jobs = [];
      console.log("Starting fresh, no jobs.json found.");
    }

    if (this.jobs.some((job) => job.status === "queued")) {
      console.log("Recovered pending jobs — restarting queue...");
      this.processJobs();
    }
  }

  static getInstance(workerCount) {
    if (!this.instance) {
      this.creating = true;
      this.instance = new OnDemandProcessor(workerCount);
      this.creating = false;
    }

    return this.instance;
  }

  async addJob(numTask) {
    if (this.isShuttingDown) {
      throw new Error("Cannot add jobs during shutdown");
    }

    const job = {
      id: Date.now(),
      status: "queued",
      progress: 0,
      tasks: [],
    };

    for (let i = 0; i < numTask; i++) {
      job.tasks.push({
        id: `${job.id}-${i + 1}`,
        status: "pending",
        duration: Math.floor(Math.random() * (700 - 200 + 1)) + 200, // duration range between 200ms - 700ms (for testing purpose)
      });
    }

    // add the newly created job to jobs queue
    this.jobs.push(job);

    // save the newly added job back to jobs.json
    this.saveJobs();

    // starts processing the job
    this.processJobs();

    this.io.emit("job-update", {
      jobId: job.id,
      status: "queued",
      progress: job.progress,
    });

    return job.id;
  }

  saveJobs() {
    if (this.isShuttingDown) {
      return;
    }

    // Cancel previous debounce timer
    clearTimeout(this.debounceSave);

    // Schedule save after 100ms (debounced)
    this.debounceSave = setTimeout(() => {
      this.debounceSave = null;
      this.batchSave();
    }, 100);
  }

  async batchSave(force = false) {
    if (!force && this.debounceSave) {
      return;
    }

    try {
      // Write current jobs to file
      await fs.promises.writeFile(
        "jobs.json",
        JSON.stringify(this.jobs, null, 2)
      );
    } catch (err) {
      console.error("Error saving jobs:", err);
    }
  }

  calcProgress(job) {
    const done = job.tasks.filter(
      (t) => t.status === "complete" || t.status === "failed"
    ).length;
    return Math.round((done / job.tasks.length) * 100);
  }

  async processJobs() {
    if (this.isProcessing || this.isShuttingDown) {
      return;
    }

    this.isProcessing = true;

    // keep running until all jobs are done
    while (!this.isShuttingDown) {
      const job = this.jobs.find((job) => job.status === "queued");

      if (!job) {
        break;
      }

      job.status = "in-progress";
      this.io.emit("job-update", {
        jobId: job.id,
        status: "in-progress",
        progress: job.progress,
      });
      this.saveJobs();

      // add all task to the task queue for processing
      for (const task of job.tasks) {
        if (this.isShuttingDown) {
          return;
        }
        if (task.status === "pending") {
          this.taskQueue.push({ task, job });
        }
      }

      // keep running the scheduler until the task queue is empty
      await new Promise((resolve) => {
        const check = async () => {
          this.runTaskSchedule();

          const allTaskProcessed = job.tasks.every(
            (t) => t.status === "complete" || t.status === "failed"
          );

          if (allTaskProcessed && this.activeWorkers === 0) {
            if (job.tasks.every((t) => t.status === "complete")) {
              job.status = "complete";
            } else {
              job.status = "failed";
            }

            this.io.emit("job-update", {
              jobId: job.id,
              status: job.status,
              progress: job.progress,
            });
            this.saveJobs();

            resolve();

            setImmediate(() => this.processJobs());
          } else {
            setTimeout(check, 200);
          }
        };

        check();
      });
    }

    this.isProcessing = false;
  }

  runTaskSchedule() {
    if (this.isShuttingDown) {
      return;
    }

    while (this.activeWorkers < this.MAX_WORKERS && this.taskQueue.length > 0) {
      const taskItem = this.taskQueue.shift();
      this.runTaskInWorker(taskItem);
    }
  }

  async runTaskInWorker({ task, job }) {
    if (this.isShuttingDown) {
      return;
    }

    this.activeWorkers++;

    task.status = "in-progress";
    this.io.emit("task-update", {
      jobId: job.id,
      taskId: task.id,
      status: task.status,
    });
    this.saveJobs();

    const worker = new Worker(new URL("./taskWorker.js", import.meta.url));
    worker.postMessage(task);

    worker.on("message", async (msg) => {
      if (msg.success) {
        task.status = "complete";
      } else {
        task.status = "failed";
      }

      job.progress = this.calcProgress(job);

      this.io.emit("task-update", {
        jobId: job.id,
        taskId: task.id,
        status: task.status,
      });
      this.io.emit("job-update", {
        jobId: job.id,
        status: job.status,
        progress: job.progress,
      });
      this.saveJobs();

      this.activeWorkers--;

      await worker.terminate();
    });

    worker.on("error", async (err) => {
      task.status = "failed";
      job.progress = this.calcProgress(job);
      this.io.emit("job-update", {
        jobId: job.id,
        status: job.status,
        progress: job.progress,
      });
      this.saveJobs();

      this.activeWorkers--;

      await worker.terminate();
    });
  }
}
