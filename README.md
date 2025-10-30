# On-Demand Processor

A system that accepts jobs and processes them in parallel, with live status updates.

## Description

This project is a simple yet powerful on-demand processing system built with Node.js. It allows you to submit jobs, each containing multiple tasks. The system processes these tasks in parallel, provides live status updates via WebSockets, and persists job data. It also includes graceful shutdown handling to ensure no data is lost.

## Features

- **Job and Task Management**: Submit jobs with multiple tasks.
- **Live Status Updates**: Real-time progress of jobs and tasks, including percentage completion, broadcasted via WebSockets.
- **Configurable Parallelism**: Easily configure the number of tasks to execute in parallel.
- **API Endpoint**: A simple RESTful API to submit new jobs.
- **Persistence**: Job and task data are persisted to a JSON file for durability.
- **Graceful Shutdown**: Handles process termination signals to safely stop the system.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/tusharawasthi18/cloudamize-assessment-project.git
    cd cloudamize-assessment-project
    ```

2.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Application

To start the server, run the following command:

```bash
npm start
```

The server will start on `http://localhost:3000`.

## API Endpoints

### Submit a Job

- **URL**: `/jobs`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "numTask": 20
  }
  ```
- **Success Response**:
  - **Code**: `201`
  - **Content**:
    ```json
    {
      "success": true,
      "jobId": "some-unique-id"
    }
    ```

## WebSocket Events

The server broadcasts job and task status updates to all connected clients. Connect to the WebSocket server at `ws://localhost:3000`.

### Events

- `job-update`: Sent when a job's status changes.
  ```json
  {
    "jobId": "some-unique-id",
    "status": "processing",
    "progress": 50
  }
  ```
- `task-update`: Sent when a task's status changes.
  ```json
  {
    "jobId": "some-unique-id",
    "taskId": "task-id-1",
    "status": "completed"
  }
  ```

## Configuration

The number of parallel task executions can be configured by setting the `MAX_CONCURRENT_TASKS` environment variable.

Example:

```bash
MAX_CONCURRENT_TASKS=5 npm start
```

If not set, it defaults to a value defined in the application (e.g., number of CPU cores).

## Persistence

The application persists job and task data to a `jobs.json` file in the project's root directory. This ensures that data is not lost between application restarts.

## Graceful Shutdown

The system listens for `SIGTERM` and `SIGINT` signals to perform a graceful shutdown. During this process, all job and task states are saved to the database (`jobs.json`). When the server restarts, it automatically resumes any jobs that were queued or pending, ensuring no work is lost. This involves stopping the acceptance of new jobs, waiting for ongoing tasks to complete, saving the state, and then exiting the process.
