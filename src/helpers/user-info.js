import { homedir } from "node:os";
import { sep } from "node:path";

export class UserInfo {
  static currentDirectory = homedir().split(sep).join("/");
  static #username = UserInfo.#getUsername();

  static #getUsername() {
    let usernameArg = process.argv[2];
    let usernameArgName = "username";
    let username = "Anonymous";

    if (usernameArg) {
      usernameArg = usernameArg.slice(2).split("=");

      if (usernameArg[0] === usernameArgName && usernameArg[1]) {
        username = usernameArg[1];
      }
    }

    return username;
  }

  static get username() {
    return UserInfo.#username;
  }
}
