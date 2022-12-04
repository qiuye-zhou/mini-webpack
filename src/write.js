import { randnum } from './randnum.js';
import { print } from './conlog.js';

export function hell() {
    print(randnum(100, 1));
    return 'hello webpack!';
}