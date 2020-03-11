import * as _6502 from '6502';
import './App.scss';

import { ROM, ROM_START } from './ROM';
import charSet from './charSet';

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

const text = document.getElementById('text');
const memory = new Uint8Array(_6502.MEMORY_SIZE);
let state = new _6502.State();

let screen: string[] = new Array(24).fill('').map(() => ' '.repeat(40));

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
    if (offset >= 0x0400 && offset <= 0x07FF) {
        let line = 0;
        let column = 0;

        // There's got to be a better way.
        // But I'm really determined to get this working.
        // So I'll look for that later.
        if (offset >= 0x0400 && offset <= 0x0427) {
            line = 0;
            column = offset - 0x0400;
        } else if (offset >= 0x0480 && offset <= 0x04A7) {
            line = 1;
            column = offset - 0x0480;
        } else if (offset >= 0x0500 && offset <= 0x0527) {
            line = 2;
            column = offset - 0x0500;
        } else if (offset >= 0x0580 && offset <= 0x05A7) {
            line = 3;
            column = offset - 0x0580;
        } else if (offset >= 0x0600 && offset <= 0x0627) {
            line = 4;
            column = offset - 0x0600;
        } else if (offset >= 0x0680 && offset <= 0x06A7) {
            line = 5;
            column = offset - 0x0680;
        } else if (offset >= 0x0700 && offset <= 0x0727) {
            line = 6;
            column = offset - 0x0700;
        } else if (offset >= 0x0780 && offset <= 0x07A7) {
            line = 7;
            column = offset - 0x0780;
        } else if (offset >= 0x0428 && offset <= 0x044F) {
            line = 8;
            column = offset - 0x0428;
        } else if (offset >= 0x04A8 && offset <= 0x04CF) {
            line = 9;
            column = offset - 0x04A8;
        } else if (offset >= 0x0528 && offset <= 0x054F) {
            line = 10;
            column = offset - 0x0528;
        } else if (offset >= 0x05A8 && offset <= 0x05CF) {
            line = 11;
            column = offset - 0x05A8;
        } else if (offset >= 0x0628 && offset <= 0x064F) {
            line = 12;
            column = offset - 0x0628;
        } else if (offset >= 0x06A8 && offset <= 0x06CF) {
            line = 13;
            column = offset - 0x06A8;
        } else if (offset >= 0x0728 && offset <= 0x074F) {
            line = 14;
            column = offset - 0x0728;
        } else if (offset >= 0x07A8 && offset <= 0x07CF) {
            line = 15;
            column = offset - 0x07A8;
        } else if (offset >= 0x0450 && offset <= 0x0477) {
            line = 16;
            column = offset - 0x0450;
        } else if (offset >= 0x04D0 && offset <= 0x04F7) {
            line = 17;
            column = offset - 0x04D0;
        } else if (offset >= 0x0550 && offset <= 0x0577) {
            line = 18;
            column = offset - 0x0550;
        } else if (offset >= 0x05D0 && offset <= 0x05F7) {
            line = 19;
            column = offset - 0x05D0;
        } else if (offset >= 0x0650 && offset <= 0x0677) {
            line = 20;
            column = offset - 0x0650;
        } else if (offset >= 0x06D0 && offset <= 0x06F7) {
            line = 21;
            column = offset - 0x06D0;
        } else if (offset >= 0x0750 && offset <= 0x0777) {
            line = 22;
            column = offset - 0x0750;
        } else if (offset >= 0x07D0 && offset <= 0x07F7) {
            line = 23;
            column = offset - 0x07D0;
        }

        const charCode = value - 128;
        screen[line] = replaceCharAt(screen[line], column, charCode in charSet ? charSet[charCode] : ' ');
        text.innerText = screen.join("\n");
    }
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
        if (state.PC === 0xD409) console.log('D409');
        if (state.PC === 0xD40D) console.log('D40D');
        setImmediate(step);
    } else {
        setTimeout(step, 500);
    }
}

step();