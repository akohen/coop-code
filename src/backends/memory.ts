import { Player } from "../player"
import { test } from "../expeditions/test";

const players = new Map()
players.set('foo', new Player('foo'))
test.create().addPlayer(players.get('foo'))

export function getPlayer(player: string): Player | undefined {
  return players.get(player)
}