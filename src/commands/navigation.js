import { normalize } from "node:path";

import { UserInfo } from "../helpers/user-info.js";
import { InvalidInputError, OperationFailedError } from "../helpers/errors.js";

export class Navigation {
  static up() {
    UserInfo.currentDirectory = normalize(UserInfo.currentDirectory + "/..");
  }

  static cd(pathToDirectory) {}

  static ls() {}
}
