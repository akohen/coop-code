import { execute, getAvailable } from "../src/actions";
import { Expedition } from "../src/expedition";
import { Node } from "../src/typings";



describe("Action module", () => {
  const nodes: {[idx: string]:Node} = {
    start: {
      welcome:() => "Welcome to this tutorial.",
      connected:["eng"],
      files: {foo:"bar", file2:`file2
  multi-line content`},
    },
  };
  
  const expedition = new Expedition(nodes).addPlayer('bob').addPlayer('foo')
  const ctx = {player: expedition.players['foo'], expedition}

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