import { execute, getState } from "./actions";
import { expedition, Player } from './expedition';

type appResponse = {
  errors?: string,
  output?: string,
  prompt?: string,
  expedition?: unknown
}

function getPlayer(id: string): Player {
  return expedition.players[id]
}

export default (data: {[idx:string]:unknown}) : appResponse => {
  if(data['cmd'] != undefined && typeof data['cmd'] == "string") {
    const args = data["cmd"].split(/ +(.*)/)
    try {
      const ctx = {player: getPlayer('foo'), expedition}
      return {
        output: execute(ctx, args[0], args[1]),
        expedition: {state:getState(), path: getPlayer('foo').nodes}
      }
    } catch (error) {
      return {
        errors: error.message
      }
    }
    
  } else return {
    errors: "no command provided"
  }
};
