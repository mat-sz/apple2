import { MEMORY_SIZE } from '6502';

import { ROM, ROM_START } from './ROM';
import { handleIO } from './io';

const memory = new Uint8Array(MEMORY_SIZE);

memory.set(new Uint8Array(ROM), ROM_START);

export const getMemory = (offset: number) => {
    if (offset >= 0xC000 && offset <= 0xC0FF) {
        handleIO(memory, offset);
    }

    return memory[offset];
};

export const setMemory = (offset: number, value: number) => {
    // Prevent ROM writes.
    if (offset >= ROM_START) return;

    if (offset >= 0xC000 && offset <= 0xC0FF) {
        handleIO(memory, offset);
    }
    
    memory[offset] = value;
};