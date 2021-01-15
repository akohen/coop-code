import { Expedition } from "../expedition";
import { ExpeditionFactory } from "../expedition-factory";
import { Node } from "../typings";
import { em, parseCommand, toList } from "../utils";
import { genHex, data } from "./data";
import { remindTime } from "./functions/auto_commands";
import { alphanumChecksum, caesar } from "./functions/ciphers";
import { chat } from "./modules/chat";
import { locked } from "./nodes/locked";

export const easy1 = new ExpeditionFactory({type:'easy1', players:1, difficulty:'easy', 
create:(variables) => {
  const [users, passwords] = [data.users.sample(20), data.passwords.fakeWords.sample(20)]
  const adminID = Math.floor(Math.random()*20)
  users[adminID] = 'admin'
  const exampleUsers = Array.from(users)
  exampleUsers.splice(adminID,1)
  // Generate 8 words of 8 hex characters
  const key = [...Array(8)].map(()=>Math.floor(Math.random()*16**8).toString(16).padStart(8,'0'))
  const key_old = [...Array(8)].map(()=>Math.floor(Math.random()*16**8).toString(16).padStart(8,'0'))
  const sign = (word:string, key:string[]) => ([...Array(8)].map((_,i) => alphanumChecksum(key[i]+(word[i]||''))).join(''))
  const example_commands = ['restart', 'start', 'stop']
  const logins = users.map((v,i) => [v, passwords[i]])
  const shift = Math.floor(Math.random()*25)+1
  const passwd = data.files.passwdGen(logins, e => caesar(e,shift))
  const nodes: [string,Node][] = [
    ['access-point', {
      welcome:() => `Welcome to this expedition. TODO ${Math.random()}\nSample user:${data.users.random()}`,
      files:{
        foo:data.passwords.fakeWords.random(),
        'key.previous':key_old.join('\n'),
        'generator.signed':toList(example_commands.map(e=>[e, sign(e,key_old)])),
      },
    }],
    [`rand-${genHex(4)}`,{}],
    ['locked', {
      welcome:(ctx) => {
        ctx.player.input = '_unlock-caesar'
        throw new Error('Access denied, enter admin password')
      },
    }],
    ['logs', {files: {'last-logins':'foo', passwd}}],
    ['security', {}],
    ['foo', {
      isAvailable: (ctx) => (ctx.expedition.variables.get('firewall') == 'disable'),
    }],
    ['engineering', { // Controls to the generator, accessible after disabling the firewall
      isAvailable: (ctx) => (ctx.expedition.variables.get('firewall') == 'disable'),
      tags: ['generator'],
    }],
  ];

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
    .addModule(locked('caesar',{
      welcome:'welcome',
      prompt:'>',
      locked:'Access denied, enter admin password',
      secret: passwords[adminID]
    },{
      isAvailable: (ctx) => (ctx.expedition.variables.get('firewall') == 'disable'),
    }))
  .commands
    .set('_auto_remindtime', remindTime)
    .set('firewall',{
      run: (ctx, args) => {
        if(args != 'enable' && args != 'disable') throw new Error('Incorrect value.\nAuthorized values are: enable|disable')
        ctx.expedition.variables.set('firewall',args)
        return `Firewall ${em(args+'d')}`
      },
      isAvailable: (ctx) => (ctx.player.currentNodeName == 'security')
    })
    .set('generator',{
      run: (ctx, args) => {
        const argv = parseCommand(args).argv
        if(!argv || argv[0] != 'restart') throw new Error('Unknown generator action')
        if(argv[1] != sign(argv[0], key)) throw new Error('Incorrect signature')
        ctx.expedition.variables.set('complete', true)
        return `Generator restarted`
      },
      isAvailable: (ctx) => (ctx.player.currentNode.tags?.includes('generator') || false)
    })
  return exp
}})