import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useLocation } from 'react-router-dom';
import './Report.scss';
import axios from 'axios';
import Cookies from 'js-cookie';
import NewTemplate from '../../../../../public/templates/template_0.png';
import AcademicTemplate from '../../../../../public/templates/template_1.png';
import Red4SecTemplate from '../../../../../public/templates/template_2.png';
import NASATemplate from '../../../../../public/templates/template_3.png';
import HackmanitTemplate from '../../../../../public/templates/template_4.png';
import MarkdownEditor from './Markdown/Editor';
import BackButton from '../../../../component/BackButton';
import config from '../../../../config';
import { FileInput } from '../../../../component/Input';

const templates = [
    {
        id: 0,
        name: 'academic',
        subtitle: 'Academic Style',
        thumbnail: AcademicTemplate,
    },
    {
        id: 1,
        name: 'red4sec',
        subtitle: 'Red4Sec Style',
        thumbnail: Red4SecTemplate,
    },
    {
        id: 2,
        name: 'hackmanit',
        subtitle: 'Hackmanit Style',
        thumbnail: HackmanitTemplate,
    },
    {
        id: 3,
        name: 'NASA',
        subtitle: 'NASA Style',
        thumbnail: NASATemplate,
    },
];

// type for setMD and setTemplate
function DocumentTemplates({
    setMD,
    setTemplate,
    missionid,
    logo,
}: {
    setMD: Dispatch<SetStateAction<boolean>>;
    setTemplate: Dispatch<SetStateAction<number>>;
    missionid: number;
    logo: string | null;
}) {
    const handleTemplateSelection = async (templateId: number) => {
        setTemplate(templateId);
        axios
            .post(
                `${config.apiUrl}/download-report`,
                {
                    template_name: templates[templateId].name,
                    missionid,
                    logo,
                },
                {
                    headers: {
                        Authorization: `Token ${Cookies.get('Token')}`,
                    },
                }
            )
            .then((response) => {
                console.log(response);
                window.open(response.data.html_file, '_blank');
            });
    };

    return (
        <div className="report-templates-container">
            <h2 style={{ textAlign: 'left' }}>Templates</h2>
            <div className="template-row">
                {templates.map((template) => (
                    <button
                        style={{ minWidth: '0%' }}
                        type="button"
                        onKeyDown={() => {
                            handleTemplateSelection(template.id);
                        }}
                        key={template.id}
                        className="template"
                        onClick={() => {
                            handleTemplateSelection(template.id);
                        }}
                    >
                        <img src={template.thumbnail} alt={template.name} />
                        <p className="template-name">{template.name}</p>
                        <p className="template-subtitle">{template.subtitle}</p>
                    </button>
                ))}
            </div>
            <div>
                <button
                    type="button"
                    onClick={() => {
                        setMD(true);
                    }}
                    style={{ minWidth: '33%' }}
                >
                    DOWNLOAD AS MARKDOWN
                </button>
            </div>
        </div>
    );
}

export default function Report() {
    const location = useLocation();
    const [missionId, setMissionId] = useState(0);
    const [template, setTemplate] = useState(-1);
    const [isMDActivated, setMD] = useState(false);
    const [logo, setBase64Image] = useState<string | null>(null);

    const handleImageUpload = (file: any) => {
        if (file) {
            const reader = new FileReader();

            reader.onload = (event) => {
                // The result property contains the base64-encoded image data
                const base64 = event.target?.result as string;
                setBase64Image(base64);
            };

            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        setMissionId(location.state.missionId);
    }, []);

    return (
        <div>
            <div style={{ display: 'content' }}>
                {isMDActivated && (
                    <BackButton
                        onClick={() => {
                            setMD(false);
                        }}
                        label="BACK TO TEMPLATES"
                    />
                )}
                {!isMDActivated && <div style={{ height: '50px' }} />}
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                }}
            >
                {!isMDActivated && <FileInput setImage={handleImageUpload} />}
            </div>

            {isMDActivated ? (
                <MarkdownEditor missionid={missionId} />
            ) : (
                <DocumentTemplates
                    logo={logo}
                    setMD={setMD}
                    setTemplate={setTemplate}
                    missionid={missionId}
                />
            )}
        </div>
    );
}
