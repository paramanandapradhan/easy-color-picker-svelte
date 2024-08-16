export type EasyColorPickerPropsType = {
    hasAlphaBar?: boolean;
    hasColorPalletes?: boolean;
    colorPalletes?: string[];
    color?: string;
    alphaBarHeight?: number;
    copiedText?: string;
    colorBoardClassName?: string;
    alphaBarClassName?: string;
    colorPalletesClassName?: string;
    colorBoardContainerClassName?: string;
    alphaBarContainerClassName?: string;
    colorPalletesContainerClassName?: string;
    colorPalletesPreviewButtonClassName?: string;
    colorPalletesPallateButtonClassName?: string;
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
declare const EasyColorPicker: $$__sveltets_2_IsomorphicComponent<EasyColorPickerPropsType, {
    [evt: string]: CustomEvent<any>;
}, {}, {}, "color">;
type EasyColorPicker = InstanceType<typeof EasyColorPicker>;
export default EasyColorPicker;
