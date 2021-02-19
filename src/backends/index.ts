import { memory } from './memory';
import { pg } from './pg';

export const backend = (process.env.PGHOST) ? pg : memory