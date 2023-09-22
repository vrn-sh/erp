import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import './BackButton.scss';

import React from 'react';

export default function BackButton({
    onClick,
    label,
}: {
    onClick: () => void;
    label: string;
}) {
    return (
        <button
            type="button"
            className="back-btn secondary-button secondary-btn"
            onClick={onClick}
            style={{ display: 'flex' }}
        >
            <ArrowBackIosIcon
                sx={{ fontSize: '1em', paddingTop: '4px' }}
                onClick={onClick}
            />
            {label}
        </button>
    );
}
