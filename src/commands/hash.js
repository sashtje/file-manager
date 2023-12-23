import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { pipeline } from "node:stream/promises";

import { getCommandArgsWithAbsolutePath } from "../helpers/getArgsFromArgsChunks.js";
import { InvalidInputError, OperationFailedError } from "../helpers/errors.js";

export class Hash {
  static async hash(...chunksArgs) {
    let [pathToFile, ...rest] = getCommandArgsWithAbsolutePath(chunksArgs);

    if (!pathToFile) {
      throw new InvalidInputError("file path not specified");
    }

    if (rest.length) {
      throw new InvalidInputError("too many arguments");
    }

    try {
      const hash = createHash("sha256");
      const input = createReadStream(pathToFile);

      await pipeline(input, hash.setEncoding("hex"), process.stdout, {
        end: false,
      });
      console.log("");
    } catch (err) {
      throw new OperationFailedError(err.message);
    }
  }
}
