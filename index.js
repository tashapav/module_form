import { jsx, jsxs } from 'react/jsx-runtime';
import React, { memo, useRef, useState, useTransition, useCallback, useEffect, useMemo } from 'react';
import { useLocale, ReferenceInput, AutocompleteInput, AutocompleteArrayInput, SelectInput, required, ArrayInput, SimpleFormIterator, NumberInput, TextInput, BooleanInput, DateInput, SimpleFormIteratorItemContext, useDataProvider, useGetRecordId, useNotify, useTranslate, useUpdate, Form, SaveButton } from 'react-admin';
import { useFormContext } from 'react-hook-form';
import { ButtonBase, Grid, MenuItem, Switch } from '@mui/material';
import Select from '@mui/material/Select';
import { KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';

function getSourcePath(fieldName, sourcePath) {
    const sanitizedSourcePath = (sourcePath === null || sourcePath === void 0 ? void 0 : sourcePath.startsWith('.')) ? sourcePath.slice(1) : sourcePath;
    const source = sanitizedSourcePath ? `${sanitizedSourcePath}.` : '';
    return `${source}${fieldName}`;
}

const styles$2 = {
    root: {
        margin: '5px 0',
    },
    arrayInput: {
        borderRadius: '10px',
        border: '2px solid var(--material-primary-bg)',
        padding: '5px 10px',
        '&:before': {
            content: '"List"',
            color: '#000',
            fontWeight: 'bold',
        },
    },
    singleInput: {
        margin: '5px 10px 5px 0',
    },
};

const DynamicInputReference = memo(function DynamicInputReference(props) {
    var _a;
    const { fieldProps, reference } = props;
    const locale = useLocale();
    return (jsx(ReferenceInput, Object.assign({}, fieldProps, { reference: reference, label: (_a = String(fieldProps.label)) !== null && _a !== void 0 ? _a : '', children: jsx(AutocompleteInput, { optionText: (option) => { var _a, _b, _c; return (_b = (_a = option.name) === null || _a === void 0 ? void 0 : _a[locale]) !== null && _b !== void 0 ? _b : (_c = option.name) === null || _c === void 0 ? void 0 : _c.en; }, matchSuggestion: () => true, defaultValue: fieldProps.defaultValue, sx: Object.assign(Object.assign({}, styles$2.root), styles$2.singleInput) }) })));
});

const DynamicInput = memo(function DynamicInput(props) {
    var _a, _b, _c;
    const { field, fromArray, sourcePath, options, repeated, value, } = props;
    const locale = useLocale();
    const { name, type } = field;
    const fieldProps = {
        source: fromArray ? props.source : getSourcePath(name, sourcePath),
        helperText: '',
        label: fromArray ? false : name,
        defaultValue: value,
    };
    if (options === null || options === void 0 ? void 0 : options.length) {
        const choices = options === null || options === void 0 ? void 0 : options.map(option => {
            var _a, _b, _c;
            return ({
                id: option.code,
                name: (_c = (_b = (_a = option.description) === null || _a === void 0 ? void 0 : _a[locale]) !== null && _b !== void 0 ? _b : option.code) !== null && _c !== void 0 ? _c : '',
            });
        });
        return repeated
            ? jsx(AutocompleteArrayInput /*список с множественным выбором*/, Object.assign({ sx: styles$2.root }, fieldProps, { choices: choices, defaultValue: Array.isArray(fieldProps.defaultValue) ? fieldProps.defaultValue : [] }))
            : jsx(SelectInput /*список с выбором одного варианта*/, Object.assign({ sx: styles$2.root }, fieldProps, { choices: choices, validate: required(), defaultValue: choices[0].id }));
    }
    if (repeated) {
        return (jsx(ArrayInput /*Для редактирования массивов данных*/, Object.assign({}, fieldProps, { sx: Object.assign(Object.assign({}, styles$2.root), styles$2.arrayInput), children: jsx(SimpleFormIterator, { inline: true, children: jsx(DynamicInput, { field: field, fromArray: true, repeated: false, source: '', sourcePath: '', options: options }) }) })));
    }
    if (type === 'int') {
        if ((_a = field.reference) === null || _a === void 0 ? void 0 : _a.resource) {
            return (jsx(DynamicInputReference, { fieldProps: fieldProps, reference: field.reference.resource }));
        }
        return jsx(NumberInput, Object.assign({ sx: Object.assign(Object.assign({}, styles$2.root), styles$2.singleInput) }, fieldProps));
    }
    if (type === 'str') {
        if ((_b = field.reference) === null || _b === void 0 ? void 0 : _b.resource) {
            return (jsx(DynamicInputReference, { fieldProps: fieldProps, reference: field.reference.resource }));
        }
        return (jsx(TextInput, Object.assign({ sx: Object.assign(Object.assign({}, styles$2.root), styles$2.singleInput) }, fieldProps, { defaultValue: (_c = fieldProps.defaultValue) !== null && _c !== void 0 ? _c : '' })));
    }
    if (type === 'bool') {
        return jsx(BooleanInput, Object.assign({ sx: Object.assign(Object.assign({}, styles$2.root), styles$2.singleInput) }, fieldProps));
    }
    if (type === 'datetime') {
        return jsx(DateInput, Object.assign({ sx: Object.assign(Object.assign({}, styles$2.root), styles$2.singleInput) }, fieldProps));
    }
    return jsxs("p", { children: ["Unexpected type ", sourcePath, name] });
});

const primitiveFields = ['int', 'str', 'bool', 'datetime', 'enum'];

function getParentFieldSource(currentSource) {
    return currentSource.split('.').slice(0, -1).join('.');
}

// import './DynamicStructure-Cut.css';
const DynamicStructureCut = props => {
    const { onClick, isToggled, isPending, text, isIconDisabled = false, } = props;
    return (jsxs(ButtonBase, { onClick: onClick, className: 'DynamicStructureCut', disableRipple: true, children: [isToggled ? jsx(KeyboardArrowDown, {}) : jsx(KeyboardArrowRight, {}), jsx("h2", { children: text }), isPending && !isIconDisabled && jsx(HourglassTopIcon, { className: 'DynamicStructureCut-Loading' })] }));
};

const styles$1 = {
    oneOf: {
        display: 'flex',
        alignItems: 'center',
    },
};

// import './DynamicStructureOneOf.css';
const DynamicStructureOneOf = memo(function DynamicStructureOneOf(props) {
    var _a, _b;
    const { description, field, data, proto_name, source, expanded = false } = props;
    const originalOneOfOptionRef = useRef(proto_name);
    const [currentOneOfOption, setCurrentOneOfOption] = useState(proto_name);
    const [currentSource, setCurrentSource] = useState(source);
    const currentOptionRef = useRef(proto_name);
    const { resetField } = useFormContext();
    const [isPending, startTransition] = useTransition();
    const [isDynamicNodeVisible, setIsDynamicNodeVisible] = useState(false);
    const changeOneOfOption = useCallback((evt) => {
        var _a, _b;
        if (evt.target.value) {
            const selectedProtoType = evt.target.value;
            const newOneOfOption = (_a = field.one_of) === null || _a === void 0 ? void 0 : _a.find(option => option.type === selectedProtoType);
            let oldOption;
            if (newOneOfOption) {
                oldOption = (_b = field.one_of) === null || _b === void 0 ? void 0 : _b.find(({ type }) => type === currentOptionRef.current);
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
    const isOneOf = description && Boolean((_a = field.one_of) === null || _a === void 0 ? void 0 : _a.length);
    return (jsxs("div", { className: isOneOf ? 'DynamicStructureOneOf' : '', children: [isOneOf && (jsxs(Grid, { container: true, spacing: 1, children: [jsx(DynamicStructureCut, { isPending: isPending, isToggled: isDynamicNodeVisible, text: '', onClick: toggleDynamicNode, isIconDisabled: true }), jsx(Grid, { item: true, xs: 2, sx: styles$1.oneOf, children: jsx(Select, { onChange: changeOneOfOption, value: currentOneOfOption, children: (_b = field.one_of) === null || _b === void 0 ? void 0 : _b.map(({ type, name }) => (jsx(MenuItem, { value: type, children: name }, type))) }) }), jsx(Grid, { item: true, xs: 12 })] })), !isPending && (isDynamicNodeVisible || !isOneOf) && (jsx(DynamicStructure, Object.assign({}, props, { proto_name: currentOneOfOption, data: currentOneOfOption === originalOneOfOptionRef.current ? data : null, source: currentSource, sourcePath: currentSource, isOneOfChild: true })))] }));
});

const DynamicStructureRepeated = memo(function DynamicStructureRepeated(props) {
    const { data, sourcePath, field, objProps, fieldProps } = props;
    const defaultValue = useMemo(() => {
        return !Array.isArray(data) && typeof data === 'object' && (data === null || data === void 0 ? void 0 : data[field.name]);
    }, [data, field.name]);
    return (jsx(ArrayInput, Object.assign({}, fieldProps, { defaultValue: defaultValue !== null && defaultValue !== void 0 ? defaultValue : [], children: jsx(SimpleFormIterator, { inline: true, children: jsx(SimpleFormIteratorItemContext.Consumer, { children: ({ index }) => {
                    var _a;
                    return (jsx(DynamicStructure, Object.assign({}, objProps, { fromArray: true, arrayIndex: index, sourcePath: field.type === 'oneOf' ? (_a = objProps.sourcePath) !== null && _a !== void 0 ? _a : '' : `${sourcePath}.${field.name}.${index}` })));
                } }) }) })));
});

function getInputData(data, field, fromArray, arrayIndex) {
    if (!Array.isArray(data) &&
        typeof data === 'object') {
        return data === null || data === void 0 ? void 0 : data[field.name];
    }
    if (arrayIndex !== undefined &&
        arrayIndex !== null &&
        Array.isArray(data)) {
        const dataElement = data[arrayIndex];
        if (dataElement && typeof dataElement === 'object') {
            return dataElement[field.name];
        }
    }
}

function computeObjProps(props, field, id) {
    var _a;
    const { data, fromArray, arrayIndex, types, sourcePath, } = props;
    if (field.type === 'oneOf' && ((_a = field.one_of) === null || _a === void 0 ? void 0 : _a.length)) {
        const dataElement = Array.isArray(data) && fromArray ? data[arrayIndex !== null && arrayIndex !== void 0 ? arrayIndex : 0] : data;
        const oneOfWithData = field.one_of.reduce((acc, curr) => {
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
                data: !Array.isArray(dataElement) && typeof dataElement === 'object' && (dataElement === null || dataElement === void 0 ? void 0 : dataElement[oneOfProto.name]),
                types,
                sourcePath: getSourcePath(oneOfProto.name, sourcePath),
                source: getSourcePath(oneOfProto.name, sourcePath),
                fromArray: false,
                name: Object.assign({}, field.description),
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
        name: Object.assign({}, field.description),
    };
}

function useExtensionData(resourceName) {
    const dataProvider = useDataProvider();
    const id = useGetRecordId();
    const [extensionData, setExtensionData] = useState();
    const notify = useNotify();
    const translate = useTranslate();
    const [isExtenstionDataLoading, setIsExtenstionDataLoading] = useState(true);
    const initialDataFetchedRef = useRef(false);
    const loadExtensionData = useCallback(() => {
        setIsExtenstionDataLoading(true);
        dataProvider.getOne(resourceName, {
            id: Number(id),
        })
            .then(({ data }) => {
            setExtensionData(data);
        })
            .catch(() => {
            notify(translate('ui.notifications.error'), { type: 'error' });
        })
            .finally(() => {
            setIsExtenstionDataLoading(false);
        });
    }, []);
    const [update, { data, isLoading, isError }] = useUpdate();
    const updateExtensionData = useCallback((data) => {
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

const DynamicStructure = (props) => {
    const { proto_name, data, types, sourcePath, fromArray, arrayIndex, id, expanded, } = props;
    const currentType = types.find(({ type }) => type === proto_name);
    if (!(currentType === null || currentType === void 0 ? void 0 : currentType.fields)) {
        return null;
    }
    return (jsx("div", { children: currentType.fields.map((field, index) => {
            var _a, _b;
            const isPrimitive = primitiveFields.find(primitiveField => primitiveField === field.type);
            const enumType = types.find(({ type }) => type === field.type);
            if (isPrimitive || ((_a = enumType === null || enumType === void 0 ? void 0 : enumType.options) === null || _a === void 0 ? void 0 : _a.length)) {
                const inputData = getInputData(data, field, fromArray, arrayIndex);
                return (jsx(DynamicInput, { field: field, options: (_b = enumType === null || enumType === void 0 ? void 0 : enumType.options) !== null && _b !== void 0 ? _b : [], sourcePath: `${sourcePath}`, repeated: field.repeated, fromArray: false, value: inputData, source: `${sourcePath}` }, `${field.name}-${index}`));
            }
            const objProps = computeObjProps(props, field, id);
            const fieldProps = {
                label: field.name,
                source: fromArray ? props.source : getSourcePath(field.name, sourcePath),
            };
            if (field.repeated) {
                return (jsx(DynamicStructureRepeated, Object.assign({}, props, { isOneOfChild: false, field: field, fieldProps: fieldProps, objProps: objProps }), `${field.name}-${index}`));
            }
            return (jsx(DynamicStructureOneOf, Object.assign({}, objProps, { field: field, expanded: expanded }), `${field.name}-${index}`));
        }) }));
};

const styles = {
    formRoot: {
        marginTop: '30px',
        paddingBottom: '20px',
        marginLeft: '0%',
    },
};

const withExtensionResource = WrappedDynamicStructure => function DynamicStructure(props) {
    const { resource, resourceName } = props;
    const id = useGetRecordId();
    const { extensionData, isExtenstionDataLoading, loadExtensionData, updateExtensionData, } = useExtensionData(resource);
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
    const handleSubmit = useCallback((args) => {
        updateExtensionData(args);
    }, [updateExtensionData]);
    const handleExpandChange = useCallback(() => {
        setIsExpandAll(prev => !prev);
        if (!isDynamicStructureVisible) {
            setIsDynamicStructureVisible(true);
        }
    }, [isDynamicStructureVisible]);
    console.log(extensionData);
    return (jsx(React.Fragment, { children: jsx(Form, { onSubmit: handleSubmit, sanitizeEmptyValues: true, disabled: isExtenstionDataLoading, children: jsxs(Grid, { container: true, spacing: 3, className: 'DynamicStructureForm', sx: styles.formRoot, children: [jsx(Grid, { item: true, xs: 6, children: jsx(DynamicStructureCut, { onClick: handleCutClick, isToggled: isDynamicStructureVisible, isPending: isPending, text: resourceName, isIconDisabled: true }) }), jsx(Grid, { item: true, xs: 7, children: jsxs("h4", { children: ["\u0420\u0430\u0437\u0432\u0435\u0440\u043D\u0443\u0442\u044C \u0432\u0441\u0435", jsx(Switch, { defaultChecked: isExpandAll, onChange: handleExpandChange })] }) }), isDynamicStructureVisible && extensionData && (jsxs(Grid, { item: true, xs: 12, children: [jsx("hr", {}), jsx(WrappedDynamicStructure, Object.assign({}, extensionData, { id: Number(id), proto_name: extensionData.proto_name, fromArray: false, sourcePath: '', expanded: isExpandAll }))] })), jsx(Grid, { item: true, xs: 12, children: jsx(SaveButton, { disabled: isExtenstionDataLoading }) })] }) }, id) }));
};

export { DynamicInput, DynamicStructure, withExtensionResource };
//# sourceMappingURL=index.js.map
