import DataURIParser from "datauri/parser.js";
import path from "node:path";
const getBuffer = (file) => {
    const parser = new DataURIParser();
    const extension = path.extname(file.originalname).toString();
    return parser.format(extension, file.buffer);
};
export default getBuffer;
//# sourceMappingURL=data-uri.js.map