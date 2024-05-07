import React, {memo, useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { useFormContext } from 'react-hook-form';
import { Grid, MenuItem } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { DynamicStructure } from '../DynamicStructure';
import { IDynamicStructureProps, TFieldDeclaration } from '../DynamicStructure.typings';
import { getSourcePath } from '../DynamicStructure.utils/getSourcePath';
import { getParentFieldSource } from '../DynamicStructure.utils/getParentFieldSource';
import { DynamicStructureCut } from '../-Cut/DynamicStructure-Cut';
import { styles } from './DynamicStructureOneOf.styles';

// import './DynamicStructureOneOf.css';

export const DynamicStructureOneOf = memo(function DynamicStructureOneOf(
    props: IDynamicStructureProps & { field: TFieldDeclaration },
) {
    const { description, field, data, proto_name, source, expanded = false } = props;

    const originalOneOfOptionRef = useRef(proto_name);
    const [currentOneOfOption, setCurrentOneOfOption] = useState(proto_name);
    const [currentSource, setCurrentSource] = useState(source);
    const currentOptionRef = useRef<string | undefined>(proto_name);
    const { resetField } = useFormContext();
    const [isPending, startTransition] = useTransition();
    const [isDynamicNodeVisible, setIsDynamicNodeVisible] = useState(false);

    const changeOneOfOption = useCallback((evt: SelectChangeEvent) => {
        if (evt.target.value) {
            const selectedProtoType = evt.target.value;
            const newOneOfOption = field.one_of?.find(option => option.type === selectedProtoType);
            let oldOption: TFieldDeclaration | undefined;

            if (newOneOfOption) {
                oldOption = field.one_of?.find(({ type }) => type === currentOptionRef.current);
                const parentSource = getParentFieldSource(source);
                const newSource = `${parentSource}.${newOneOfOption.name}`;
                setCurrentSource(newSource);

                if (oldOption) {
                    resetField(getSourcePath(oldOption.name, parentSource));
                }

                startTransition(() => {
                    setCurrentOneOfOption(() => {
                        currentOptionRef.current = newOneOfOption.type;
                        return newOneOfOption.type;
                    });
                });
            }
        }
    }, [field.one_of, resetField, source]);

    const toggleDynamicNode = useCallback(() => setIsDynamicNodeVisible(prev => !prev), []);

    useEffect(() => {
        setIsDynamicNodeVisible(expanded);
    }, [expanded]);

    const isOneOf = description && Boolean(field.one_of?.length);

    return (
        <div className={isOneOf ? 'DynamicStructureOneOf' : ''}>
            {isOneOf && (
                <Grid container spacing={1}>
                    <DynamicStructureCut
                        isPending={isPending}
                        isToggled={isDynamicNodeVisible}
                        text={''}
                        onClick={toggleDynamicNode}
                        isIconDisabled
                    />
                    <Grid item xs={2} sx={styles.oneOf}>
                        <Select
                            onChange={changeOneOfOption}
                            value={currentOneOfOption}
                        >
                            {field.one_of?.map(({type, name}) => (
                                <MenuItem key={type} value={type}>
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={12} />
                </Grid>
            )}
            {!isPending && (isDynamicNodeVisible || !isOneOf) && (
                <DynamicStructure
                    {...props}
                    proto_name={currentOneOfOption}
                    data={currentOneOfOption === originalOneOfOptionRef.current ? data : null}
                    source={currentSource}
                    sourcePath={currentSource}
                    isOneOfChild
                />
            )}
        </div>
    );
},
);
