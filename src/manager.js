import { createInterface } from "node:readline";

import { UserInfo } from "./helpers/user-info.js";
import { InvalidInputError } from "./helpers/errors.js";
import { Navigation } from "./commands/navigation.js";
import { BasicOperations } from "./commands/basic-operations.js";
import { Os } from "./commands/os-info.js";
import { Hash } from "./commands/hash.js";
import { Archive } from "./commands/archive.js";

export class FileManager {
  constructor() {
    this.initIO();
  }

  initIO() {
    let rl = createInterface({
      input: process.stdin,
      output: process.strdout,
    });

    rl.on("line", async (input) => {
      let line = input.trim();

      if (line === ".exit") {
        this.showGoodbye({ lineBreaks: 1 });
        process.exit();
      }

      if (line) {
        await this.handleInput(line);
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
    console.log(`Welcome to the File Manager, ${UserInfo.username}!`);
  }

  showGoodbye({ lineBreaks }) {
    if (lineBreaks) {
      process.stdout.write("\n".repeat(lineBreaks));
    }

    console.log(
      `Thank you for using File Manager, ${UserInfo.username}, goodbye!`
    );
  }

  showCurrentDirectory() {
    console.log(`\nYou are currently in ${UserInfo.currentDirectory}`);
  }

  showInvitation() {
    this.showCurrentDirectory();
    this.showPrompt();
  }

  async handleInput(line) {
    const [command, ...args] = line.split(" ").filter((item) => !!item);

    try {
      if (Navigation[command]) {
        await Navigation[command](...args);
      } else if (BasicOperations[command]) {
        await BasicOperations[command](...args);
      } else if (Os[command]) {
        await Os[command](...args);
      } else if (Hash[command]) {
        await Hash[command](...args);
      } else if (Archive[command]) {
        await Archive[command](...args);
      } else {
        throw new InvalidInputError("no such command exists");
      }
    } catch (err) {
      console.log(err.message);
    }
  }
}
