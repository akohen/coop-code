import { execute } from "./actions";
import { appResponse } from "./typings";
import { create } from "./expeditions/test";

const expedition = create().addPlayer('bob').addPlayer('foo')

export default (data: {[idx:string]:unknown}) : appResponse => {
  if(data['cmd'] != undefined && typeof data['cmd'] == "string") {
    try { // TODO: distinguish game error output from API errors (data:errors vs errors)
      const ctx = {player: expedition.players['foo'], expedition}
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
