import { execute } from "../src/actions";
import { Expedition } from "../src/expedition";
import { Player } from "../src/player";
import { Context, Node } from "../src/typings";
import { backend } from "../src/backends/memory";

describe("Commands", () => {
  let ctx: Context
  beforeEach(() => {
    const nodes: {[idx: string]:Node} = {
      start: {
        welcome:() => "Welcome",
        files: {foo:"bar", file2:`file2\nmulti-line content`},
      },
      node2: { welcome:() => "node2 hello" },
      node3: { welcome:() => "node3 hello", tags: ['node4-access'] },
      node4: { 
        welcome:() => "available from node3 only",
        isAvailable: (ctx) => (ctx.player.currentNode.tags != undefined && ctx.player.currentNode.tags.includes('node4-access'))
      },
    };
    
    const expedition = new Expedition('test', {nodes}).addPlayer(new Player('foo'))
    ctx = {player: expedition.players.get('foo') as Player, expedition, backend}
  })

  describe("echo", () => {
    it("should echo the argument", async () => {
      expect((await execute(ctx, "echo hello world!")).output).toBe("hello world!")
    })
  })

  describe("connect", () => {
    it("should fail if called without arguments", async () => {
      expect((await execute(ctx, "connect")).errors).toBeDefined()
    })
    it("should fail if called without too many arguments", async () => {
      expect((await execute(ctx, "connect node2 extra")).errors).toBeDefined()
    })
    it("should fail if called on an unknown node", async () => {
      expect((await execute(ctx, "connect foo")).errors).toBeDefined()
    })
    it("should connect to a valid node", () => {
      execute(ctx, "connect node2")
      expect(ctx.player.currentNodeName).toBe("node2")
    })
    it("should show the node connection message", async () => {
      expect((await execute(ctx, "connect node2")).output).toBe("node2 hello")
    })
    it("should return to a previously visited node", async () => {
      execute(ctx, "connect node2")
      execute(ctx, "connect node3")
      expect((await execute(ctx, "connect node2")).output).toBe("node2 hello")
      expect(ctx.player.nodes).toStrictEqual(['start', 'node2'])
    })
    it("should not be able to connect to an unavailable node", async () => {
      expect((await execute(ctx, "connect node4")).errors).toBeDefined()
    })
    it("should be able to connect to an available node", async () => {
      execute(ctx, "connect node3")
      expect((await execute(ctx, "connect node4")).output).toBe('available from node3 only')
    })
  })

  describe("exit", () => {
    it("should exit the current node", () => {
      execute(ctx, "connect node2")
      execute(ctx, "exit")
      expect(ctx.player.currentNodeName).toBe("start")
    })
    it("should not exit the first node", () => {
      execute(ctx, "exit")
      expect(ctx.player.currentNodeName).toBe("start")
    })
    it("should show an error if trying to exit the first node", async () => {
      expect((await execute(ctx, "exit")).errors).toBeDefined()
    })
    it("should show the new node connection message", async () => {
      execute(ctx, "connect node2")
      expect((await execute(ctx, "exit")).output).toBe("Welcome")
    })
  })
})