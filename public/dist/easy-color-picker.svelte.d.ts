import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        color?: string | undefined;
        rgbaFormat?: boolean | undefined;
        copyString?: string | undefined;
        colorPalletes?: string[] | undefined;
        save?: ((color: string) => void) | undefined;
        setColor?: ((color: string) => void) | undefined;
    };
    events: {
        click: MouseEvent;
        color: CustomEvent<any>;
        copy: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type EasyColorPickerProps = typeof __propDef.props;
export type EasyColorPickerEvents = typeof __propDef.events;
export type EasyColorPickerSlots = typeof __propDef.slots;
export default class EasyColorPicker extends SvelteComponent<EasyColorPickerProps, EasyColorPickerEvents, EasyColorPickerSlots> {
    get save(): (color: string) => void;
    get setColor(): (color: string) => void;
}
export {};
