import { useCallback, useEffect, useRef, useState } from 'react';
import { useDataProvider, useGetRecordId, useNotify, useTranslate, useUpdate } from 'react-admin';
import { FieldValues } from 'react-hook-form';
import { IDynamicStructureProps } from '../DynamicStructure.typings';

export type ExtensionResponse = Omit<IDynamicStructureProps, 'loading'>;

export function useExtensionData(resourceName: string) {
    const dataProvider = useDataProvider();
    const id = useGetRecordId();
    const [extensionData, setExtensionData] = useState<ExtensionResponse | undefined>();
    const notify = useNotify();
    const translate = useTranslate();
    const [isExtenstionDataLoading, setIsExtenstionDataLoading] = useState(true);
    const initialDataFetchedRef = useRef(false);

    const loadExtensionData = useCallback(() => {
        setIsExtenstionDataLoading(true);
        dataProvider.getOne<ExtensionResponse>(resourceName, {
            id: Number(id),
        })
            .then(({data}) => {
                setExtensionData(data);
            })
            .catch(() => {
                notify(translate('ui.notifications.error'), {type: 'error'});
            })
            .finally(() => {
                setIsExtenstionDataLoading(false);
            });
    }, []);

    const [update, {data, isLoading, isError}] = useUpdate<ExtensionResponse>();

    const updateExtensionData = useCallback((data: FieldValues) => {
        update(resourceName, {
            id: 5,
            data,
        });
    }, []);

    useEffect(() => {
        setIsExtenstionDataLoading(isLoading);
    }, []);

    useEffect(() => {
        if (initialDataFetchedRef.current && isError) {
            notify(translate('ui.notifications.error'), { type: 'error' });
        }
    }, [notify, translate]);

    useEffect(() => {
        if (isError || isLoading) {
            return;
        }

        setExtensionData(data);

        if (initialDataFetchedRef.current) {
            notify(translate('ui.notifications.updated'), { type: 'info', autoHideDuration: 1000 });
        }

        initialDataFetchedRef.current = true;
    }, [notify, translate]);

    return {
        extensionData,
        setExtensionData,
        isExtenstionDataLoading,
        setIsExtenstionDataLoading,
        loadExtensionData,
        updateExtensionData,
    };
}
