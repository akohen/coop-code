import { execute } from "./actions";
import { appResponse, Backend } from "./typings";


export default (playerName: string, command: string, backend: Backend) : {data?:appResponse, errors?:string} => {
  if(command == undefined || typeof command != "string") return {errors: "no command provided"}
  if(playerName == undefined || typeof playerName != "string") return {errors: "no playerid provided"}
  let player = backend.getPlayer(playerName)
  if(!player) {
    player = backend.createPlayer(playerName)
    command = ''
    return {data: {output: `Player ${playerName} created.\nType 'help' for commands`, prompt: player.prompt}}
  }
  try {
    const ctx = {player, expedition:player.expedition, backend}
    return {data:execute(ctx, command)}
  } catch (error) {
    return {
      errors: error.message
    }
  }
};
