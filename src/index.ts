import * as _6502 from '6502';
import './App.scss';

import { ROM } from './ROM';

const memory = new Uint8Array(_6502.MEMORY_SIZE);
let state = new _6502.State();

memory.set(new Uint8Array(ROM), 0xB000);

const getMemory = (offset: number) => {
    if (offset === 0xC010) setMemory(0xC000, 0);
    return memory[offset];
};

const setMemory = (offset: number, value: number) => {
    if (offset > 0x0400 && offset < 0x07FF) {
        console.log(offset.toString(16) + ' = ' + value.toString(16))
    }
    memory[offset] = value;
};

window.addEventListener('keypress', (ev) => {
    // TODO: Proper keyCode map.
    setMemory(0xC000, 128 + ev.keyCode);
});

state = _6502.performIRQ(state, getMemory, setMemory, 0xFFFE, false);

const cont = () => {
    state = _6502.step(state, getMemory, setMemory);
    setImmediate(() => cont());
}

setImmediate(() => cont());