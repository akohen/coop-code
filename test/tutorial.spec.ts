import { execute } from "../src/actions";
import { Player } from "../src/player";
import { Context, ExpeditionStatus } from "../src/typings";
import { backend } from "../src/backends/memory";
import { tutorial } from "../src/expeditions/tutorial";

describe("Tutorial", () => {
  let ctx: Context
  beforeEach(() => {
    const expedition = tutorial.create().addPlayer(new Player('foo'))
    ctx = {player: expedition.players.get('foo') as Player, expedition, backend}
  })

  it("should be traversable without unexpected errors", () => {
    expect(ctx.expedition.status).toBe(ExpeditionStatus.InProgress)
    expect(execute(ctx, "read how-to").errors).toBeUndefined()
    expect(execute(ctx, "ls").errors).toBeUndefined()
    expect(execute(ctx, "read next").errors).toBeUndefined()
    expect(execute(ctx, "help connect").errors).toBeUndefined()
    expect(execute(ctx, "connect terminal-a6b1").errors).toBeUndefined()
    expect(execute(ctx, "scan").errors).toBeUndefined()
    expect(execute(ctx, "connect hub-ff08").errors).toBeUndefined()
    expect(execute(ctx, "ls").errors).toBeUndefined()
    expect(execute(ctx, "read about-locks").errors).toBeUndefined()
    expect(execute(ctx, "read passwd").errors).toBeUndefined()
    expect(execute(ctx, "connect first-lock").errors).toBeDefined() // Errors on locked node
    expect(execute(ctx, "swordfish").errors).toBeUndefined()
    expect(ctx.player.nodes.length).toBe(4)
    expect(execute(ctx, "set completed true").errors).toBeUndefined()
    expect(ctx.expedition.status).toBe(ExpeditionStatus.Completed)
  })
})