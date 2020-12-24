import { execute } from "../src/actions";
import { Expedition } from "../src/expedition";
import { Context, Node } from "../src/typings";



describe("Action module", () => {
  let ctx: Context

  beforeAll(() => {
    const nodes: {[idx: string]:Node} = {
      start: {
        welcome:() => "Welcome to this tutorial.",
        commands:[],
        connected:["eng"],
        files: {foo:"bar", file2:`file2
    multi-line content`},
      },
    };
    
    const expedition = new Expedition(nodes, undefined).addPlayer('bob').addPlayer('foo')
    ctx = {player: expedition.players['foo'], expedition}
  })

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
})