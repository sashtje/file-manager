import { sep } from "node:path";
import { createReadStream } from "node:fs";
import { open, rename, stat } from "node:fs/promises";
import { pipeline } from "node:stream/promises";

import { InvalidInputError, OperationFailedError } from "../helpers/errors.js";
import {
  getCommandArgsWithAbsolutePath,
  getCommandArgs,
  convertPathToAbsolute,
  isCorrectFileName,
} from "../helpers/getArgsFromArgsChunks.js";

export class BasicOperations {
  static async cat(...chunksArgs) {
    let [pathToFile, ...rest] = getCommandArgsWithAbsolutePath(chunksArgs);

    if (!pathToFile) {
      throw new InvalidInputError("file path not specified");
    }

    if (rest.length) {
      throw new InvalidInputError("too many arguments");
    }

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

  static async add(...chunksArgs) {
    let [fileName, ...rest] = getCommandArgs(chunksArgs);

    if (!fileName) {
      throw new InvalidInputError("file path not specified");
    } else if (!isCorrectFileName(fileName)) {
      throw new InvalidInputError("invalid file name");
    }

    if (rest.length) {
      throw new InvalidInputError("too many arguments");
    }

    const absolutePathToFile = convertPathToAbsolute(fileName);

    try {
      await open(absolutePathToFile, "wx+");
    } catch (err) {
      throw new OperationFailedError(err.message);
    }
  }

  static async rn(...chunksArgs) {
    let [pathToFile, newFileName, ...rest] = getCommandArgs(chunksArgs);

    if (!pathToFile || !newFileName) {
      throw new InvalidInputError("too little arguments");
    }

    if (!isCorrectFileName(newFileName)) {
      throw new InvalidInputError("invalid file name");
    }

    if (rest.length) {
      throw new InvalidInputError("too many arguments");
    }

    const absolutePathToFile = convertPathToAbsolute(pathToFile);
    const pathToNewNameFile = absolutePathToFile
      .split(sep)
      .slice(0, -1)
      .concat(newFileName)
      .join(sep);

    try {
      const statResult = await stat(absolutePathToFile);

      if (!statResult.isFile()) {
        throw new InvalidInputError("first argument is not a file path");
      }

      await rename(absolutePathToFile, pathToNewNameFile);
    } catch (err) {
      throw new OperationFailedError(err.message);
    }
  }

  static async cp(...chunksArgs) {}

  static async mv(...chunksArgs) {}

  static async rm(...chunksArgs) {}
}
