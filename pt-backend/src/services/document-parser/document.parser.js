import path from "node:path";
import { parseDocx } from "./docx.parser.js";
import { parsePdf } from "./pdf.parser.js";

const parsersByExtension = new Map([
    [".pdf", parsePdf],
    [".docx", parseDocx],
]);

export const parseDocument = async (filePath) => {
    if (!filePath) throw new Error("Document file path is required");

    const extension = path.extname(filePath).toLowerCase();
    const parser = parsersByExtension.get(extension);
    if (!parser) {
        throw new Error("Unsupported document. Upload a PDF or DOCX file.");
    }

    return parser(filePath);
};
