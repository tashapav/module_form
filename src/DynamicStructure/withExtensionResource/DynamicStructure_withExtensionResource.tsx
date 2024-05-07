import React, { useCallback, useEffect, useState, useTransition } from 'react';
import { Form, SaveButton, useGetRecordId } from 'react-admin';
import { Grid, Switch } from '@mui/material';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import { IDynamicStructureProps } from '../DynamicStructure.typings';
import { useExtensionData } from '../DynamicStructure.utils/useExtensionData';

import './DynamicStructure_withExtensionResource.css';
import { DynamicStructureCut } from '../-Cut/DynamicStructure-Cut';
import { styles } from './DynamicStructure_withExtensionResource.styles';

type TWithExtensionResourceProps = {
    resource: string;
    resourceName: string;
}

interface IWithExtensionResource {
    (WrappedDynamicStructure: (props: IDynamicStructureProps) => JSX.Element | null): (props: TWithExtensionResourceProps) => JSX.Element | null;
}

export const withExtensionResource: IWithExtensionResource = WrappedDynamicStructure => function DynamicStructure(props) {
    const { resource, resourceName } = props;
    const id = useGetRecordId();
    const {
        extensionData,
        isExtenstionDataLoading,
        loadExtensionData,
        updateExtensionData,
    } = useExtensionData(resource);

    const [isDynamicStructureVisible, setIsDynamicStructureVisible] = useState(false);
    const [isExpandAll, setIsExpandAll] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleCutClick = useCallback(() => {
        startTransition(() => {
            setIsDynamicStructureVisible(prev => !prev);
        });
    }, []);

    useEffect(() => {
        loadExtensionData();
    }, [loadExtensionData]);

    const handleSubmit = useCallback<SubmitHandler<FieldValues>>((args) => {
        updateExtensionData(args);
    }, [updateExtensionData]);

    const handleExpandChange = useCallback(() => {
        setIsExpandAll(prev => !prev);
        if (!isDynamicStructureVisible) {
            setIsDynamicStructureVisible(true);
        }
    }, [isDynamicStructureVisible]);

    console.log(extensionData)

    return (
        <React.Fragment>
            <Form
                onSubmit={handleSubmit}
                key={id}
                sanitizeEmptyValues
                disabled={isExtenstionDataLoading}
            >
                <Grid
                    container
                    spacing={3}
                    className={'DynamicStructureForm'}
                    sx={styles.formRoot}
                >
                    <Grid item xs={6}>
                        <DynamicStructureCut
                            onClick={handleCutClick}
                            isToggled={isDynamicStructureVisible}
                            isPending={isPending}
                            text={resourceName}
                            isIconDisabled
                        />
                    </Grid>
                    <Grid item xs={7}>
                        <h4>
                            Развернуть все
                            <Switch defaultChecked={isExpandAll} onChange={handleExpandChange} />
                        </h4>
                    </Grid>
                    {isDynamicStructureVisible && extensionData && (
                        <Grid item xs={12}>
                            <hr />
                            <WrappedDynamicStructure
                                {...extensionData}
                                id={Number(id)}
                                proto_name={extensionData.proto_name}
                                fromArray={false}
                                sourcePath={''}
                                expanded={isExpandAll}
                            />
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <SaveButton disabled={isExtenstionDataLoading} />
                    </Grid>
                </Grid>
            </Form>
        </React.Fragment>
    );
};
