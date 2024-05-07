import React, { useMemo, memo } from 'react';
import { ArrayInput, SimpleFormIterator, SimpleFormIteratorItemContext } from 'react-admin';
import { DynamicStructure } from '../DynamicStructure';
import { DynamicStructureRepeatedProps } from './IDynamicStructureRepeated.typings';

export const DynamicStructureRepeated = memo(function DynamicStructureRepeated (
    props: DynamicStructureRepeatedProps,
) {
    const { data, sourcePath, field, objProps, fieldProps } = props;

    const defaultValue = useMemo(() => {
        return !Array.isArray(data) && typeof data === 'object' && data?.[field.name];
    }, [data, field.name]);

    return (
        <ArrayInput
            {...fieldProps}
            defaultValue={defaultValue ?? []}
        >
            <SimpleFormIterator inline>
                <SimpleFormIteratorItemContext.Consumer>
                    {({index}) => (
                        <DynamicStructure
                            {...objProps}
                            fromArray
                            arrayIndex={index}
                            sourcePath={field.type === 'oneOf' ? objProps.sourcePath ?? '' : `${sourcePath}.${field.name}.${index}`}
                        />
                    )}
                </SimpleFormIteratorItemContext.Consumer>
            </SimpleFormIterator>
        </ArrayInput>
    );
});
