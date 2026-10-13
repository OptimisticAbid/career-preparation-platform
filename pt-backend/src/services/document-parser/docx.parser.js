import mammoth from "mammoth";

export const parseDocx = async (filePath) => {
    if (!filePath) throw new Error("DOCX file path is required");

    const { value } = await mammoth.extractRawText({ path: filePath });
    if (typeof value !== "string") {
        throw new Error("Failed to extract text from DOCX");
    }

    return value;
};
