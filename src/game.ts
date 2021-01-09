import { execute } from "./actions";
import { appResponse, Backend } from "./typings";


export default async (playerName: string, command: string, backend: Backend) : Promise<{ data?: appResponse; errors?: string; }> => {
  if(command == undefined || typeof command != "string") return {errors: "no command provided"}
  if(playerName == undefined || typeof playerName != "string") return {errors: "no playerid provided"}
  let player = await backend.getPlayer(playerName)
  if(!player) {
    player = await backend.createPlayer(playerName)
    command = ''
    return {data: {output: `Player ${playerName} created.\nType 'help' for commands`, prompt: player.prompt}}
  }
  try {
    const ctx = {player, get expedition() {return this.player.expedition}, backend}
    return {data:await execute(ctx, command)}
  } catch (error) {
    return {
      errors: error.message
    }
  }
};
