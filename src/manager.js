import { homedir } from "node:os";
import { sep } from "node:path";
import { createInterface } from "node:readline";

import { InvalidInputError } from "./errors.js";
import { Navigation } from "./navigation.js";
import { BasicOperations } from "./basic-operations.js";
import { Os } from "./os-info.js";
import { Hash } from "./hash.js";
import { Archive } from "./archive.js";

export class FileManager {
  constructor() {
    this.username = this.getUsername();
    this.currentDirectory = this.getHomeDirectory();

    this.initIO();
  }

  getUsername() {
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

  getHomeDirectory() {
    return homedir().split(sep).join("/");
  }

  initIO() {
    let rl = createInterface({
      input: process.stdin,
      output: process.strdout,
    });

    rl.on("line", (input) => {
      let line = input.trim();

      if (line === ".exit") {
        this.showGoodbye({ lineBreaks: 1 });
        process.exit();
      }

      if (line) {
        this.handleInput(line);
      }

      this.showInvitation();
    });

    if (process.platform === "win32") {
      rl.on("SIGINT", () => process.emit("SIGINT"));
    }

    process.on("SIGINT", () => {
      this.showGoodbye({ lineBreaks: 2 });
      process.exit();
    });

    this.showWelcome();
    this.showInvitation();
  }

  showPrompt() {
    process.stdout.write("> ");
  }

  showWelcome() {
    console.log(`Welcome to the File Manager, ${this.username}!`);
  }

  showGoodbye({ lineBreaks }) {
    if (lineBreaks) {
      process.stdout.write("\n".repeat(lineBreaks));
    }

    console.log(`Thank you for using File Manager, ${this.username}, goodbye!`);
  }

  showCurrentDirectory() {
    console.log(`\nYou are currently in ${this.currentDirectory}`);
  }

  showInvitation() {
    this.showCurrentDirectory();
    this.showPrompt();
  }

  handleInput(line) {
    const [command, ...args] = line.split(" ").filter((item) => !!item);

    try {
      //
    } catch (err) {
      console.log(err.message);
    }
  }
}
