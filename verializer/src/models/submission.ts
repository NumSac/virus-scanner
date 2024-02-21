import mongoose from "mongoose";

interface ISubmission {
  filename: string;
  isInfected: boolean;
  cveNumbers?: string[]; // Made optional but defined as an array
  viruses?: string[]; // Made optional
  sha256sum?: string;
  fileLocation?: string;
}

// Document that will be returned
interface SubmissionDoc extends mongoose.Document {
  filename: string;
  isInfected: boolean;
  cveNumbers?: string[];
  viruses?: string[];
  sha256sum?: string;
  fileLocation?: string;
}

interface SubmissionModelInterface extends mongoose.Model<SubmissionDoc> {
  build(attr: ISubmission): SubmissionDoc;
}

const submissionSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    isInfected: {
      type: Boolean,
      required: true,
    },
    cveNumbers: {
      type: [String],
      default: undefined,
    },
    viruses: {
      type: [String],
      default: undefined,
    },
    sha256sum: {
      type: String,
      default: undefined,
    },
    fileLocation: {
      type: String,
      default: undefined,
    },
  },
  {
    timestamps: true, // Optional: add createdAt and updatedAt timestamps
  }
);

// Implement the build method
submissionSchema.statics.build = (attr: ISubmission) => {
  return new Submission(attr);
};

const Submission = mongoose.model<SubmissionDoc, SubmissionModelInterface>(
  "Submission",
  submissionSchema
);

export { Submission, ISubmission, SubmissionDoc };
