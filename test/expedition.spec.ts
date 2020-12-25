import { Expedition } from "../src/expedition";
import { Context, Node } from "../src/typings";

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
    
    const expedition = new Expedition(nodes).addPlayer('bob').addPlayer('foo')
    ctx = {player: expedition.players['foo'], expedition}
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