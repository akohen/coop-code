import { execute } from "../src/actions";
import { Player } from "../src/player";
import { Context, ExpeditionStatus } from "../src/typings";
import { backend } from "../src/backends/memory";
import { tutorial } from "../src/expeditions/tutorial";

describe("Tutorial", () => {
  let ctx: Context
  beforeEach(() => {
    const player = new Player('foo')
    const expedition = tutorial.create().addPlayer(player)
    ctx = {player, expedition, backend}
  })

  it("should be traversable without unexpected errors", async () => {
    expect(ctx.expedition.status).toBe(ExpeditionStatus.InProgress)
    expect((await execute(ctx, "read how-to")).errors).toBeUndefined()
    expect((await execute(ctx, "ls")).errors).toBeUndefined()
    expect((await execute(ctx, "read next")).errors).toBeUndefined()
    expect((await execute(ctx, "help connect")).errors).toBeUndefined()
    expect((await execute(ctx, "connect terminal-a6b1")).errors).toBeUndefined()
    expect((await execute(ctx, "scan")).errors).toBeUndefined()
    expect((await execute(ctx, "connect hub-ff08")).errors).toBeUndefined()
    expect((await execute(ctx, "ls")).errors).toBeUndefined()
    expect((await execute(ctx, "read about-locks")).errors).toBeUndefined()
    expect((await execute(ctx, "read passwd")).errors).toBeUndefined()
    expect((await execute(ctx, "connect first-lock")).errors).toBeDefined() // Errors on locked node
    expect((await execute(ctx, "swordfish")).errors).toBeUndefined()
    expect(ctx.player.nodes.length).toBe(4)
    expect((await execute(ctx, "set completed true")).errors).toBeUndefined()
    expect(ctx.expedition.status).toBe(ExpeditionStatus.Completed)
  })
})