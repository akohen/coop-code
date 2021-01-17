import { Expedition } from "../expedition";
import { ExpeditionFactory } from "../expedition-factory";
import { Node } from "../typings";
import { em, parseCommand, toList } from "../utils";
import { genHex, data, SampleData } from "./data";
import { remindTime } from "./functions/auto_commands";
import { alphanumChecksum, caesar, sequenceFromLast } from "./functions/ciphers";
import { chat } from "./modules/chat";
import { locked } from "./nodes/locked";

export const easy1 = new ExpeditionFactory({type:'easy1', players:1, difficulty:'easy', 
create:(variables) => {
  // Populate users, add admin account
  const logins = SampleData.createSet(20, data.users, data.passwords.fakeWords)
  const adminID = Math.floor(Math.random()*20)
  logins[adminID][0] = 'admin'

  // Generate 2 keys (8 words of 8 hex characters) and signing function
  const key = [...Array(8)].map(()=>Math.floor(Math.random()*16**8).toString(16).padStart(8,'0'))
  const key_old = [...Array(8)].map(()=>Math.floor(Math.random()*16**8).toString(16).padStart(8,'0'))
  const sign = (word:string, key:string[]) => ([...Array(8)].map((_,i) => alphanumChecksum(key[i]+(word[i]||''))).join(''))
  const example_commands = ['restart', 'start', 'stop']

  // Caesar encrypted passwords
  const shift = Math.floor(Math.random()*25)+1
  const passwd = data.files.passwdGen(logins, e => caesar(e,shift))
  const lastLogins = data.files.lastLogins(logins, 5)

  // Generating a sequence of number ('for find the next'-type locks)
  const sequenceStep = Math.floor(Math.random()*3) + 1
  const sequence = sequenceFromLast((x) => 2*x-sequenceStep, 5, 7)
  const sequenceSecret = sequence.pop() as number
  
  // Base nodes layout
  const nodes: [string,Node][] = [
    ['access-point', {
      welcome:() => `Welcome to this expedition.\nYour goal is to restart this ship's main generator before the battery runs out of power, in 1 hour`,
    }],
    [`documentation`,{files:{
      'charshift-encryption': data.files.documentation["charshift"],
      'alphanum-checksum': data.files.documentation["alphanum-checksum"],
      'power-mgmt': '<TODO>',
      'firewall': '<TODO>',
      },
      tags: ['doc'],
    }],
    [`rand-${genHex(4)}`,{}],
    [`rand-${genHex(4)}`,{}],
    [`secure-${genHex(4)}`, {files: {passwd}}],
    [`trash-${genHex(4)}`, {files: {'logins.log.3':lastLogins}}],
    ['security', {}],
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
    .addModule(locked(`firewall-control`,{
      welcome:'welcome',
      prompt:'>',
      locked:'Access denied, enter admin password',
      fail: 'Authentication failed: incorrect password',
      secret: logins[adminID][1]
    },{
      // isAvailable: (ctx) => (ctx.expedition.variables.get('firewall') == 'disable'),
      tags: ['firewall'],
    }))
    .addModule(locked(`data-${genHex(4)}`,{
      welcome:'This system is used to store previous keys and examples of encrypted data, intended for testing only, not production use!',
      prompt: sequence.join(' ') + '?>',
      locked:'Access denied, complete sequence to unlock',
      fail: 'Authentication failed: incorrect password',
      secret: sequenceSecret.toString(),
    },{
      files:{
        'key.previous': key_old.join('\n'),
        'generator.signed': toList(example_commands.map(e=>[e, sign(e,key_old)])),
        'charshift.test': caesar('<TODO>', shift),
      },
    }))
  .commands
    .set('_auto_remindtime', remindTime)
    .set('firewall',{
      run: (ctx, args) => {
        if(args != 'enable' && args != 'disable') throw new Error('Incorrect value.\nAuthorized values are: enable|disable')
        ctx.expedition.variables.set('firewall',args)
        return `Firewall ${em(args+'d')}`
      },
      isAvailable: (ctx) => (ctx.player.currentNode.tags?.includes('firewall') || false)
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