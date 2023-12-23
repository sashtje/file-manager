import { sep, normalize } from "node:path";
import { createReadStream, createWriteStream } from "node:fs";
import { open, rename, unlink } from "node:fs/promises";
import { pipeline } from "node:stream/promises";

import { InvalidInputError, OperationFailedError } from "../helpers/errors.js";
import {
  getCommandArgsWithAbsolutePath,
  getCommandArgs,
  convertPathToAbsolute,
  isCorrectFileName,
  validateIfPathToFile,
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
      console.log("");
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
      await validateIfPathToFile(absolutePathToFile);

      await rename(absolutePathToFile, pathToNewNameFile);
    } catch (err) {
      if (err instanceof InvalidInputError) {
        throw err;
      }
      throw new OperationFailedError(err.message);
    }
  }

  static async cp(...chunksArgs) {
    let [pathToFile, pathToDirectory, ...rest] =
      getCommandArgsWithAbsolutePath(chunksArgs);

    if (!pathToFile || !pathToDirectory) {
      throw new InvalidInputError("too little arguments");
    }

    if (rest.length) {
      throw new InvalidInputError("too many arguments");
    }

    const pathToCopy = normalize(
      pathToDirectory + "/" + pathToFile.split(sep).at(-1)
    );

    try {
      await validateIfPathToFile(pathToFile);

      const input = createReadStream(pathToFile);
      const output = createWriteStream(pathToCopy, { flags: "wx" });

      await pipeline(input, output);
    } catch (err) {
      if (err instanceof InvalidInputError) {
        throw err;
      }
      throw new OperationFailedError(err.message);
    }
  }

  static async mv(...chunksArgs) {}

  static async rm(...chunksArgs) {
    let [pathToFile, ...rest] = getCommandArgsWithAbsolutePath(chunksArgs);

    if (!pathToFile) {
      throw new InvalidInputError("too little arguments");
    }

    if (rest.length) {
      throw new InvalidInputError("too many arguments");
    }

    try {
      await validateIfPathToFile(pathToFile);

      await unlink(pathToFile);
    } catch (err) {
      if (err instanceof InvalidInputError) {
        throw err;
      }
      throw new OperationFailedError(err.message);
    }
  }
}
