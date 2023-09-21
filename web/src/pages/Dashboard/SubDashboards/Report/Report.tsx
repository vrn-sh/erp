import React, { Dispatch, SetStateAction } from 'react';
import './Report.scss';
import NewTemplate from '../../../../../public/templates/template_0.png';
import AcademicTemplate from '../../../../../public/templates/template_1.png';
import Red4SecTemplate from '../../../../../public/templates/template_2.png';
import NASATemplate from '../../../../../public/templates/template_3.png';
import HackmanitTemplate from '../../../../../public/templates/template_4.png';
import MarkdownEditor from './Markdown/Editor';
import { SelectMission } from '../../../../component/SelectMission';
import { BackButton } from '../../../../component/BackButton';
import axios from 'axios';
import config from '../../../../config';
import Cookies from 'js-cookie';

  const templates = [
    { id: 0, name: 'new', subtitle: 'Empty', thumbnail: NewTemplate },
    { id: 1, name: 'academic', subtitle: 'Academic Style', thumbnail: AcademicTemplate },
    { id: 2, name: 'red4sec', subtitle: 'Red4Sec Style', thumbnail: Red4SecTemplate },
    { id: 3, name: 'hackmanit', subtitle: 'Hackmanit Style', thumbnail: HackmanitTemplate },
    { id: 4, name: 'NASA', subtitle: 'NASA Style', thumbnail: NASATemplate },
  ];
export default function Report() {
    const [template, setTemplate] = React.useState(-1);
    const [isMDActivated, setMD] = React.useState(false);
    const [mission, setMissionId] = React.useState(-1);

    return (
        <div>
          <div style={{display: "content"}}>
            {isMDActivated &&
              <BackButton onClick={() => {setMD(false)}} label={"BACK TO TEMPLATES"} />
            }
            {
              !isMDActivated &&
                <div style={{height: "50px"}} />
            }
          </div>

          <SelectMission setMissionId={setMissionId} missionId={mission} />

            {isMDActivated ? 
                <MarkdownEditor mission={mission} />
                 :
                <DocumentTemplates setMD={setMD} setTemplate={setTemplate} mission={mission} />
            }
        </div>
    );
}

// type for setMD and setTemplate
function DocumentTemplates({setMD, setTemplate, mission}:
    {setMD: Dispatch<SetStateAction<boolean>>,
      setTemplate: Dispatch<SetStateAction<number>>,
      mission: number}) {

  const handleTemplateSelection = async (templateId: number) => {

    if (mission === -1) {
      alert("Please select a mission first!"); // TODO replace by popup like in Tooltip.
      return;
    }

    setTemplate(templateId);
    const response = await axios.get(`${config.apiUrl}/download-report`, {
      headers: {
        'Authorization': `Token ${Cookies.get('Token')}`,
      },
      params: {
        template_name: templates[templateId].name,
        mission: mission
      },
      maxRedirects: 5,
      timeout: 10000,
    });
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'Report.pdf'; // Set the desired filename here
      a.style.display = 'none';
      document.body.appendChild(a);

      a.click();
      window.URL.revokeObjectURL(url);
  }


  return (
    <>
    <div className="report-templates-container">

      <h2 style={{textAlign: "left"}}>Templates</h2>
      <div className="template-row">
        {templates.map((template) => (
          <div key={template.id} className="template" onClick={() => {handleTemplateSelection(template.id)}}>
            <img src={template.thumbnail} alt={template.name} />
            <p className="template-name">{template.name}</p>
            <p className="template-subtitle">{template.subtitle}</p>
          </div>
        ))}
      </div>
        <div>
            <button
                onClick={() => {setMD(true)}}
                style={{minWidth: '33%'}}>
                    DOWNLOAD AS MARKDOWN
            </button>
        </div>
    </div>
    </>

  );
}