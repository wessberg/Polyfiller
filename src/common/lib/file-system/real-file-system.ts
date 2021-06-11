import {getFileSystem} from "./file-system";
import fs from "fs";

export const realFileSystem = getFileSystem(fs);
