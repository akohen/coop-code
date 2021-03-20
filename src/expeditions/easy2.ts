import { Expedition } from "../expedition";
import { ExpeditionFactory } from "../expedition-factory";
import { Context, Node } from "../typings";
import { green, red, toList } from "../utils";
import { genHex, SampleData } from "./data";
import { files } from "./data/files";
import { remindTime } from "./functions/auto_commands";
import { chat } from "./modules/chat";
import { debug_mode } from "./modules/debug";
import { autoHints } from "./modules/hint";
import { locked } from "./nodes/locked";

const generateKeys = () => {
  const [memLen, memStart, memSize, memChunks] = [30, 1024, 4, 3]
  const memTmp:SampleData<number> = SampleData.from({length: memChunks*memLen-1}, (_:number, i) => (i + 1)*memSize + memStart).shuffled()
  const passwordChunk = memTmp.pop() as number - memSize
  memTmp.push(memStart, memStart+ memChunks*memLen*memSize)
  const mem = memTmp.shuffled()
  const memory = [
    SampleData.from(mem.slice(0, memLen)),
    SampleData.from(mem.slice(memLen, 2*memLen)),
    SampleData.from(mem.slice(2*memLen, 3*memLen)),
  ]
  const storageKeys = [
    memory[0].sample(2).sort(),
    [Math.min(...memory[1]), Math.max(...memory[1])],
    memory[2].sample(2).sort(),
  ]
  // The password for the navigation node should not be used to sync pods
  if(!storageKeys.flat().includes(passwordChunk)) return {passwordChunk, memory, storageKeys}
  
  throw new Error(`Can't generate expedition secrets`)
}

