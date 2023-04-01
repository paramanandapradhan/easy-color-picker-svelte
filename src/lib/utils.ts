
export function getCanvasEventXY(canvas: HTMLCanvasElement, event: any): { x: number; y: number } {
    let x: number = 0;
    let y: number = 0;
    if (canvas && event) {
        if (event.touches && event.touches[0]) {
            const rect = canvas.getBoundingClientRect();
            x = event.touches[0].clientX - rect.left;
            y = event.touches[0].clientY - rect.top;
        } else {
            x = event.offsetX;
            y = event.offsetY;
        }
    }
    if (x < 0) x = 0;
    if (x > 255) x = 255;
    if (y < 0) y = 0;
    if (y > 255) y = 255;
    return { x, y };
}


export function hexToRGBA(hex: string): { r: number; g: number; b: number; a: number } {
    let r = 0,
        g = 0,
        b = 0,
        a = 1;
    let hexColor = hex.replace('#', '');
    if (hexColor.length >= 6) {
        r = parseInt(hexColor.substring(0, 2), 16);
        g = parseInt(hexColor.substring(2, 4), 16);
        b = parseInt(hexColor.substring(4, 6), 16);
        if (hexColor.length == 8) {
            a = parseInt(hexColor.substring(6, 8), 16) / 255;
        }
    } else if (hexColor.length == 3) {
        r = parseInt(hexColor.substring(0, 1).padStart(2, hexColor.substring(0, 1)), 16);
        g = parseInt(hexColor.substring(1, 2).padStart(2, hexColor.substring(1, 2)), 16);
        b = parseInt(hexColor.substring(2, 3).padStart(2, hexColor.substring(2, 3)), 16);
    }

    return { r, g, b, a };
}

export function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    const h = diff
        ? max === r
            ? ((g - b) / diff) % 6
            : max === g
                ? (b - r) / diff + 2
                : (r - g) / diff + 4
        : 0;
    const s = max ? diff / max : 0;
    const v = max / 255;
    return { h: h * 60, s: s * 100, v: v * 100 };
}

export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
        s = 0,
        l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    return [h * 360, s * 100, l * 100];
}

export function rgbaToHex(rgba: string): string {
    const [r, g, b, a] = (rgba.match(/\d+(\.\d+)?/g) || []).map(Number);
    const aHex = Math.round(a * 255)
        .toString(16)
        .padStart(2, '0');
    const rHex = r.toString(16).padStart(2, '0');
    const gHex = g.toString(16).padStart(2, '0');
    const bHex = b.toString(16).padStart(2, '0');
    if (a === 1) {
        return `#${rHex}${gHex}${bHex}`;
    } else {
        return `#${rHex}${gHex}${bHex}${aHex}`;
    }
}



export function colorDistance(rgb1: [number, number, number], rgb2: [number, number, number]): number {
    const rDiff = rgb1[0] - rgb2[0];
    const gDiff = rgb1[1] - rgb2[1];
    const bDiff = rgb1[2] - rgb2[2];
    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}

export function estimateColorPosition(
    hexColor: string,
    canvasWidth: number,
    canvasHeight: number,
    ctx: CanvasRenderingContext2D
): [number, number, number] {
    const { r, g, b, a } = hexToRGBA(hexColor);

    const targetColor: any = [r, g, b];

    let closestColorDistance = Infinity;
    let closestColorPosition: [number, number, number] = [0, 0, 0];

    for (let x = 0; x < canvasWidth; x++) {
        for (let y = 0; y < canvasHeight; y++) {
            const imageData = ctx.getImageData(x, y, 1, 1);
            const pixelColor: [number, number, number] = [
                imageData.data[0],
                imageData.data[1],
                imageData.data[2]
            ];

            const distance = colorDistance(targetColor, pixelColor);

            if (distance < closestColorDistance) {
                closestColorDistance = distance;
                closestColorPosition = [x, y, a];
            }
        }
    }


    return closestColorPosition;
}

export function copyText(str: string) {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    el.setSelectionRange(0, 99999); /* For mobile devices */
    if (navigator.clipboard) {
        navigator.clipboard.writeText(str);
    } else {
        document.execCommand('copy', false);
    }
    document.body.removeChild(el);
};

export function isValidHexColor(hex: string): boolean {
    const hexRegex = /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexRegex.test(hex);
}



