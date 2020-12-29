import { execute, getAvailable } from "../src/actions";
import { Expedition } from "../src/expedition";
import { Player } from "../src/player";
import { Node } from "../src/typings";



describe("Action module", () => {
  const nodes: {[idx: string]:Node} = {
    start: {
      welcome:() => "Welcome to this tutorial.",
      files: {foo:"bar", file2:`file2
  multi-line content`},
    },
  };
  
  const expedition = new Expedition('test', nodes).addPlayer(new Player('foo'))
  const backend = {
    getPlayer: (player: string) => (new Player(player)),
    getExpedition: () => (expedition),
    listExpeditions: () => (['test']),
    createExpedition: (e:Expedition) => e,
  }
  const ctx = {player: expedition.players.get('foo') as Player, expedition, backend}

  it("should be able to execute a test", () => {
    expect(true).toBeTruthy()
  })
  it("should respond to commands", () => {
    expect(execute(ctx, "hello")).toBeDefined()
  })
  it("should return without output or error to an empty string", () => {
    const result = execute(ctx, "")
    expect(result.output).toBeUndefined()
    expect(result.errors).toBeUndefined()
  })
  it("should read a file", () => {
    const result = execute(ctx, "read foo")
    expect(result.output).toBe("bar")
    expect(result.errors).toBeUndefined()
  })
  it("should give access to expedition commands", () => {
    ctx.expedition.commands.set('expedition-specific-command',{run:(ctx, args) => (args)})
    expect(getAvailable(ctx, "expedition-specific-command")).toBeDefined()
  })
  it("should overwrite common commands", () => {
    ctx.expedition.commands.set('echo',{run:() => ('overwritten')})
    expect(execute(ctx, "echo").output).toBe('overwritten')
  })
})