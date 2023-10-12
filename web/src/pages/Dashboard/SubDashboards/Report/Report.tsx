import React, { Dispatch, SetStateAction } from 'react';
import './Report.scss';
import axios from 'axios';
import Cookies from 'js-cookie';
import NewTemplate from '../../../../../public/templates/template_0.png';
import AcademicTemplate from '../../../../../public/templates/template_1.png';
import Red4SecTemplate from '../../../../../public/templates/template_2.png';
import NASATemplate from '../../../../../public/templates/template_3.png';
import HackmanitTemplate from '../../../../../public/templates/template_4.png';
import MarkdownEditor from './Markdown/Editor';
import SelectMission from '../../../../component/SelectMission';
import BackButton from '../../../../component/BackButton';
import config from '../../../../config';
import { getCookiePart } from '../../../../crypto-utils';

const templates = [
    // { id: 0, name: 'new', subtitle: 'Empty', thumbnail: NewTemplate },
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
    { id: 3, name: 'NASA', subtitle: 'NASA Style', thumbnail: NASATemplate },
];

// type for setMD and setTemplate
function DocumentTemplates({
    setMD,
    setTemplate,
    mission,
}: {
    setMD: Dispatch<SetStateAction<boolean>>;
    setTemplate: Dispatch<SetStateAction<number>>;
    mission: number;
}) {
    const handleTemplateSelection = async (templateId: number) => {
        if (mission === -1) {
            alert('Please select a mission first!'); // TODO replace by popup like in Tooltip.
            return;
        }

        setTemplate(templateId);
        console.log('template id', templates[templateId].name);
        axios
            .get(`${config.apiUrl}/download-report`, {
                headers: {
                    Authorization: `Token ${getCookiePart(Cookies.get('Token')!, 'token')}`,
                },
                params: {
                    template_name: templates[templateId].name,
                    mission,
                    download: true,
                },
                maxRedirects: 5,
                timeout: 10000,
            })
            .then((response) => {
                console.log(response);
                window.open(response.data, '_blank');
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
    const [template, setTemplate] = React.useState(-1);
    const [isMDActivated, setMD] = React.useState(false);
    const [mission, setMissionId] = React.useState(-1);

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

            <SelectMission setMissionId={setMissionId} missionId={mission} />

            {isMDActivated ? (
                <MarkdownEditor mission={mission} />
            ) : (
                <DocumentTemplates
                    setMD={setMD}
                    setTemplate={setTemplate}
                    mission={mission}
                />
            )}
        </div>
    );
}
