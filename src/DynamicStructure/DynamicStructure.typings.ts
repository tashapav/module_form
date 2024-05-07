export const primitiveFields = ['int', 'str', 'bool', 'datetime', 'enum'] as const;
type TPrimitiveField = typeof primitiveFields[number];
type TFieldType = TPrimitiveField | 'oneOf';

export type TFieldDeclaration = {
    name: string;
    type: TFieldType;
    description: Record<string, string> | null;
    repeated: boolean;
    one_of: TFieldDeclaration[] | null;
    fields: TFieldDeclaration;
    reference?: {
        resource?: string;
    }
}

export type TFieldOption = {
    id: number;
    code: string;
    description?: Record<string, string | undefined>;
}

export type TFieldData = Record<string, string | number | boolean> | string | number | boolean;

export type TFieldSchema = {
    type: string;
    fields: TFieldDeclaration[];
    options: TFieldOption[] | null | undefined;
}

export interface IDynamicStructureProps {
    proto_name?: string;
    sourcePath?: string;
    source: string;
    fromArray: boolean;
    id: number;
    name: Record<string, string>;
    types: TFieldSchema[];
    data: TFieldData | TFieldData[] | null | undefined;
    arrayIndex?: number;
    description?: string;
    isOneOfChild?: boolean;
    expanded?: boolean;
}
