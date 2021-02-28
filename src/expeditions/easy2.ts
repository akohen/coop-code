import { Expedition } from "../expedition";
import { ExpeditionFactory } from "../expedition-factory";
import { Context, Node } from "../typings";
import { em, red } from "../utils";
import { SampleData } from "./data";
import { remindTime } from "./functions/auto_commands";
import { chat } from "./modules/chat";
import { debug_mode } from "./modules/debug";
import { autoHints } from "./modules/hint";
import { locked } from "./nodes/locked";

export const easy2 = new ExpeditionFactory({type:'easy2', players:1, difficulty:'easy', 
create:(variables) => {
  const [memLen, memStart, memSize, memChunks] = [30, 1024, 4, 3]
  const memTmp:SampleData<number> = SampleData.from({length: memChunks*memLen-1}, (_:number, i) => (i + 1)*memSize + memStart).shuffled()
  const memoryRemoved = memTmp.pop()
  memTmp.push(memStart, memStart+ memChunks*memLen*memSize)
  const mem = memTmp.shuffled()
  const nodeMemory1 = SampleData.from(mem.slice(0, memLen))
  const nodeMemory1Addresses = nodeMemory1.sample(2)
  const nodeMemory1Hint = nodeMemory1Addresses[0] * nodeMemory1Addresses[1]
  //console.log(nodeMemory1, nodeMemory1Addresses, nodeMemory1Hint)
  const nodeMemory2 = SampleData.from(mem.slice(memLen, 2*memLen))
  const nodeMemory2Addresses = [Math.min(...nodeMemory2), Math.max(...nodeMemory2)]
  const nodeMemory3 = SampleData.from(mem.slice(2*memLen, 3*memLen))
  //console.log(mem)
  const navStorageOK = (ctx: Context) => !!(ctx.expedition.variables.get('s1') && ctx.expedition.variables.get('s2') && ctx.expedition.variables.get('s3'))
  // Base nodes layout
  const nodes: [string,Node][] = [
    ['access-point', {
      welcome:() => `Welcome to this expedition.\nYour goal is to restart this ship's main reactor before the battery runs out of power, in 1 hour`,
    }],
    ['documentation', {}],
    ['logs', {}],
    ['storage-1',{
      welcome:() => `Storage pod status:\n  ${memLen} chunks loaded\n  ${memLen} healthy\n  0 errors`,
      tags: ['storage'],
    }],
    ['storage-2',{
      welcome:() => `Storage pod status:\n  ${memLen} chunks loaded\n  ${memLen} healthy\n  0 errors`,
      tags: ['storage'],
    }],
    ['storage-3',{
      welcome:() => `Storage pod status:\n  ${memLen} chunks loaded\n  ${memLen} healthy\n  0 errors`,
      tags: ['storage'],
    }],
    ['navigation',{
      welcome:(ctx) => navStorageOK(ctx) ? 
      'Navigation data storage available' : 
      `Navigation data storage error:
  Pod 1: ${em('OK')}
  Pod 2: ${red('Disconnected')}
  Pod 3: ${red('Disconnected')}`,
      tags: ['navigation'],
    }],
  ];

  const endDate = new Date()
  endDate.setMinutes(endDate.getMinutes() + 60)
  const exp = new Expedition({
      nodes,
      endDate,
      startNode: () => 'access-point',
      variables,
  })
  exp
    .addModule(autoHints([
      [(ctx) => (ctx.expedition.variables.has('_access-foo')), 'Tried to connect to foo system'],
    ]))
    .addModule(chat)
    .addModule(debug_mode('swordfish', {
      welcome:(ctx) => `Expedition variables and secrets:
      Expedition seed: ${ctx.expedition.variables.get('_seed')}
      Node1: ${nodeMemory1Addresses} ${nodeMemory1Hint}
      Node2: ${nodeMemory2Addresses}
      Node3: ${nodeMemory1Addresses}`,
    }))
    .addModule(locked('foo', {welcome:`A ${em('B')} C`, prompt:'>', secret:'secret', locked: `A B C`}))
  .commands
    .set('_auto_remindtime', remindTime)
    .set('storage',{
      run: (ctx, args) => {
        if(args == 'dump') {
          return nodeMemory1.join('\n')
        }
        return undefined
      },
      isAvailable: (ctx) => !!ctx.player.currentNode.tags?.includes('storage'),
      help: () => 'Manage storage pod'
    })
  return exp
}})