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
import { IReport } from './types';

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



// type for setMD and setTemplate
function DocumentTemplates({
    setMD,
    setTemplate,
    reportInfo,
    setReportInfo
}: {
    setMD: Dispatch<SetStateAction<boolean>>;
    setTemplate: Dispatch<SetStateAction<number>>;
    reportInfo: IReport;
    setReportInfo: Dispatch<SetStateAction<IReport>>;

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
                    mission: reportInfo.mission, // so we have several report per mission
                    // but here we are talking about the selected mission via the select button
                    // and it is mixed with data efjiozejfeiozjfioezjfoizejfijze
                    logo: reportInfo.logo!, // same here
                },
                {
                    headers: {
                        Authorization: `Token ${Cookies.get('Token')}`,
                    },
                }
            )
            .then((response) => {
                setReportInfo(response.data);
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
                            setReportInfo(report);
                        }}
                        key={report.id}
                        className="template"
                        onClick={() => {
                            setReportInfo(report);
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
    const [reportInfo, setReportInfo] = useState<IReport>({
        id: -1,
        template: '',
        mission: 0,
        logo: null,
        pdf_file: '',
    });
    console.log("report info not in useEffect idunderstand how react works", reportInfo)
    const [templateIdx, setTemplateIdx] = useState(-1);
    const [isMDActivated, setMD] = useState(false);

    const handleImageUpload = (file: any) => {
        if (file) {
            const reader = new FileReader();

            reader.onload = (event) => {
                // The result property contains the base64-encoded image data
                const base64 = event.target?.result as string;
                setReportInfo({...reportInfo, logo: base64});
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        setReportInfo({...reportInfo, mission: location.state.missionId});
        console.log("in useEffect lol mdr", reportInfo);
    }, []);

    return (
        <div>
            <div style={{ display: 'content' }}>
                {(isMDActivated === true || reportInfo.pdf_file !== '') && (
                    <BackButton
                        onClick={() => {
                            setMD(false);
                            setReportInfo({...reportInfo, pdf_file: ''});
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
                    setMissionId={(mission) => setReportInfo({...reportInfo, mission: mission})}
                    missionId={reportInfo.mission!}
                />
                {!isMDActivated && <FileInput setImage={handleImageUpload} />}
            </div>

            {isMDActivated && <MarkdownEditor missionid={reportInfo.mission!} />}
            {!isMDActivated && reportInfo.pdf_file === '' && (
                <DocumentTemplates
                    setMD={setMD}
                    setTemplate={(idx) => {setTemplateIdx(idx); setReportInfo({...reportInfo, template: templates[templateIdx].name})}}
                    reportInfo={reportInfo}
                    setReportInfo={setReportInfo}
                />
            )}
            {!isMDActivated && reportInfo.documentURL !== "" && (
                <PdfViewerComponent
                    id={reportInfo.id}
                    mission={reportInfo.mission}
                    template={reportInfo.template}
                    pdf_file={reportInfo.pdf_file}
                     />

            )}
        </div>
    );
}
