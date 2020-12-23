import { execute, getState } from "./actions";

type appResponse = {
  errors?: string,
  data?: string,
  expedition?: unknown
}

export default (data: {[idx:string]:unknown}) : appResponse => {
  if(data['cmd'] != undefined && typeof data['cmd'] == "string") {
    const args = data["cmd"].split(/ +(.*)/)
    try {
      return {
        data: execute(args[0], args[1]),
        expedition: getState()
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
