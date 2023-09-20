import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import './BackButton.scss';

export function BackButton({onClick, label}: {onClick: () => void, label: string}) {
    return (
        <button
            className="back-btn secondary-button secondary-btn"
            onClick={onClick}
            style={{display: "flex"}}>
                <ArrowBackIosIcon
                    sx={{fontSize: "1em", paddingTop: "4px"}}
                    onClick={onClick} />
                    {label}
        </button>
    );
}