export function handleIO(memory: Uint8Array, offset: number, value?: number) {
    switch (offset) {
        case 0xC010:
            // Keyboard clear.
            memory[0xC000] &= 0x7F;
            break;
    }
}