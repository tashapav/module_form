export interface IDynamicInputReferenceProps {
    reference: string;
    fieldProps: {
        source: string;
        helperText: string;
        label: string | boolean;
        defaultValue: string | number | boolean | object | string[] | number[] | boolean[] | object[] | undefined;
    }
}
