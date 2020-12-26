import { execute } from "./actions";
import { appResponse } from "./typings";
import { getPlayer } from "./backends/memory";


export default (data: {[idx:string]:unknown}) : {data?:appResponse, errors?:string} => {
  if(data['cmd'] == undefined || typeof data['cmd'] != "string") return {errors: "no command provided"}
  if(data['player'] == undefined || typeof data['player'] != "string") return {errors: "no playerid provided"}
  const player = getPlayer(data['player'])
  if(!player) return {errors: "player not found"}
  try {
    const ctx = {player, expedition:player.expedition}
    return {data:execute(ctx, data['cmd'])}
  } catch (error) {
    return {
      errors: error.message
    }
  }
};
