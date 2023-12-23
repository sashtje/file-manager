import { EOL, cpus, homedir, userInfo, arch } from "node:os";

import { InvalidInputError, OperationFailedError } from "../helpers/errors.js";

export class Os {
  static os(flag) {
    if (!flag) {
      throw new InvalidInputError("no flag specified");
    }

    try {
      switch (flag) {
        case "--EOL":
          if (EOL === "\n") {
            console.log("\\n");
          } else {
            console.log("\\r\\n");
          }
          return;

        case "--cpus":
          const data = cpus();
          console.log("Total CPUs count: ", data.length);
          data.forEach((cpu, index) =>
            console.log(`CPU №${index + 1}: model: ${cpu.model}`)
          );
          return;

        case "--homedir":
          console.log(homedir());
          return;

        case "--username":
          console.log(userInfo().username);
          return;

        case "--architecture":
          console.log(arch());
          return;

        default:
          throw new InvalidInputError("flag not supported");
      }
    } catch (err) {
      throw new OperationFailedError(err.message);
    }
  }
}
