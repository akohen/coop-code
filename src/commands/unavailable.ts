import { Command } from "../typings";

export const unavailable:Command = {
  run: () => "Hello",
  isAvailable: () => false,
};