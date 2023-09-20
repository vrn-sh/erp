import React from 'react';
import MarkdownHelper from './MarkdownHelper';
import './Report.scss';
import NewTemplate from '../../../../../public/templates/template_0.png';
import AcademicTemplate from '../../../../../public/templates/template_1.png';
import Red4SecTemplate from '../../../../../public/templates/template_2.png';
import HackmanitTemplate from '../../../../../public/templates/template_3.png';
import NASATemplate from '../../../../../public/templates/template_4.png';

export default function Report() {
    return (
        <div>
            <DocumentTemplates />
        </div>
    );
}

function DocumentTemplates() {

    
  const templates = [
    { id: 0, name: 'new', subtitle: 'Empty', thumbnail: NewTemplate },
    { id: 1, name: 'academic', subtitle: 'Academic Style', thumbnail: AcademicTemplate },
    { id: 2, name: 'red4sec', subtitle: 'Red4Sec Style', thumbnail: Red4SecTemplate },
    { id: 3, name: 'hackmanit', subtitle: 'Hackmanit Style', thumbnail: HackmanitTemplate },
    { id: 4, name: 'NASA', subtitle: 'NASA Style', thumbnail: NASATemplate },
  ];

  return (
    <>
    <div className="report-templates-container">
        <div>
            <button style={{minWidth: '33%'}}>Download as MarkDown</button>
        </div>
      <h2 style={{textAlign: "left"}}>Templates</h2>
      <div className="template-row">
        {templates.map((template) => (
          <div key={template.id} className="template">
            <img src={template.thumbnail} alt={template.name} />
            <p className="template-name">{template.name}</p>
            <p className="template-subtitle">{template.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
    </>

  );
}