import React from 'react';

type InputSizes = 'small' | 'medium' | 'large';
type InputProps = {
    label: string;
    labelState: any;
    setLabel: React.Dispatch<React.SetStateAction<string>>;
    size: string;
};

export default function Input({
    label,
    labelState,
    setLabel,
    size,
}: InputProps) {
    return (
        <div className={`input input-${size as InputSizes}`}>
            <label htmlFor={`input-${label}`} className="input-label">
                {label}
            </label>
            <input
                id={`input-${label}`}
                type="text"
                required
                value={labelState}
                onChange={(e) => setLabel(e.target.value)}
            />
        </div>
    );
}
