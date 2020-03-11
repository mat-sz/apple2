import * as _6502 from '6502';
import './App.scss';

import { ROM, ROM_START } from './ROM';
import { updateDisplay } from './display';

const ctrlB = document.getElementById('ctrl-b');
ctrlB.addEventListener('click', () => {
    setMemory(0xC000, 0x82);
});

const ctrlC = document.getElementById('ctrl-c');
ctrlC.addEventListener('click', () => {
    setMemory(0xC000, 0x83);
});

const reset = document.getElementById('reset');
reset.addEventListener('click', () => {
    state = _6502.performReset(getMemory);
});

const memory = new Uint8Array(_6502.MEMORY_SIZE);
let state = new _6502.State();

memory.set(new Uint8Array(ROM), ROM_START);

const replaceCharAt = (str: string, i: number, character: string) => {
    return str.substring(0, i) + character + str.substring(i + 1);
}

const getMemory = (offset: number) => {
    if (offset === 0xC010) setMemory(0xC000, memory[0xC000] & 0x7F);
    return memory[offset];
};

const setMemory = (offset: number, value: number) => {
    // Prevent ROM writes.
    if (offset >= ROM_START) return;
    memory[offset] = value;
};

window.addEventListener('keydown', (ev) => {
    // Backspace hack.
    if (ev.keyCode === 8) {
        setMemory(0xC000, 128 + 8);
    }
});

window.addEventListener('keypress', (ev) => {
    // TODO: Proper keyCode map.
    let code = ev.keyCode;
    if (ev.ctrlKey && code >= 0x41 && code <= 0x5A) {
        setMemory(0xC000, code + 0x40);
        return;
    }

    setMemory(0xC000, 128 + code);
});

state = _6502.performReset(getMemory);

const step = () => {
    if (!document.hidden) {
        state = _6502.step(state, getMemory, setMemory);
        setImmediate(step);
    } else {
        setTimeout(step, 500);
    }
}

step();

setInterval(() => {
    updateDisplay(memory);
}, 50);