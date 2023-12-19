import { normalize, isAbsolute } from "node:path";
import { readdir } from "node:fs/promises";

import { UserInfo } from "../helpers/user-info.js";
import { InvalidInputError, OperationFailedError } from "../helpers/errors.js";

export class Navigation {
  static up() {
    UserInfo.currentDirectory = normalize(UserInfo.currentDirectory + "/..");
  }

  static async cd(...pathToDirectoryChunks) {
    let pathToDirectory = pathToDirectoryChunks[0];

    if (!pathToDirectory) {
      throw new InvalidInputError("path not specified");
    }

    if (pathToDirectory.startsWith('"') || pathToDirectory.startsWith("'")) {
      const quotes = pathToDirectory[0];
      pathToDirectory = pathToDirectoryChunks.join(" ");

      if (pathToDirectory.endsWith(quotes)) {
        pathToDirectory = pathToDirectory.slice(1, -1);
      } else if (pathToDirectoryChunks.length > 1) {
        throw new InvalidInputError("too many arguments");
      }
    } else if (pathToDirectoryChunks.length > 1) {
      throw new InvalidInputError("too many arguments");
    }

    if (!isAbsolute(pathToDirectory)) {
      pathToDirectory = normalize(
        UserInfo.currentDirectory + "/" + pathToDirectory
      );
    }

    try {
      await readdir(pathToDirectory);
      UserInfo.currentDirectory = pathToDirectory;
    } catch (err) {
      throw new OperationFailedError("no such directory");
    }
  }

  static ls() {}
}
