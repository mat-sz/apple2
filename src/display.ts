import charSet from "./charSet";

const textLineMap = [
    0x0400, 0x0480, 0x0500, 0x0580, 0x0600, 0x0680,
    0x0700, 0x0780, 0x0428, 0x04A8, 0x0528, 0x05A8,
    0x0628, 0x06A8, 0x0728, 0x07A8, 0x0450, 0x04D0,
    0x0550, 0x05D0, 0x0650, 0x06D0, 0x0750, 0x07D0,
];

const text = document.getElementById('text');

export function updateDisplay(memory: Uint8Array) {
    let screen = '';
    for (let line = 0; line < textLineMap.length; line++) {
        for (let column = 0; column <= 0x27; column++) {
            const address = textLineMap[line] + column;
            screen += charSet[memory[address] - 128] ?? ' ';
        }

        screen += '\n';
    }
    text.innerText = screen;
}