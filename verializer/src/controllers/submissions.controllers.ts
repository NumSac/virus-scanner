import { Request, Response } from "express";
import { clamAVServicePromise } from "../services/clamScanService";
import { Submission } from "../models/submission";
import { createHash } from "crypto";
import S3ClientService, { s3Client } from "../services/aws/s3ClientService";
import { generateUniqueFileName } from "../utils/helper/helpers";

// Initialize S3 service

// Upload page
export const renderUpload = (req: Request, res: Response): any => {
  res.render("upload");
};

// Post upload <file>
export const submitUpload = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const file = req.file;

    // Check if a file was uploaded
    if (!file) {
      return res.status(400).send("No file was uploaded.");
    }

    const clamScan = await clamAVServicePromise;

    // Scan the uploaded file
    const result = await clamScan.scanSubmission(file);

    const checksum = calculateSha256Checksum(file.buffer);

    const uniqueName = generateUniqueFileName(file.originalname, checksum);

    //Initialize s3Service with DI
    const s3Service = new S3ClientService(s3Client);

    // Upload file to s3
    await s3Service.uploadFile(
      process.env.AWS_BUCKET!,
      uniqueName,
      file.buffer,
      file.mimetype
    );
    // this is for actual deployment
    //const fileUrl = `https://${awsConfig.bucketName}.s3.${awsConfig.awsRegion}.amazonaws.com/${uniqueName}`;
    const fileUrl = `http://localhost:4566/${process.env.AWS_BUCKET}/${uniqueName}`;

    // Save to results to moongo
    const uploadedSubmission = new Submission({
      filename: file.originalname,
      isInfected: result.isInfected,
      cveNumbers: result.viruses,
      viruses: result.viruses,
      sha256sum: checksum,
      fileLocation: fileUrl,
    });

    const savedSubmission = await uploadedSubmission.save();

    // Check the scan result
    if (result.isInfected) {
      // If the file is infected, send information about the detected viruses
      return res.render("result", {
        message: "File is infected",
        fileInfo: {
          fileName: file.originalname,
          isInfected: true,
          viruses: result.viruses.join(", "),
          reportId: savedSubmission._id,
        },
      });
    } else {
      // If the file is clean, inform the user
      return res.render("result", {
        message: "File is clean",
        fileInfo: {
          fileName: file.originalname,
          isInfected: false,
          viruses: "",
          savedSubmission,
          reportId: savedSubmission._id,
        },
      });
    }
  } catch (error) {
    console.error("Error scanning the file:", error);
    return res.render("error", { error });
  }
};

const calculateSha256Checksum = (buffer: Buffer): string => {
  return createHash("sha256").update(buffer).digest("hex");
};
