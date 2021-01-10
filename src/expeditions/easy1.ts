import { Expedition } from "../expedition";
import { ExpeditionFactory } from "../expedition-factory";
import { Node } from "../typings";
import { sampleData } from "./data";
import { passwdGen } from "./data/files";
import { remindTime } from "./functions/auto_commands";
import { ceasar } from "./functions/ciphers";
import { chat } from "./modules/chat";

export const easy1 = new ExpeditionFactory({type:'easy1', players:1, difficulty:'easy', 
create:(variables) => {
  const users = sampleData.users.sample(10)
  users[5] = 'admin'
  const passwords = sampleData.passwords.fakeWords.sample(10)
  const pwd1 = passwords[5]
  const passwd = passwdGen(users, passwords.map(e => ceasar(e,6)))
  const nodes: {[idx: string]: Node} = {
    'access-point': {
      welcome:() => `Welcome to this expedition. TODO ${Math.random()}\nSample user:${sampleData.passwords.fakeWords.random()}`,
      files:{foo:sampleData.passwords.fakeWords.random()},
    },
    locked: {
      welcome:(ctx) => {
        ctx.player.input = '_unlock-ceasar'
        throw new Error('Access denied, enter admin password')
      },
    },
    logs: {files:{'last-logins':'foo',passwd}},
    security: {},
  };

  const endDate = new Date()
  endDate.setMinutes(endDate.getMinutes() + 60)
  const exp = new Expedition({
      nodes,
      endDate,
      startNode: () => 'access-point',
      variables,
  })
  exp
    .addModule(chat)
  .commands
    .set('_auto_remindtime', remindTime)
    .set('_unlock-ceasar',{run:(ctx, args) => {
      if(args !== pwd1) throw new Error('Incorrect password')
      if(ctx.player.currentNodeName != 'locked') ctx.player.nodes.push('locked')
      return 'Unlocked'
    }, help:() => '>'})
  return exp
}})