const { Worker } = require('bullmq');
const { exec } = require('child_process');
const path = require('path');

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
};

const visionWorkerPath = path.resolve(__dirname, '../../ml/vision-worker/pipeline.py');
const venvPython = path.resolve(__dirname, '../../ml/vision-worker/venv/Scripts/python.exe');

const worker = new Worker('compliance-jobs', async job => {
  console.log(`Processing job ${job.id} for case ${job.data.caseId}`);
  
  // 1. Call Python Vision Worker
  return new Promise((resolve, reject) => {
    // In a real system, we pass the image path. Here we pass a dummy.
    exec(`"${venvPython}" "${visionWorkerPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Vision worker error: ${error.message}`);
        return reject(error);
      }
      try {
        const extractions = JSON.parse(stdout);
        console.log(`Vision extraction complete for case ${job.data.caseId}`);
        // 2. We return this to the job result, which the API can read and evaluate
        resolve(extractions);
      } catch(e) {
        reject(new Error('Failed to parse vision worker output'));
      }
    });
  });
}, { connection });

worker.on('completed', job => {
  console.log(`Job ${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
  console.log(`Job ${job.id} has failed with ${err.message}`);
});

console.log('Background Worker Queue is listening for jobs...');
