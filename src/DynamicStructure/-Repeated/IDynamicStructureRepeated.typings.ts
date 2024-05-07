import { IDynamicStructureProps, TFieldDeclaration } from '../DynamicStructure.typings';

export type DynamicStructureRepeatedProps = {
    field: TFieldDeclaration,
    objProps: IDynamicStructureProps,
    fieldProps: {
        label: string;
        source: string;
    };
} & IDynamicStructureProps;
