import { normalize, isAbsolute } from "node:path";

import { UserInfo } from "./user-info.js";

export function getCommandArgs(pathChunks) {
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

  return args;
}

export function convertPathToAbsolute(path) {
  if (!isAbsolute(path)) {
    return normalize(UserInfo.currentDirectory + "/" + path);
  }

  return path;
}

export function getCommandArgsWithAbsolutePath(pathChunks) {
  return getCommandArgs(pathChunks).map(convertPathToAbsolute);
}

export function isCorrectFileName(fileName) {
  const forbiddenChars = ["\\", "/", ":", "*", "?", '"', "<", ">", "|"];
  return forbiddenChars.every((char) => !fileName.includes(char));
}
