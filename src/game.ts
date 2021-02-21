import { execute } from "./actions";
import { appResponse, Backend } from "./typings";


export default async (playerID: string, secret: string, command: string, backend: Backend) : Promise<{ data?: appResponse; errors?: string; }> => {
  if(command == undefined || typeof command != "string") return {errors: "no command provided"}
  if(playerID == undefined || typeof playerID != "string") return {errors: "no playerid provided"}
  if(secret == undefined || typeof secret != "string") return {errors: "no secret provided"}
  const player = await backend.getPlayer(playerID, secret)
  if(!player) return {errors: 'Incorrect player data, please log in again'}
  try {
    const ctx = {player, get expedition() {return this.player.expedition}, backend}
    return {data:await execute(ctx, command)}
  } catch (error) {
    return {
      errors: error.message
    }
  }
};
