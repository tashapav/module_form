import React from 'react';
import { DynamicInput } from '../DynamicInput/DynamicInput';
import { IDynamicStructureProps, primitiveFields } from './DynamicStructure.typings';

// import './DynamicStructure.css';
import { DynamicStructureOneOf } from './-OneOf/DynamicStructureOneOf';
import { DynamicStructureRepeated } from './-Repeated/DynamicStructureRepeated';
import { getInputData, computeObjProps } from './DynamicStructure.utils';
import { getSourcePath } from './DynamicStructure.utils/getSourcePath';

export const DynamicStructure = (props: IDynamicStructureProps) => {
    const {
        proto_name,
        data,
        types,
        sourcePath,
        fromArray,
        arrayIndex,
        id,
        expanded,
    } = props;


    const currentType = types.find(({ type }) => type === proto_name);
    if (!currentType?.fields) {
        return null;
    }
    return (
        <div>
            {
                currentType.fields.map((field, index) => {
                    const isPrimitive = primitiveFields.find(primitiveField => primitiveField === field.type);
                    const enumType = types.find(({ type }) => type === field.type);

                    if (isPrimitive || enumType?.options?.length) {
                        const inputData = getInputData(data, field, fromArray, arrayIndex);
                        return (
                            <DynamicInput
                                key={`${field.name}-${index}`}
                                field={field}
                                options={enumType?.options ?? []}
                                sourcePath={`${sourcePath}`}
                                repeated={field.repeated}
                                fromArray={false}
                                value={inputData}
                                source={`${sourcePath}`}
                            />
                        );
                    }

                    const objProps = computeObjProps(props, field, id);

                    const fieldProps = {
                        label: field.name,
                        source: fromArray ? props.source : getSourcePath(field.name, sourcePath),
                    };

                    if (field.repeated) {
                        return (
                            <DynamicStructureRepeated
                                key={`${field.name}-${index}`}
                                {...props}
                                isOneOfChild={false}
                                field={field}
                                fieldProps={fieldProps}
                                objProps={objProps}
                            />
                        );
                    }

                    return (
                        <DynamicStructureOneOf
                            key={`${field.name}-${index}`}
                            {...objProps}
                            field={field}
                            expanded={expanded}
                        />
                    );
                })
            }
        </div>
    );
};


