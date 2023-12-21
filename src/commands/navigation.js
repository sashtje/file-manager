import { normalize } from "node:path";
import { readdir } from "node:fs/promises";

import { UserInfo } from "../helpers/user-info.js";
import { OperationFailedError } from "../helpers/errors.js";
import { getAbsolutePath } from "../helpers/getAbsolutePath.js";

export class Navigation {
  static up() {
    UserInfo.currentDirectory = normalize(UserInfo.currentDirectory + "/..");
  }

  static async cd(...chunksArgs) {
    let [pathToDirectory] = getAbsolutePath(chunksArgs, 1);

    try {
      await readdir(pathToDirectory);
      UserInfo.currentDirectory = pathToDirectory;
    } catch {
      throw new OperationFailedError("no such directory");
    }
  }

  static async ls() {
    const DIRECTORY = "directory";
    const FILE = "file";

    try {
      const filesAndFolders = await readdir(UserInfo.currentDirectory, {
        withFileTypes: true,
      });
      const filesAndFoldersSorted = filesAndFolders
        .map((item) => ({
          Name: item.name,
          Type: item.isFile() ? FILE : DIRECTORY,
        }))
        .sort((a, b) => {
          if (a.Type === DIRECTORY && b.Type === FILE) {
            return -1;
          }

          if (a.Type === FILE && b.Type === DIRECTORY) {
            return 1;
          }

          return a.Name.localeCompare(b.Name);
        });

      console.table(filesAndFoldersSorted);
    } catch (err) {
      throw new OperationFailedError(err.message);
    }
  }
}
