import { execute } from "./actions";
import { expedition, Player } from './expedition';
import { appResponse } from "./typings";

function getPlayer(id: string): Player {
  return expedition.players[id]
}

export default (data: {[idx:string]:unknown}) : appResponse => {
  if(data['cmd'] != undefined && typeof data['cmd'] == "string") {
    try { // TODO: distinguish game error output from API errors (data:errors vs errors)
      const ctx = {player: getPlayer('foo'), expedition}
      return execute(ctx, data['cmd'])
    } catch (error) {
      return {
        errors: error.message
      }
    }
    
  } else return {
    errors: "no command provided"
  }
};
