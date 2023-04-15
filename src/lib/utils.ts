
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


export function hexToHsl(hex: string) {
    const rgb = hexToRGBA(hex);
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h: number = 0, s: number = 0, l: number = 0;

    l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
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

    return { h: h * 360, s: s * 100, l: l * 100 };
}

export function createGradientCanvas(width: number, height: number) {
    // Create an offscreen canvas
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = width;
    offscreenCanvas.height = height;
    const offscreenCtx = offscreenCanvas.getContext('2d');
    if (offscreenCtx) {
        // Draw the gradient on the offscreen canvas
        for (let y = 0; y < height; y++) {
            const ratio = y / (height - 1);
            for (let x = 0; x < width; x++) {
                const hue = x / width * 360;
                const lightness = 100 - ratio * 100;
                offscreenCtx.fillStyle = `hsl(${hue},${100}%,${lightness}%)`;
                offscreenCtx.fillRect(x, y, 1, 1);
            }
        }
    }

    return offscreenCanvas;
}
