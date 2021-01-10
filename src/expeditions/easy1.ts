import { Expedition } from "../expedition";
import { ExpeditionFactory } from "../expedition-factory";
import { Node } from "../typings";
import { em } from "../utils";
import { sampleData } from "./data";
import { passwdGen } from "./data/files";
import { remindTime } from "./functions/auto_commands";
import { caesar } from "./functions/ciphers";
import { chat } from "./modules/chat";

export const easy1 = new ExpeditionFactory({type:'easy1', players:1, difficulty:'easy', 
create:(variables) => {
  const [users, passwords] = [sampleData.users.sample(20), sampleData.passwords.fakeWords.sample(20)]
  const adminID = Math.floor(Math.random()*20)
  users[adminID] = 'admin'
  const logins = users.map((v,i) => [v, passwords[i]])
  const shift = Math.floor(Math.random()*25)+1
  const passwd = passwdGen(logins, e => caesar(e,shift))
  const nodes: {[idx: string]: Node} = {
    'access-point': {
      welcome:() => `Welcome to this expedition. TODO ${Math.random()}\nSample user:${sampleData.users.random()}`,
      files:{foo:sampleData.passwords.fakeWords.random()},
    },
    locked: {
      welcome:(ctx) => {
        ctx.player.input = '_unlock-caesar'
        throw new Error('Access denied, enter admin password')
      },
    },
    logs: {files:{'last-logins':'foo',passwd}},
    security: {
    },
    foo:{
      isAvailable: (ctx) => (ctx.expedition.variables.get('firewall') == 'disable'),
    },
  };

  const endDate = new Date()
  endDate.setMinutes(endDate.getMinutes() + 60)
  const exp = new Expedition({
      nodes,
      endDate,
      startNode: () => 'access-point',
      variables: new Map([['firewall','enable'], ...variables]),
  })
  exp
    .addModule(chat)
  .commands
    .set('_auto_remindtime', remindTime)
    .set('_unlock-caesar',{run:(ctx, args) => {
      if(args !== passwords[adminID]) throw new Error('Incorrect password')
      if(ctx.player.currentNodeName != 'locked') ctx.player.nodes.push('locked')
      return 'Unlocked'
    }, help:() => '>'})
    .set('firewall',{
      run: (ctx, args) => {
        if(args != 'enable' && args != 'disable') throw new Error('Incorrect value.\nAuthorized values are: enable|disable')
        ctx.expedition.variables.set('firewall',args)
        return `Firewall ${em(args+'d')}`
      },
      isAvailable: (ctx) => (ctx.player.currentNodeName == 'security')
    })
  return exp
}})