import React, { useEffect, useState } from 'react';
import '../EditMission/Mission.scss';
import '../Settings/Settings.scss';
import { useLocation } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import Cookies from 'js-cookie';
import Feedbacks from '../../component/Feedback';
import config from '../../config';
import Input from '../../component/Input';
import { getCookiePart } from '../../crypto-utils';

interface CreateClientInfoProps {
    switchToMain: () => void;
    clientId: number;
}

export default function CreateClientInfo({
    switchToMain,
    clientId,
}: CreateClientInfoProps) {
    const [Name, setName] = useState('');
    const [id, setId] = useState();
    const [logo, setLogo] = useState('');
    const [occupation, setOccupation] = useState('');
    const [Entity, setEntity] = useState('');
    const [Des, setDes] = useState('');
    const [NbEmployee, setNbEmployee] = useState('');
    const [start, setStart] = useState<Dayjs>(dayjs());
    const [open, setOpen] = useState(false);
    const [message, setMess] = useState<{ mess: string; color: string }>({
        mess: '',
        color: 'success',
    });
    const location = useLocation();

    const close = () => {
        setOpen(false);
    };

    const setMessage = (mess: string, color: string) => {
        setMess({ mess, color });
    };

    const Cancel = () => {
        switchToMain();
    };

    const AddLogo = async () => {
        if (!logo) return;

        await axios
            .patch(
                `${config.apiUrl}/mission/${id}`,
                {
                    logo,
                },
                {
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: `Token ${getCookiePart(
                            Cookies.get('Token')!,
                            'token'
                        )}`,
                    },
                }
            )
            .then((data) => {
                setMessage('Saved', 'success');
            })
            .catch((e) => {
                setMessage(e.message, 'error');
            });
    };

    const takeContent = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDes(event.target.value);
    };

    /* eslint-disable */
    function timeout(delay: number) {
        return new Promise((res) => setTimeout(res, delay));
    }
    /* eslint-enable */

    const handleSubmit = async () => {
        setOpen(true);
        if (start.isAfter(dayjs(), 'day')) {
            setMessage(
                'Please select a date that has already passed !',
                'error'
            );
            return;
        }
        AddLogo();

        await axios
            .post(
                `${config.apiUrl}/client-info`,
                {
                    company_name: Name,
                    brief_description: Des,
                    mission: id,
                    creation_date: start.format('YYYY-MM-DD'),
                    nb_employees: NbEmployee,
                    occupation,
                    legal_entity: Entity,
                },
                {
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: `Token ${getCookiePart(
                            Cookies.get('Token')!,
                            'token'
                        )}`,
                    },
                }
            )
            .then(async (data) => {
                setMessage('Created!', 'success');
                await timeout(1000);
                window.location.reload();
            })
            .catch((e) => {
                setMessage(e.message, 'error');
            });
    };

    const convertImageToBase64 = (file: File) => {
        return new Promise<string | ArrayBuffer | null>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            const base64Image = await convertImageToBase64(file);
            if (typeof base64Image === 'string') {
                setLogo(base64Image);
            } else {
                console.error('La conversion en base64 a échoué.');
            }
        }
    };

    useEffect(() => {
        setId(location.state.missionId);
    }, []);

    return (
        <div className="form-container">
            <div
                style={{
                    margin: '20px',
                    textAlign: 'left',
                    width: '30%',
                }}
            >
                <h3 style={{ margin: '0px' }}>Company information</h3>
                <p style={{ margin: '0px', fontSize: '17px' }}>
                    You can add some information about the company
                </p>
                <div className="form-group">
                    <label htmlFor="logo" className="input-label">
                        Logo
                    </label>
                    <input
                        type="file"
                        id="logo"
                        accept="image/*"
                        className="form-control"
                        title="Upload a logo for the mission"
                        onChange={(e) => handleFileUpload(e)}
                    />
                </div>
            </div>
            <div className="edit-form">
                <Input
                    label="Name"
                    labelState={Name}
                    setLabel={setName}
                    size="medium"
                />
                <Input
                    label="Legacy entity"
                    labelState={Entity}
                    setLabel={setEntity}
                    size="medium"
                />
                <Input
                    label="Occupation"
                    labelState={occupation}
                    setLabel={setOccupation}
                    size="medium"
                />
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        rows={5}
                        required
                        placeholder="Description"
                        className="form-control"
                        onChange={takeContent}
                        value={Des}
                    />
                </div>
                <Input
                    label="Number of employees"
                    labelState={NbEmployee}
                    setLabel={setNbEmployee}
                    size="medium"
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateField
                        label="Creation date"
                        value={start}
                        sx={{
                            paddingY: '8px',
                            width: '50%',
                            justifyContent: 'left',
                            display: 'flex',
                            marginTop: '10px',
                        }}
                        onChange={(newValue: any) => setStart(newValue)}
                        format="DD-MM-YYYY"
                    />
                </LocalizationProvider>
                <br />
                <div
                    style={{
                        display: 'flex',
                        width: '150px',
                        justifyContent: 'flex-start',
                    }}
                >
                    <button
                        type="submit"
                        onClick={Cancel}
                        className="cancel-btn"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="submit-button"
                    >
                        Create
                    </button>
                </div>
                {open && (
                    <Feedbacks
                        mess={message.mess}
                        color={message.color}
                        close={close}
                        open={open}
                    />
                )}
            </div>
        </div>
    );
}
