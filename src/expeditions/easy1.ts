import { Expedition } from "../expedition";
import { ExpeditionFactory } from "../expedition-factory";
import { Node } from "../typings";
import { em, parseCommand, toList, toTable } from "../utils";
import { genHex, data, SampleData } from "./data";
import { remindTime } from "./functions/auto_commands";
import { alphanumChecksum, caesar, sequenceFromLast } from "./functions/ciphers";
import { chat } from "./modules/chat";
import { debug_mode } from "./modules/debug";
import { autoHints } from "./modules/hint";
import { locked } from "./nodes/locked";

export const easy1 = new ExpeditionFactory({type:'easy1', players:1, difficulty:'easy', 
create:(variables) => {
  // Populate users, add admin account
  const logins = SampleData.createSet(20, data.users, data.passwords.fakeWords)
  const adminID = Math.floor(Math.random()*20)
  logins[adminID][0] = 'admin'

  // Generate 2 keys (8 words of 8 hex characters) and signing function
  const key = [...Array(8)].map(()=>genHex(8))
  const key_old = [...Array(8)].map(()=>genHex(8))
  const sign = (word:string, key:string[]) => ([...Array(8)].map((_,i) => alphanumChecksum(key[i]+(word[i]??''))).join(''))
  const example_commands = ['status', 'start', 'stop']
  const secureNode = `secure-${genHex(4)}`

  // Caesar encrypted passwords
  const shift = Math.floor(Math.random()*25)+1
  const passwd = data.files.passwdGen(logins, e => caesar(e,shift))
  const lastLogins = data.files.lastLogins(logins, 5)

  // Generating a sequence of number ('for find the next'-type locks)
  const sequenceStep = Math.floor(Math.random()*3) + 1
  const sequence = sequenceFromLast((x) => 2*x-sequenceStep, 5, 7)
  const sequenceSecret = sequence.pop() as number

  // Reactor setup
  const brokenCoil = Math.floor(Math.random()*4)
  
  // Base nodes layout
  const nodes: [string,Node][] = [
    ['access-point', {
      welcome:() => `Welcome to this expedition.\nYour goal is to restart this ship's main reactor before the battery runs out of power, in 1 hour`,
    }],
    [`documentation`,{files:{
      'charshift-encryption': data.files.documentation["charshift"],
      'alphanum-checksum': data.files.documentation["alphanum-checksum"],
      'ancss': data.files.documentation["ancss"],
      'power-mgmt': '<TODO>',
      'firewall': '<TODO>',
      },
      tags: ['doc'],
    }],
    [`trash-${genHex(4)}`, {files: {'logins.log.3':lastLogins}}],
    ['engineering', { // Controls to the reactor, accessible after disabling the firewall
      isAvailable: (ctx) => (ctx.expedition.variables.get('firewall') == 'disable'),
      tags: ['reactor'],
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
    .addModule(autoHints([
      [() => true, `Expedition-start hint`],
      [(ctx) => ((ctx.expedition.secondsLeft??0) < 3570), `30 seconds hint`],
    ]))
    .addModule(chat)
    .addModule(debug_mode('swordfish', {
      welcome:(ctx) => `Expedition variables and secrets:
      Expedition seed: ${ctx.expedition.variables.get('_seed')}
      admin: ${logins[adminID]}
      Sequence: ${sequenceSecret}
      Caesar shift: ${shift}
      Coil to flip: ${brokenCoil}
      Checksum: ${secureNode} > ${alphanumChecksum(secureNode)}\nSignatures:
      status > ${sign('status', key)}
      start > ${sign('start', key)}
      stop > ${sign('stop', key)}
      flip_c0 > ${sign('flip_c0', key)}
      flip_c1 > ${sign('flip_c1', key)}`,
    }))
    .addModule(locked(`firewall-control`,{
      welcome: `This system controls the state of the internal network firewall, please be careful.\nYour login has been logged.`,
      prompt: '>',
      locked:'Access denied, enter admin password',
      fail: 'Authentication failed: incorrect password',
      secret: logins[adminID][1]
    },{
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
        'example.key': key_old.join('\n'),
        'reactor.signed': toList(example_commands.map(e=>[e, sign(e,key_old)])),
        'charshift.test': caesar('<TODO>', shift),
      },
    }))
    .addModule(locked(secureNode,{
      welcome: '',
      prompt: 'checksum>',
      locked:'Access denied, verify request by entering this node\'s checksum',
      fail: 'Request validation failed: incorrect checksum',
      secret: alphanumChecksum(secureNode),
    },{files: {passwd, 'private.key': key.join('\n')}}))
  .commands
    .set('_auto_remindtime', remindTime)
    .set('firewall',{
      run: (ctx, args) => {
        if(args != 'enable' && args != 'disable') throw new Error('Incorrect value.\nAuthorized values are: enable|disable')
        ctx.expedition.variables.set('firewall',args)
        return `Firewall ${em(args+'d')}`
      },
      isAvailable: (ctx) => !!ctx.player.currentNode.tags?.includes('firewall')
    })
    .set('reactor',{
      run: (ctx, args) => {
        const argv = parseCommand(args).argv
        if(!argv) return `Usage: reactor ACTION SIGNATURE\nAvailable actions:
  - start     Attempts to start the reactor
  - stop      Stop the reactor
  - status    Displays the status of the reactor
  - flip_cX   Inverts the polarity of coil X
In order to prevent errors and unauthorized access, you must provide the correct SIGNATURE for the selected action.
The SIGNATURE is obtained by applying the ${em('ancss')} method to the selected ACTION, using this ship's ${em('private key')}.`
        if(!['restart', 'start', 'stop', 'status', 'flip_c0', 'flip_c1', 'flip_c2', 'flip_c3'].includes(argv[0])) throw new Error('Unknown reactor action')
        if(argv[1] != sign(argv[0], key)) throw new Error('Incorrect signature')

        if(argv[0][6] == brokenCoil.toString() && !ctx.expedition.variables.get('_coil_fixed')) {
          ctx.expedition.variables.set('_coil_fixed', true)
          return 'Flipping broken coil'
        } else if(argv[0] == 'start' && ctx.expedition.variables.get('_coil_fixed')) {
          ctx.expedition.variables.set('complete', true)
          return `Reactor restarted`
        } else if(argv[0] == 'start') {
          throw new Error('Unable to start reactor: plasma containment field is unstable')
        } else if(argv[0] == 'stop') {
          throw new Error('The reactor is not running')
        } else if(argv[0] == 'status') {
          const coil = ctx.expedition.variables.get('_coil_fixed') ? -1 : brokenCoil
          return `Reactor status:
  Plasma Containement Field:  ${ctx.expedition.variables.get('_coil_fixed') ? '[[;green;]OK]' : '[[;red;]Leaking]'}
  Fusion reaction status:     [[;red;]stopped]
  Power generated:            [[;red;]0 kW]
Coils status:
${toTable(['coil0','coil1','coil2','coil3'],[[0,1,2,3].map(i => (i==coil) ? '  -': '  +'),[0,1,2,3].map(i => (i==coil) ? '  +': '  -')],{pad:2})}`
        }
        throw new Error('Unable to flip coil as it is already aligned')
      },
      isAvailable: (ctx) => !!ctx.player.currentNode.tags?.includes('reactor')
    })
  return exp
}})