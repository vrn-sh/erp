import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './Editor.scss';
import config from '../../../../../config';
import Cookies from 'js-cookie';
import axios from 'axios';

function MarkdownEditor({mission}: {mission: number}) {
  const [markdownText, setMarkdownText] = useState('# Loading from backend...');

  useEffect(() => {
    if (mission === -1) {
      setMarkdownText('# Please select a mission with the Select button above.');
    }
    fetchDataFromBackend()
      .then((result) => {
        setMarkdownText(result);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []); // Empty dependency array


  const fetchDataFromBackend = async () => {
    const response = await axios.get(
        `${config.apiUrl}/markdown`, {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Token ${Cookies.get('Token')}`,
          },
          data: {
            mission: mission,
            download: false,
          }
        });
    const data = await response.data;
    return data;
  };

  const handleInputChange = (e: any) => {
    setMarkdownText(e.target.value);
  };

  return (
    <div className="markdown-editor">
      <div className="editor-column">
        <h2>Markdown Editor</h2>
        <textarea
          rows={10}
          value={markdownText}
          onChange={handleInputChange}
        />
      </div>
      <div className="previewer-column">
        <h2>Markdown Previewer</h2>
        <div className="markdown-preview">
          <ReactMarkdown>{markdownText}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export default MarkdownEditor;