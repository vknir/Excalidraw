

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname manually (since it's not available in ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename).split("\\")
__dirname.splice(-1, 1)
const pathName = __dirname.join("\\") + "\\.env";
dotenv.config({ path: pathName })

export const JWT_SECRET = process.env.JWT_SECRET || "";
