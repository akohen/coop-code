import { Node } from "../../typings";

const createNode = (welcome: string, files: {[id: string]:string}): Node => {
    return {
        welcome: () => welcome,
        files,
    }
}

export { createNode as doc }