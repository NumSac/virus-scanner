import { Request, Response } from "express";
import PDFDocument from "pdfkit";
import { Submission } from "../models/submission";
import S3ClientService, { s3Client } from "../services/aws/s3ClientService";
import { Readable, pipeline } from "stream";
import JSZip from "jszip";

// getReports with error response
export const getReports = async (req: Request, res: Response): Promise<any> => {
  const submissions = await Submission.find({});
  res.status(200).render("reports/index", { submissions });
};

// getReport with structured error handling
export const getReport = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const submission = await Submission.findById(id);

    if (!id) {
      return res
        .status(400)
        .render("error", { message: "Submission ID is required" });
    }

    if (!submission) {
      return res.status(404).render("error", { message: "Report not found" });
    }

    res.status(200).render("reports/show", { submission });
  } catch (err) {
    res.status(500).render("error", { err });
  }
};

export const downloadReport = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const requestedReport = await Submission.findById(id);
    if (!requestedReport || !requestedReport.fileLocation) {
      return res
        .status(404)
        .json({ message: "No report found with the given ID." });
    }

    const s3Service = new S3ClientService(s3Client);
    const uniqueName = requestedReport.fileLocation.split("/").pop();
    const fileOutput = await s3Service.getFile(
      process.env.AWS_BUCKET!,
      uniqueName!
    );

    // Initialize PDF document
    const doc = new PDFDocument();
    const pdfBuffers: any[] = [];
    doc.on("data", (data) => pdfBuffers.push(data));
    doc.on("end", () => {
      // After PDF is generated
      const pdfData = Buffer.concat(pdfBuffers);
      const zip = new JSZip();

      // Add generated PDF to zip
      zip.file("report.pdf", pdfData);

      // Convert S3 file to stream if necessary and add to zip instmce
      if (
        fileOutput.Body instanceof Buffer ||
        fileOutput.Body instanceof Uint8Array
      ) {
        zip.file(uniqueName!, fileOutput.Body);
        finalizeZip(zip, res);
      } else if (fileOutput.Body instanceof Readable) {
        // Readable streams can be directly added
        zip.file(uniqueName!, fileOutput.Body);
        finalizeZip(zip, res);
      } else {
        throw new Error("Unsupported file type from S3");
      }
    });

    // Generate pdf content
    doc.fontSize(12).text(JSON.stringify(requestedReport.toObject(), null, 2), {
      align: "left",
    });
    doc.end();
  } catch (err) {
    console.error("Failed to download report:", err);
    res.status(500).json({
      message: "Failed to download the report due to an internal error.",
    });
  }
};

async function finalizeZip(zip: any, res: Response) {
  const filename = `Report-${new Date().getTime()}.zip`;
  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

  zip
    .generateNodeStream({ type: "nodebuffer", streamFiles: true })
    .pipe(res)
    .on("finish", function () {
      res.end();
    });
}
