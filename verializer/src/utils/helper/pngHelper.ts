import { Express } from "express";

class PngHelper {
  private readonly pngFile: Express.Multer.File;

  constructor(pngFile: Express.Multer.File) {
    this.pngFile = pngFile;
  }

  getMetadata(): void {}

  analyze(): void {}
}

export default PngHelper;
