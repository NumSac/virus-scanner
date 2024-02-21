const awsConfig = {
  endpoint: "http://localhost:4566", // required for localstack
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3ForcePathStyle: true, // required for localstack
  bucketName: process.env.AWS_BUCKET,
  awsRegion: process.env.AWS_REGION,
};

export default awsConfig;
