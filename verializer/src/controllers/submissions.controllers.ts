import { Request, Response } from "express";
import { clamAVServicePromise } from "../services/clamScanService";
import { Submission } from "../models/submission";
import { createHash } from "crypto";
import S3ClientService, { s3Client } from "../services/aws/s3ClientService";
import { generateUniqueFileName } from "../utils/helper/helpers";
import awsConfig from "../config/awsConfig";

// Initialize S3 service

export const renderUpload = (req: Request, res: Response): any => {
  res.render("uploads/upload");
};

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

    // Initialize s3Service with DI
    const s3Service = new S3ClientService(s3Client);

    // Upload file to s3
    await s3Service.uploadFile(
      "submissions",
      uniqueName,
      file.buffer,
      file.mimetype
    );
    // this is for actual deployment
    //const fileUrl = `https://${awsConfig.bucketName}.s3.${awsConfig.awsRegion}.amazonaws.com/${uniqueName}`;
    const fileUrl = `http://localhost:4566/${uniqueName}`;

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
        },
      });
    }
  } catch (err) {
    console.error("Error scanning the file:", err);
    // Handle errors appropriately
    return res.status(500).render("error", {
      message: "An error occurred while scanning the file.",
      fileInfo: {
        fileName: req.file ? req.file.originalname : "Unknown",
        isInfected: null,
        viruses: "",
      },
    });
  }
};

export const getSubmissions = (req: Request, res: Response): any => {
  try {
    const s3Service = new S3ClientService(s3Client);

    const items = s3Service.listObjects(awsConfig.bucketName!);

    return res.render("submissions/index", items);
  } catch (err: unknown) {
    console.log("Error while retrieving uploads");
  }
};

const calculateSha256Checksum = (buffer: Buffer): string => {
  return createHash("sha256").update(buffer).digest("hex");
};
