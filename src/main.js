import { createInterface } from "node:readline";

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

function showGoodbye(username) {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
}

function start() {
  let username = getUsername();

  showWelcome(username);
  showPrompt();

  let rl = createInterface({
    input: process.stdin,
    output: process.strdout,
  });

  rl.on("line", (input) => {
    let line = input.trim();

    if (line === ".exit") {
      process.emit("SIGINT");
      return;
    }

    showPrompt();
  });

  if (process.platform === "win32") {
    rl.on("SIGINT", () => process.emit("SIGINT"));
  }

  process.on("SIGINT", () => {
    showGoodbye(username);
    process.exit();
  });
}

start();
