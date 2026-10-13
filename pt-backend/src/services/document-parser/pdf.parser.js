import { readFile } from "node:fs/promises";
import { PDFParse } from "pdf-parse";

export const parsePdf = async (filePath) => {
    // if (!filePath) throw new Error("PDF file path is required");

    const data = await readFile(filePath);
    const parser = new PDFParse({ data });
    
    const result = await parser.getText();

    if (!result || typeof result.text !== "string") {
        throw new Error("Failed to extract text from PDF");
    }

    return result.text;
};
