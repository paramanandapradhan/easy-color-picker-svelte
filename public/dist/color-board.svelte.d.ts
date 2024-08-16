export type ColorBoardPropsType = {
    size?: number;
    color?: string;
    onColor?: (color: string) => void;
};
interface $$__sveltets_2_IsomorphicComponent<Props extends Record<string, any> = any, Events extends Record<string, any> = any, Slots extends Record<string, any> = any, Exports = {}, Bindings = string> {
    new (options: import('svelte').ComponentConstructorOptions<Props>): import('svelte').SvelteComponent<Props, Events, Slots> & {
        $$bindings?: Bindings;
    } & Exports;
    (internal: unknown, props: Props & {
        $$events?: Events;
        $$slots?: Slots;
    }): Exports & {
        $set?: any;
        $on?: any;
    };
    z_$$bindings?: Bindings;
}
declare const ColorBoard: $$__sveltets_2_IsomorphicComponent<ColorBoardPropsType, {
    [evt: string]: CustomEvent<any>;
}, {}, {
    setAlpha: (alpha: number) => void;
    setColor: (color: string) => void;
}, "color">;
type ColorBoard = InstanceType<typeof ColorBoard>;
export default ColorBoard;
