import { execute, getState, cmdReturn } from "./actions";

type appResponse = {
    errors?: string,
    data?: cmdReturn,
    expedition: unknown
}

export default (data: {cmd: string, args: string | undefined}) : appResponse => ({
    data: execute(data.cmd, data.args),
    expedition: getState()
});
