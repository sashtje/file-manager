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

function showWelcome(username) {
  console.log(`Welcome to the File Manager, ${username}!`);
}

function start() {
  let username = getUsername();
  showWelcome(username);
}

start();
