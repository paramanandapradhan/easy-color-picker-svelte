export type ColorPalletesPropsType = {
    copiedText?: string;
    color?: string;
    colorPalletes?: string[];
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
declare const ColorPalletes: $$__sveltets_2_IsomorphicComponent<ColorPalletesPropsType, {
    [evt: string]: CustomEvent<any>;
}, {}, {
    saveLocalColor: (color: string) => string[];
}, "">;
type ColorPalletes = InstanceType<typeof ColorPalletes>;
export default ColorPalletes;
