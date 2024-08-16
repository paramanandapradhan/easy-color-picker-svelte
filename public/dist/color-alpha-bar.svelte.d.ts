export declare enum AlphaBarDirectionEnum {
    HORIZONTAL = "horizontal",
    VERTICAL = "vertical"
}
export type AlphaBarPropsType = {
    id?: string;
    containerClassName?: string;
    innerClassName?: string;
    className?: string;
    height?: number;
    width?: number;
    alpha?: number;
    direction?: AlphaBarDirectionEnum;
    color?: string;
    reverse?: boolean;
    onAlpha?: (alpha: number) => void;
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
declare const ColorAlphaBar: $$__sveltets_2_IsomorphicComponent<AlphaBarPropsType, {
    [evt: string]: CustomEvent<any>;
}, {}, {
    setAlpha: (newalpha: number) => void;
    setColor: (newcolor: string) => void;
}, "alpha">;
type ColorAlphaBar = InstanceType<typeof ColorAlphaBar>;
export default ColorAlphaBar;
