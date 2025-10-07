import { config } from 'dotenv';
import express from 'express';
config();
const app = express();
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
//# sourceMappingURL=index.js.map