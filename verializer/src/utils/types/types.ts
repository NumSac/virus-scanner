const magicBytesMap: Record<string, string[]> = {
  "25504446": ["pdf"], // PDF
  ffd8ff: ["jpg"], // JPEG
  "504b0304": ["docx"], // DOCX (ZIP file, start with PK)
  "89504e47": ["png"], // PNG
  "4d5a": ["exe", "dll"], // EXE, DLL (Windows executable files)
  "7f454c46": ["so"], // Shared Object (Linux)
};

type FileDisplayProperties = {
  FileName: string;
  FileType: string;
  FileSize: number;
};

export { magicBytesMap, FileDisplayProperties };
