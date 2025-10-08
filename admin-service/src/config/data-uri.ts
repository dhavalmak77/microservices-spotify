import DataURIParser from "datauri/parser.js";
import path from "node:path";

const getBuffer = (file: any) => {
    const parser = new DataURIParser();
    const extension = path.extname(file.originalname).toString();

    return parser.format(extension, file.buffer);
};

export default getBuffer;