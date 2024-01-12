import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useLocation } from 'react-router-dom';
import './Report.scss';
import axios from 'axios';
import Cookies from 'js-cookie';
import AcademicTemplate from '../../../../assets/templates/template_1.png';
import Red4SecTemplate from '../../../../assets/templates/template_2.png';
import NASATemplate from '../../../../assets/templates/template_3.png';
import HackmanitTemplate from '../../../../assets/templates/template_4.png';
import MarkdownEditor from './Markdown/Editor';
import BackButton from '../../../../component/BackButton';
import config from '../../../../config';
import { FileInput } from '../../../../component/Input';
import PdfViewerComponent from './PDFEditor/PDFEditor';
import SelectMission from '../../../../component/SelectMission';

const templates = [
    {
        id: 0,
        name: 'academic',
        subtitle: 'Academic Style',
        thumbnail: AcademicTemplate,
    },
    {
        id: 1,
        name: 'yellow',
        subtitle: 'Yellow Style',
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

interface IReport {
    id: number;
    template: string;
    mission: number;
    pdf_file: string;
    html_file: string;
    version: number;
    mission_title: string;
    updated_at: string;
}

// type for setMD and setTemplate
function DocumentTemplates({
    setMD,
    setTemplate,
    logo,
    setPDFDocURL,
    missionid,
}: {
    setMD: Dispatch<SetStateAction<boolean>>;
    setTemplate: Dispatch<SetStateAction<number>>;
    setPDFDocURL: Dispatch<SetStateAction<string>>;
    missionid: number;
    logo: string | null;
}) {
    const [reportHistory, setReportHistory] = useState<Array<IReport>>([]);

    useEffect(() => {
        // list all templates from history
        axios
            .get(`${config.apiUrl}/download-report`, {
                headers: {
                    Authorization: `Token ${Cookies.get('Token')}`,
                },
            })
            .then((response) => {
                console.log(response);
                if (response.data.count > 0) {
                    setReportHistory(response.data.results);
                }
            });
    }, [setTemplate]);
    const handleTemplateSelection = async (templateId: number) => {
        setTemplate(templateId);
        axios
            .post(
                `${config.apiUrl}/download-report`,
                {
                    template_name: templates[templateId].name,
                    mission: missionid,
                    logo,
                },
                {
                    headers: {
                        Authorization: `Token ${Cookies.get('Token')}`,
                    },
                }
            )
            .then((response) => {
                setPDFDocURL(response.data.pdf_file);
                console.log(response);
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
            <h2 style={{ textAlign: 'left' }}>History</h2>
            <div className="template-row">
                {reportHistory.length === 0 && <p>Nothing to show...</p>}
                {reportHistory.map((report) => (
                    <button
                        style={{ minWidth: '0%' }}
                        type="button"
                        onKeyDown={() => {
                            setPDFDocURL(report.pdf_file);
                        }}
                        key={report.id}
                        className="template"
                        onClick={() => {
                            setPDFDocURL(report.pdf_file);
                        }}
                    >
                        <img
                            src={
                                templates.find(
                                    (t) => t.name === report.template
                                )?.thumbnail
                            }
                            alt={report.template}
                        />
                        <p className="template-name">{report.mission_title}</p>
                        <p className="template-subtitle">{report.updated_at}</p>
                        <p className="template-subtitle">
                            Version {report.version}
                        </p>
                    </button>
                ))}
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
    const [PDFDocURL, setPDFDocURL] = useState<string>('');

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
                {(isMDActivated === true || PDFDocURL !== '') && (
                    <BackButton
                        onClick={() => {
                            setMD(false);
                            setPDFDocURL('');
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
                <SelectMission
                    setMissionId={setMissionId}
                    missionId={missionId}
                />
                {!isMDActivated && <FileInput setImage={handleImageUpload} />}
            </div>

            {isMDActivated && <MarkdownEditor missionid={missionId} />}
            {!isMDActivated && PDFDocURL === '' && (
                <DocumentTemplates
                    logo={logo}
                    setMD={setMD}
                    setTemplate={setTemplate}
                    setPDFDocURL={setPDFDocURL}
                    missionid={missionId}
                />
            )}
            {!isMDActivated && PDFDocURL !== '' && (
                <PdfViewerComponent document={PDFDocURL} />
            )}
        </div>
    );
}
