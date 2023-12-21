import { createReadStream } from "node:fs";
import { open } from "node:fs/promises";
import { pipeline } from "node:stream/promises";

import { InvalidInputError, OperationFailedError } from "../helpers/errors.js";
import { getAbsolutePath } from "../helpers/getAbsolutePath.js";

export class BasicOperations {
  static async cat(...chunksArgs) {
    let [pathToFile] = getAbsolutePath(chunksArgs, 1);

    try {
      const input = createReadStream(pathToFile);

      await pipeline(input, process.stdout, { end: false });
    } catch (err) {
      if (err.code === "ENOENT") {
        throw new InvalidInputError("no such file or directory");
      } else {
        throw new OperationFailedError(err.message);
      }
    }
  }

  static async add(...newFileNameChunks) {
    const input = newFileNameChunks.join(" ");

    if (input.includes("/") || input.includes("\\")) {
      throw new InvalidInputError("invalid file name");
    }

    let [fileName] = getAbsolutePath(newFileNameChunks, 1);

    try {
      await open(fileName, "wx+");
    } catch (err) {
      throw new OperationFailedError(err.message);
    }
  }

  static async rn(pathToFile, newFileName) {}

  static async cp(pathToFile, pathToNewDirectory) {}

  static async mv(pathToFile, pathToNewDirectory) {}

  static async rm(pathToFile) {}
}
