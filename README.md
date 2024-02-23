# Virus Scanner Project

## Overview

The Virus Scanner project is a comprehensive solution for scanning files for viruses and malware, powered by ClamAV. It leverages Amazon S3 for secure file storage, MongoDB for efficient submission tracking, and is deployable on AWS Elastic Beanstalk for robust scalability. This Node.js application offers a straightforward way for users to upload files and receive detailed analyses, making it an essential tool for maintaining digital hygiene.

## Features

- **Secure File Upload**: Users can upload files to Amazon S3 for scanning.
- **Detailed Virus Analysis**: Utilizes the ClamAV antivirus engine to scan uploaded files for viruses and malware.
- **Efficient Submission Tracking**: Tracks each file submission and its analysis result in MongoDB.
- **Scalable Architecture**: Ready for deployment on AWS Elastic Beanstalk, ensuring easy scalability and manageability.
- **Local and Cloud Deployment Options**: Supports deployment both locally using Docker Compose and in the cloud with AWS services.

## Prerequisites

Before setting up the project, ensure you have the following prerequisites installed and configured:

- An AWS account with access to S3, Elastic Beanstalk, and IAM for AWS credentials.
- MongoDB instance for storing submission data.
- Docker and Docker Compose for local deployment.
- Node.js environment setup for development.

## Setup Instructions

### Configuring Environment Variables

Set up your environment by creating a `.env` file in the `verializer` directory with the following structure:

```plaintext
PORT=3000
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=your_aws_region
AWS_BUCKET=verializer-submissions-bucket
MONGO_DB_NAME=reports
MONGO_USER=mongoadmin
MONGO_PASSWORD=secret
