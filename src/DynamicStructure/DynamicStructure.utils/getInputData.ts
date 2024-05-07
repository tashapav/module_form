import { IDynamicStructureProps, TFieldDeclaration } from '../DynamicStructure.typings';

export function getInputData(
    data: IDynamicStructureProps['data'],
    field: TFieldDeclaration,
    fromArray: boolean,
    arrayIndex?: number,
) {
    if (
        !Array.isArray(data) &&
        typeof data === 'object'
    ) {
        return data?.[field.name];
    }

    if (
        arrayIndex !== undefined &&
        arrayIndex !== null &&
        Array.isArray(data)
    ) {
        const dataElement = data[arrayIndex];
        if (dataElement && typeof dataElement === 'object') {
            return dataElement[field.name];
        }
    }
}
