import React, { memo } from 'react';
import {
    ArrayInput,
    AutocompleteArrayInput,
    NumberInput,
    SelectInput,
    SimpleFormIterator,
    TextInput,
    BooleanInput,
    useLocale,
    DateInput,
    required,
} from 'react-admin';
import { getSourcePath } from '../DynamicStructure/DynamicStructure.utils/getSourcePath';
import { IDynamicInputProps } from './DynamicInput.typings';
import { styles } from './DynamicInput.styles';
import { DynamicInputReference } from './-Reference/DynamicInput-Reference';

export const DynamicInput = memo(function DynamicInput(
    props: IDynamicInputProps,
) {/*interface IDynamicInputProps {
        fromArray?: boolean;
        sourcePath: string;
        repeated: boolean;
        value?: string | number | boolean | string[] | number[] | boolean[] | object | object[];
        field: TFieldDeclaration;
        source: string;
        options: TFieldOption[] | null | undefined;
    }
    */
    const {
        field,
        fromArray,
        sourcePath,
        options,
        repeated,
        value,
    } = props;

    const locale = useLocale();
    const { name, type } = field;

    const fieldProps = {
        source: fromArray ? props.source : getSourcePath(name, sourcePath),
        helperText: '',
        label: fromArray ? false : name,
        defaultValue: value,
    } as const;

    if (options?.length) {
        const choices = options?.map(option => ({
            id: option.code,
            name: option.description?.[locale] ?? option.code ?? '',
        }));

        return repeated
            ? <AutocompleteArrayInput /*список с множественным выбором*/
                sx={styles.root}
                {...fieldProps}
                choices={choices}
                defaultValue={Array.isArray(fieldProps.defaultValue) ? fieldProps.defaultValue : []}
            /> 
            : <SelectInput /*список с выбором одного варианта*/
                sx={styles.root}
                {...fieldProps}
                choices={choices}
                validate={required()}
                defaultValue={choices[0].id}
            />;
    }

    if (repeated) {
        return (
            <ArrayInput /*Для редактирования массивов данных*/
                {...fieldProps}
                sx={{
                    ...styles.root,
                    ...styles.arrayInput,
                }}
            >
                <SimpleFormIterator inline>
                    <DynamicInput
                        field={field}
                        fromArray
                        repeated={false}
                        source={''}
                        sourcePath={''}
                        options={options}
                    />
                </SimpleFormIterator>
            </ArrayInput>
        );
    }

    if (type === 'int') {
        if (field.reference?.resource) {
            return (
                <DynamicInputReference
                    fieldProps={fieldProps}
                    reference={field.reference.resource}
                />
            );
        }

        return <NumberInput sx={{...styles.root, ...styles.singleInput}} {...fieldProps} />;
    }

    if (type === 'str') {
        if (field.reference?.resource) {
            return (
                <DynamicInputReference
                    fieldProps={fieldProps}
                    reference={field.reference.resource}
                />
            );
        }

        return (
            <TextInput
                sx={{...styles.root, ...styles.singleInput}}
                {...fieldProps}
                defaultValue={fieldProps.defaultValue ?? ''}
            />
        );
    }

    if (type === 'bool') {
        return <BooleanInput sx={{...styles.root, ...styles.singleInput}} {...fieldProps} />;
    }

    if (type === 'datetime') {
        return <DateInput sx={{...styles.root, ...styles.singleInput}} {...fieldProps} />;
    }

    return <p>Unexpected type {sourcePath}{name}</p>;
});
