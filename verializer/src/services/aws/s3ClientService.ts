import AWS from "aws-sdk";

import awsConfig from "../../config/awsConfig";
import {
  GetObjectRequest,
  ListObjectsV2Request,
  PutObjectRequest,
} from "aws-sdk/clients/s3";

// Update the config for aws
AWS.config.update(awsConfig);

// Initialize and export the s3Client
export const s3Client: AWS.S3 = new AWS.S3();

export default class S3ClientService {
  private s3: AWS.S3;

  constructor(s3Service: AWS.S3) {
    this.s3 = s3Service;
  }

  public async uploadFile(
    bucketName: string,
    key: string,
    body: AWS.S3.Body,
    contentType: string
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    const params: PutObjectRequest = {
      Bucket: bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    };

    return this.s3.upload(params).promise();
  }

  public async getFile(
    bucketName: string,
    key: string
  ): Promise<AWS.S3.GetObjectOutput> {
    const params: GetObjectRequest = {
      Bucket: bucketName,
      Key: key,
    };

    return this.s3.getObject(params).promise();
  }

  public async listObjects(
    bucketName: string,
    prefix?: string
  ): Promise<AWS.S3.ListObjectsV2Output> {
    const params: ListObjectsV2Request = {
      Bucket: bucketName,
      Prefix: prefix,
    };

    return this.s3.listObjectsV2(params).promise();
  }
}
