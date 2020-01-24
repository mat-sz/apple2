import * as _6502 from '6502';
import './App.scss';

import { ROM } from './ROM';

const memory = new Uint8Array(_6502.MEMORY_SIZE);
let state = new _6502.State();

let PC = 0;
memory.set(new Uint8Array(ROM), 0xB000);

const getMemory = (offset: number) => {
    return memory[offset];
};

const setMemory = (offset: number, value: number) => {
    if (offset > 0x0400 && offset < 0x07FF) {
        console.log(offset.toString(16) + ' = ' + value.toString(16))
    }
    memory[offset] = value;
};

state = _6502.performIRQ(state, getMemory, setMemory, 0xFFFE, false);

while (state.PC != PC) {
    PC = state.PC;
    state = _6502.step(state, getMemory, setMemory);
}