export const easy2 = new ExpeditionFactory({type:'easy2', players:1, difficulty:'easy', 
create:(variables) => {
  const {passwordChunk, memory, storageKeys} = generateKeys()
  const getValue = (address: number) => (address**5 % 65537).toString(16).padStart(4,'0')
  const navStorageOK = (ctx: Context) => !!(ctx.expedition.variables.get('s0') && ctx.expedition.variables.get('s1') && ctx.expedition.variables.get('s2'))
  const navStatus = (ctx:Context) => (navStorageOK(ctx) ? 
  'Navigation data storage available' : 
  `Navigation data storage error:
Pod 1: ${ctx.expedition.variables.has('s0') ? green('Connected') : red('Disconnected')}
Pod 2: ${ctx.expedition.variables.has('s1') ? green('Connected') : red('Disconnected')}
Pod 3: ${ctx.expedition.variables.has('s2') ? green('Connected') : red('Disconnected')}`)
  // Base nodes layout
  const nodes: [string,Node][] = [
    ['access-point', {
      welcome:() => `Welcome to this expedition.\nYour goal is to restart this ship's main reactor before the battery runs out of power, in 1 hour`,
    }],
    ['documentation', {}],
    ['logs', {}],
    [`storage-${genHex(4)}`, {
      welcome:() => `DSS running...`,
      files: { 'dss_README': files.documentation.dss, 'dss_MAINTENANCE': files.documentation.dss_v1 },
      tags: ['storage', 'pod-0'],
    }],
    [`storage-${genHex(4)}`, {
      welcome:() => `DSS running...`,
      files: { dss: files.documentation.dss },
      tags: ['storage', 'pod-1'],
    }],
    [`storage-${genHex(4)}`,{
      welcome:() => `DSS running...`,
      files: { dss: files.documentation.dss },
      tags: ['storage', 'pod-2'],
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
      [(ctx) => (ctx.expedition.variables.has('_access-navigation')), 'It looks like this password is saved on the distributed storage disk... Maybe this could help us ?'],
      [
        (ctx) => (Date.now() - new Date(ctx.expedition.variables.get('_access-navigation') as number).getTime() > 3*60000)&&!ctx.expedition.variables.has('_unlock-navigation'),
        `I have just determined that the navigation system password takes up 8 bytes of memory`
      ],
    ]))
    .addModule(chat)
    .addModule(debug_mode('swordfish', {
      welcome:(ctx) => `Expedition variables and secrets:
      Expedition seed: ${ctx.expedition.variables.get('_seed')}
      Password chunk: ${passwordChunk}
      Node1: ${storageKeys[0]}
      Node2: ${storageKeys[1]}
      Node3: ${storageKeys[2]}`,
    }))
    .addModule(locked(`navigation`, {
      welcome: navStatus,
      prompt:'>', secret: getValue(passwordChunk)+getValue(passwordChunk+4), locked: `Enter navigation system password`, fail: 'Incorrect password'
    },{ tags:['navigation', 'storage'] }))
  .commands
    .set('_auto_remindtime', remindTime)
    .set('dss',{
      run: (ctx, args) => {
        if(ctx.player.currentNode.tags?.includes('navigation')) {
          return 'DSS cluster status :\n' + toList([
            [`Pods connected`, 
              Array.from(ctx.expedition.variables.keys()).filter(e => ['s0','s1','s2'].includes(e)).length.toString()],
            [`Cluster id`, `${storageKeys[0][0]*storageKeys[0][1]}`],
            [`Cluster key`, `${storageKeys[2][0]*storageKeys[2][1]}`],
            [`DSS version`, `1.0.1`],
          ], {pad: 2})
        }
        const podID = ctx.player.currentNode.tags?.includes('pod-0') ? 0 : ctx.player.currentNode.tags?.includes('pod-1') ? 1 : 2
        const help = `Usage:\n  dss <COMMAND>\nValid commands:\n`+ toList([
          ['dump', `Show all chunks stored on this pod`],
          ['show', `Display a chunk's value`],
          ['help', 'Show this message'],
          ['sync', `Used to re-connect the pod to the cluster. Must provide the pod's sync key`],
          ['status', 'Display pod status'],
        ],{pad:2})
        if(!args) return help

        const argv = args.split(' ')
        if(argv[0] == 'dump') {
          return memory[podID].join('\n')
        } else if(argv[0] == 'get') {
          if(!argv[1]) throw new Error('missing chunk id')
          const chunk = parseInt(argv[1])
          if(memory[podID].includes(chunk)) {
            return chunk == passwordChunk ? getValue(chunk)+getValue(chunk+4) : getValue(chunk)
          } else throw new Error('Chunk not found on this node')
        } else if(argv[0] == 'sync') {
          if(!argv[1]) throw new Error('Missing sync key')
          if(argv[1] != getValue(storageKeys[podID][0])+getValue(storageKeys[podID][1])) throw new Error('Incorrect sync key')
          if(ctx.expedition.variables.has('s'+podID)) return 'Pod already re-synced'
          ctx.expedition.variables.set('s'+podID, true)
          return 'Pod successfully re-synced'
        } else if(argv[0] == 'status') {
          return 'DSS pod status :\n' + toList([
            [`Pod id`, `${podID}`],
            [`Loaded chunks`, `3`],
            [`Healthy chunks`, `3`],
            [`Errors`, '0'],
            [`Pod status`, `${ctx.expedition.variables.has('s'+podID) ? green('Connected') : red('Disconnected')}`],
            [`Cluster id`, `${storageKeys[0][0]*storageKeys[0][1]}`],
            [`DSS version`, `1.0.1`],
          ], {pad: 2})
        }
        return help
      },
      isAvailable: (ctx) => !!ctx.player.currentNode.tags?.includes('storage'),
      help: () => 'Manage storage pod'
    })
    .set('navigation',{
      run: (ctx) => {
        if(!navStorageOK(ctx)) return `Navigation data corrupted\nRegenerating navigation data from backups...\nStorage cluster unavailable, unable to restore data`
        ctx.expedition.variables.set('complete', true)
        return 'Navigation data corrupted\nRegenerating navigation data from backups...\nNavigation data restored...\nCourse correction'
      },
      help: () => `Configure the navigation system`,
      isAvailable: (ctx) => !!ctx.player.currentNode.tags?.includes('navigation'),
    })
  return exp
}})