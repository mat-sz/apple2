import charSet from './charSet';

const textLineMap = [
    0x0400, 0x0480, 0x0500, 0x0580, 0x0600, 0x0680,
    0x0700, 0x0780, 0x0428, 0x04A8, 0x0528, 0x05A8,
    0x0628, 0x06A8, 0x0728, 0x07A8, 0x0450, 0x04D0,
    0x0550, 0x05D0, 0x0650, 0x06D0, 0x0750, 0x07D0,
];

const display = document.getElementById('display') as HTMLCanvasElement;
const ctx = display.getContext('2d');

export function updateDisplay(memory: Uint8Array) {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, display.width, display.height);

    ctx.fillStyle = '#ff0000';
    ctx.font = '16px Monospace';

    for (let line = 0; line < textLineMap.length; line++) {
        let text = '';
        for (let column = 0; column <= 0x27; column++) {
            const address = textLineMap[line] + column;
            text += charSet[memory[address] - 128] ?? ' ';
        }

        ctx.fillText(text, 10, 25 + line * 20);
    }
}