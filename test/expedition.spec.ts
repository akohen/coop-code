import { Expedition } from "../src/expedition";
import { Player } from "../src/player";
import { Context, Node } from "../src/typings";
import { memory } from "../src/backends/memory";

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
    
    const player = new Player('bob')
    const expedition = new Expedition({nodes: Object.entries(nodes)}).addPlayer(player)
    ctx = {player, expedition, backend:memory}
  })

  describe("Import/export", () => {
    it("Should return its variables as a string", () => {
      ctx.expedition.variables.set('foo','bar')
      ctx.expedition.variables.set('bool',true)
      const exportString = ctx.expedition.export()
      expect(exportString).toBe('[["foo","bar"],["bool",true]]')
    })
  })

})