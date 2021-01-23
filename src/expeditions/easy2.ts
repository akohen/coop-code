import { Expedition } from "../expedition";
import { ExpeditionFactory } from "../expedition-factory";
import { Context, Node } from "../typings";
import { createCanvas } from "canvas";

export const easy2 = new ExpeditionFactory({type:'wip-easy2', players:1, difficulty:'easy', create:(variables) => {
  const canvas = createCanvas(200, 200)
  const cvsCtx = canvas.getContext('2d')
  cvsCtx.font = '30px Impact'
  cvsCtx.rotate(0.1)
  cvsCtx.fillStyle = '#ffffff'
  cvsCtx.fillText('Awesome!', 50, 100)
  
  // Draw line under text
  const text = cvsCtx.measureText('Awesome!')
  cvsCtx.strokeStyle = 'rgba(200,200,200,0.5)'
  cvsCtx.beginPath()
  cvsCtx.lineTo(50, 102)
  cvsCtx.lineTo(50 + text.width, 102)
  cvsCtx.stroke()
  const finalUnlock = (ctx:Context) => ctx.expedition.variables.get('_lock1') && ctx.expedition.variables.get('_lock2')
  const nodes:[string, Node][] = [
    ['start',{
      welcome: () => '<img src="' + canvas.toDataURL() + '" />'
    }],
    ['final', {
      welcome:(ctx) => {
        if(!finalUnlock(ctx)) throw new Error('Locks are still active')
        return 'Connected'
      }
    }],
  ]
  const exp = new Expedition({nodes, variables})
  return exp
}})