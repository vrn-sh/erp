import React, { useRef } from 'react';
import { MdUploadFile } from 'react-icons/md';

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

export function FileInput({ setImage }: { setImage: (file: any) => void }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = React.useState<string | undefined>(
        undefined
    );

    const handleFileInputChange = () => {
        // Trigger a click event on the hidden file input when the custom button is clicked
        fileInputRef.current?.click();
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Handle the selected file(s) here
        const selectedFile = e.target.files?.[0];
        setFileName(selectedFile?.name);
        setImage(selectedFile);
    };

    return (
        <div>
            <button
                style={{
                    textAlign: 'left',
                    fontFamily: 'Poppins-regular',
                    backgroundColor: 'var(--primary-btn)',
                    color: 'white',
                    outline: 'none',
                    borderRadius: '5px',
                    width: '100%',
                    display: 'flex',
                }}
                type="button"
                className="btn"
                onClick={handleFileInputChange}
            >
                <MdUploadFile size={30} />
                <span style={{ marginLeft: '10px' }}>
                    {fileName || 'UPLOAD LOGO'}
                </span>
            </button>

            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
            />
        </div>
    );
}
