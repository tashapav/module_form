import { IDynamicStructureProps, TFieldDeclaration } from '../DynamicStructure.typings';
import { getInputData } from './getInputData';
import { getSourcePath } from './getSourcePath';

export function computeObjProps(
    props: IDynamicStructureProps,
    field: TFieldDeclaration,
    id: number,
): IDynamicStructureProps {
    const {
        data,
        fromArray,
        arrayIndex,
        types,
        sourcePath,
    } = props;

    if (field.type === 'oneOf' && field.one_of?.length) {
        const dataElement = Array.isArray(data) && fromArray ? data[arrayIndex ?? 0] : data;
        const oneOfWithData = field.one_of.reduce<{name?: string; proto_name?: string;}>((acc, curr) => {
            if (dataElement && typeof dataElement === 'object' && curr.name in dataElement) {
                acc = {
                    name: curr.name,
                    proto_name: curr.type,
                };
            }

            return acc;
        }, {});

        const oneOfProto = oneOfWithData.name ? oneOfWithData : {
            name: field.one_of[0].name,
            proto_name: field.one_of[0].type,
        };

        if (oneOfProto.name) {
            return {
                proto_name: oneOfProto.proto_name,
                data: !Array.isArray(dataElement) && typeof dataElement === 'object' && dataElement?.[oneOfProto.name],
                types,
                sourcePath: getSourcePath(oneOfProto.name, sourcePath),
                source: getSourcePath(oneOfProto.name, sourcePath),
                fromArray: false,
                name: {
                    ...field.description,
                },
                id,
                description: oneOfProto.name,
            };
        }
    }

    return {
        types,
        data: getInputData(data, field, fromArray, arrayIndex),
        sourcePath: getSourcePath(field.name, sourcePath),
        source: getSourcePath(field.name, sourcePath),
        proto_name: field.type,
        fromArray: false,
        id,
        name: {
            ...field.description,
        },
    };
}
