import { Request, Response } from "express";
import { Submission } from "../models/submission";

export const getAll = (req: Request, res: Response): any => {
  res.render("upload");
};

export const getSubmission = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const submissionId = req.params.id;

    if (!submissionId) {
      return res.status(400).send({ message: "Submission ID is required" });
    }

    const submission = await Submission.findById(submissionId);

    if (!submission) {
      // If no submission is found with the provided ID, return an error
      return res.status(404).send({ message: "Submission not found" });
    }

    res.status(200).json(submission);
  } catch (err: any) {
    // If error occurs, return error message
    res.status(500).send({ message: "Server error", error: err.message });
  }
};
