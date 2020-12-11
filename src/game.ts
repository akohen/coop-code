import { execute, getState } from "./actions";
import { cmdReturn } from "./typings";

type appResponse = {
  errors?: string,
  data?: cmdReturn,
  expedition?: unknown
}

export default (data: {[idx:string]:unknown}) : appResponse => {
  if(data['cmd'] != undefined && typeof data['cmd'] == "string") {
    const args = data["cmd"].split(/ +(.*)/)
    return {
      data: execute(args[0], args[1]),
      expedition: getState()
    }
  } else return {
    errors: "no command provided"
  }
};
