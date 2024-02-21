import NodeClam from "clamscan";
import { clamOptions, clamDevOptions } from "../config/clamConfig";
import { Readable } from "stream";

interface IClamAVScanResults {
  isInfected: boolean;
  viruses: string[];
}

class ClamAVService {
  private static instance: ClamAVService | null = null;
  private clamAV: NodeClam;

  private constructor(clamAV: NodeClam) {
    this.clamAV = clamAV;
  }

  public static async getInstance(): Promise<ClamAVService> {
    if (!ClamAVService.instance) {
      const clamAV = await new NodeClam().init(clamDevOptions);
      ClamAVService.instance = new ClamAVService(clamAV);
    }
    return ClamAVService.instance;
  }

  public async scanSubmission(
    file: Express.Multer.File
  ): Promise<IClamAVScanResults> {
    try {
      const { isInfected, viruses } = await this.clamAV.scanStream(
        this.bufferToStream(file.buffer)
      );

      return { isInfected, viruses };
    } catch (err: any) {
      console.error("[!] Error while scanning file buffer", err);
      return {
        isInfected: false,
        viruses: [],
      };
    }
  }
  // We need this function to convert the submitted file into a readable stream for clamAV
  private bufferToStream(buffer: Buffer): Readable {
    const readableStream = new Readable({
      read() {
        this.push(buffer);
        this.push(null); // Singal end of stream
      },
    });
    return readableStream;
  }
}

export const clamAVServicePromise = ClamAVService.getInstance();
