import { createInterface } from "node:readline";
import { homedir } from "node:os";

function getUsername() {
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

function showPrompt() {
  process.stdout.write("> ");
}

function showWelcome(username) {
  console.log(`Welcome to the File Manager, ${username}!`);
}

function showGoodbye({ username, lineBreaks }) {
  if (lineBreaks) {
    process.stdout.write("\n".repeat(lineBreaks));
  }

  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
}

function showCurrentDir(dir) {
  console.log(`\nYou are currently in ${dir}`);
}

function showInvitation(dir) {
  showCurrentDir(dir);
  showPrompt();
}

function start() {
  let username = getUsername();
  let currentDir = homedir();

  let rl = createInterface({
    input: process.stdin,
    output: process.strdout,
  });

  rl.on("line", (input) => {
    let line = input.trim();

    if (line === ".exit") {
      showGoodbye({ username, lineBreaks: 1 });
      process.exit();
    }

    // manager

    showInvitation(currentDir);
  });

  if (process.platform === "win32") {
    rl.on("SIGINT", () => process.emit("SIGINT"));
  }

  process.on("SIGINT", () => {
    showGoodbye({ username, lineBreaks: 2 });
    process.exit();
  });

  showWelcome(username);
  showInvitation(currentDir);
}

start();
