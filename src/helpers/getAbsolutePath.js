import { normalize, isAbsolute } from "node:path";

import { UserInfo } from "../helpers/user-info.js";
import { InvalidInputError } from "../helpers/errors.js";

export function getAbsolutePath(pathChunks, numberArgs) {
  let args = [];
  let chunksInOnePath = "";

  for (let i = 0; i < pathChunks.length; i++) {
    let pathItem = pathChunks[i];

    if (pathItem.startsWith('"')) {
      if (pathItem.endsWith('"')) {
        args.push(pathItem.slice(1, -1));
      } else {
        chunksInOnePath = pathItem;
      }
    } else if (pathItem.endsWith('"')) {
      chunksInOnePath += ` ${pathItem}`;
      chunksInOnePath = chunksInOnePath.slice(1, -1);
      args.push(chunksInOnePath);
      chunksInOnePath = "";
    } else if (chunksInOnePath) {
      chunksInOnePath += ` ${pathItem}`;
    } else {
      args.push(pathItem);
    }
  }

  if (args.length > numberArgs) {
    throw new InvalidInputError("too many arguments");
  } else if (args.length < numberArgs) {
    throw new InvalidInputError("too little arguments");
  }

  args = args.map((pathItem) => {
    if (!isAbsolute(pathItem)) {
      return normalize(UserInfo.currentDirectory + "/" + pathItem);
    }

    return pathItem;
  });

  return args;
}
