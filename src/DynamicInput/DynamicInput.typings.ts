import { TFieldDeclaration, TFieldOption } from '../DynamicStructure/DynamicStructure.typings';

export interface IDynamicInputProps {
    fromArray?: boolean;
    sourcePath: string;
    repeated: boolean;
    value?: string | number | boolean | string[] | number[] | boolean[] | object | object[];
    field: TFieldDeclaration;
    source: string;
    options: TFieldOption[] | null | undefined;
}
