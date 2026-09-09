const { Queue } = require('bullmq');

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
};

const complianceQueue = new Queue('compliance-jobs', { connection });

module.exports = { complianceQueue };
