import { Command } from "../typings";
import { connect } from "./connect";
import { echo } from "./echo";
import { exit } from "./exit";
import { expedition } from "./expedition";
import { grep } from "./grep";
import { head } from "./head";
import { help } from "./help";
import { ls } from "./ls";
import { read } from "./read";
import { scan } from "./scan";
import { set } from "./set";
import { tail } from "./tail";

export const commands:Map<string, Command> = new Map(Object.entries({
  connect,
  echo,
  exit,
  expedition,
  grep,
  head,
  help,
  ls,
  read,
  scan,
  set,
  tail,
}));