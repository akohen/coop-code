import { Expedition } from "../src/expedition";
import { Player } from "../src/player";
import { Context, Node } from "../src/typings";
import { backend } from "../src/backends/memory";

describe("Expedition", () => {
  let ctx: Context
  beforeEach(() => {
    const nodes: {[idx: string]:Node} = {
      start: {
        welcome:() => "Welcome",
        files: {foo:"bar", file2:`file2\nmulti-line content`},
      },
      node2: { welcome:() => "node2 hello" },
      node3: { welcome:() => "node3 hello" },
    };
    
    const expedition = new Expedition('test', {nodes}).addPlayer(new Player('bob'))
    ctx = {player: expedition.players.get('foo') as Player, expedition, backend}
  })

  describe("Import/export", () => {
    it("Should return its variables as a string", () => {
      ctx.expedition.variables.set('foo','bar')
      ctx.expedition.variables.set('bool',true)
      const exportString = ctx.expedition.export()
      expect(exportString).toBe('{"variables":[["foo","bar"],["bool",true]]}')
    })

    it("Should be able to import variables from a string", () => {
      ctx.expedition.load('{"variables":[["foo","bar"],["bool",true]]}')
      expect(ctx.expedition.variables.get('foo')).toBe('bar')
      expect(ctx.expedition.variables.get('bool')).toBe(true)
    })
  })

})