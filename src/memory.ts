import { MEMORY_SIZE } from '6502';
import { ROM, ROM_START } from './ROM';

const memory = new Uint8Array(MEMORY_SIZE);

memory.set(new Uint8Array(ROM), ROM_START);

export const getMemory = (offset: number) => {
    if (offset === 0xC010) {
        // Keyboard clear.
        setMemory(0xC000, memory[0xC000] & 0x7F);
    }

    return memory[offset];
};

export const setMemory = (offset: number, value: number) => {
    // Prevent ROM writes.
    if (offset >= ROM_START) return;
    memory[offset] = value;
};