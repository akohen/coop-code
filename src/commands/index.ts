import { Command } from "../typings";
import { connect } from "./connect";
import { echo } from "./echo";
import { exit } from "./exit";
import { expedition } from "./expedition";
import { help } from "./help";
import { ls } from "./ls";
import { read } from "./read";
import { scan } from "./scan";
import { set } from "./set";

export const commands:Map<string, Command> = new Map(Object.entries({
  connect,
  echo,
  exit,
  expedition,
  help,
  ls,
  read,
  scan,
  set,
}));