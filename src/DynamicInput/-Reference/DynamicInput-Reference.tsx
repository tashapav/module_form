import React, { memo } from 'react';
import { AutocompleteInput, ReferenceInput, useLocale } from 'react-admin';
import { styles } from '../DynamicInput.styles';
import { IDynamicInputReferenceProps } from './DynamicInputReference.typings';

export const DynamicInputReference: React.FC<IDynamicInputReferenceProps> = memo(function DynamicInputReference(props) {
    const { fieldProps, reference } = props;
    const locale = useLocale();

    return (
        <ReferenceInput
            {...fieldProps}
            reference={reference}
            label={String(fieldProps.label) ?? ''}
        >
            <AutocompleteInput
                optionText={(option) => option.name?.[locale] ?? option.name?.en}
                matchSuggestion={() => true}
                defaultValue={fieldProps.defaultValue}
                sx={{...styles.root, ...styles.singleInput}}
            />
        </ReferenceInput>
    );
});
