export declare function getCanvasEventXY(canvas: HTMLCanvasElement, event: any): {
    x: number;
    y: number;
};
export declare function hexToRGBA(hex: string): {
    r: number;
    g: number;
    b: number;
    a: number;
};
export declare function rgbaToHex(rgba: string): string;
export declare function copyText(str: string): void;
export declare function isValidHexColor(hex: string): boolean;
export declare function hexToHsl(hex: string): {
    h: number;
    s: number;
    l: number;
};
export declare function createGradientCanvas(width: number, height: number): HTMLCanvasElement;
export declare function blockEvent(event: MouseEvent | TouchEvent): void;
