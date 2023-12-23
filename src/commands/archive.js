import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { createBrotliCompress, createBrotliDecompress } from "node:zlib";

import { InvalidInputError, OperationFailedError } from "../helpers/errors.js";
import { getCommandArgsWithAbsolutePath } from "../helpers/getArgsFromArgsChunks.js";

export class Archive {
  static async compress(...chunksArgs) {
    let [pathToFile, pathToDest, ...rest] =
      getCommandArgsWithAbsolutePath(chunksArgs);

    if (!pathToFile || !pathToDest) {
      throw new InvalidInputError("too little arguments");
    }

    if (rest.length) {
      throw new InvalidInputError("too many arguments");
    }

    try {
      const input = createReadStream(pathToFile);
      const output = createWriteStream(pathToDest);
      const brotli = createBrotliCompress();

      await pipeline(input, brotli, output);
    } catch (err) {
      throw new OperationFailedError(err.message);
    }
  }

  static async decompress(...chunksArgs) {
    let [pathToFile, pathToDest, ...rest] =
      getCommandArgsWithAbsolutePath(chunksArgs);

    if (!pathToFile || !pathToDest) {
      throw new InvalidInputError("too little arguments");
    }

    if (rest.length) {
      throw new InvalidInputError("too many arguments");
    }

    try {
      const input = createReadStream(pathToFile);
      const output = createWriteStream(pathToDest);
      const brotli = createBrotliDecompress();

      await pipeline(input, brotli, output);
    } catch (err) {
      throw new OperationFailedError(err.message);
    }
  }
}
