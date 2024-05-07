import React from 'react';
import { KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import { ButtonBase } from '@mui/material';
import { IDynamicStructureCutProps } from './DynamicStructure-Cut.typings';

// import './DynamicStructure-Cut.css';

export const DynamicStructureCut: React.FC<IDynamicStructureCutProps> = props => {
    const {
        onClick,
        isToggled,
        isPending,
        text,
        isIconDisabled = false,
    } = props;

    return (
        <ButtonBase
            onClick={onClick}
            className={'DynamicStructureCut'}
            disableRipple
        >
            {isToggled ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
            <h2>{text}</h2>
            {isPending && !isIconDisabled && <HourglassTopIcon className={'DynamicStructureCut-Loading'} />}
        </ButtonBase>
    );
};
