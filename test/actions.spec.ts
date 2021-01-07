import { execute, getAvailable } from "../src/actions";
import { Expedition } from "../src/expedition";
import { Player } from "../src/player";
import { Node } from "../src/typings";
import { mocked } from 'ts-jest/utils';
import { memory } from "../src/backends/memory";



describe("Action module", () => {
  const nodes: {[idx: string]:Node} = {
    start: {
      welcome:() => "Welcome to this tutorial.",
      files: {foo:"bar", file2:`file2
  multi-line content`},
    },
  };
  
  const player = new Player('foo')
  const expedition = new Expedition('test', {nodes}).addPlayer(player)
  const mockedBackend = mocked(memory, true)
  const ctx = {player, expedition, backend: mockedBackend}

  it("should be able to execute a test", () => {
    expect(true).toBeTruthy()
  })
  it("should respond to commands", () => {
    expect(execute(ctx, "hello")).toBeDefined()
  })
  it("should return without output or error to an empty string", async () => {
    const result = await execute(ctx, "")
    expect(result.output).toBeUndefined()
    expect(result.errors).toBeUndefined()
  })
  it("should read a file", async () => {
    const result = await execute(ctx, "read foo")
    expect(result.output).toBe("bar")
    expect(result.errors).toBeUndefined()
  })
  it("should give access to expedition commands", () => {
    ctx.expedition.commands.set('expedition-specific-command',{run:(ctx, args) => (args)})
    expect(getAvailable(ctx, "expedition-specific-command")).toBeDefined()
  })
  it("should overwrite common commands", async () => {
    ctx.expedition.commands.set('echo',{run:() => ('overwritten')})
    expect((await execute(ctx, "echo")).output).toBe('overwritten')
  })
})