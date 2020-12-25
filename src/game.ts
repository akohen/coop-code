import { execute } from "./actions";
import { appResponse } from "./typings";
import { create } from "./expeditions/test";

const expedition = create().addPlayer('bob').addPlayer('foo')

export default (data: {[idx:string]:unknown}) : {data?:appResponse, errors?:string} => {
  if(data['cmd'] != undefined && typeof data['cmd'] == "string") {
    try {
      const ctx = {player: expedition.players['foo'], expedition}
      return {data:execute(ctx, data['cmd'])}
    } catch (error) {
      return {
        errors: error.message
      }
    }
  } else return {
    errors: "no command provided"
  }
};
