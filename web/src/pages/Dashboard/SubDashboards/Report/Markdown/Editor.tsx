import React, { useEffect, useState } from 'react';
import './Editor.scss';
import Cookies from 'js-cookie';
import axios from 'axios';
import Markdown from 'markdown-to-jsx';
import DownloadIcon from '@mui/icons-material/Download';
import config from '../../../../../config';
import Tooltip from '../../../../../component/Tooltip/Tooltip';
import MarkdownHelper from './MarkdownHelper';
import { getCookiePart } from '../../../../../crypto-utils';

function MarkdownEditor({ mission }: { mission: number }) {
    const [markdownText, setMarkdownText] = useState(
        '# Loading from backend...'
    );

    const fetchDataFromBackend = async () => {
        const response = await axios.get(`${config.apiUrl}/markdown-report`, {
            headers: {
                Authorization: `Token ${getCookiePart(Cookies.get('Token')!, 'token')}`,
            },
            params: {
                mission,
                download: false,
            },
        });
        const data = await response.data;
        return data;
    };

    useEffect(() => {
        if (mission === -1) {
            setMarkdownText(
                '# Please select a mission with the Select button above.'
            );
            return;
        }
        fetchDataFromBackend()
            .then((result) => {
                setMarkdownText(result);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []); // Empty dependency array

    const handleInputChange = (e: any) => {
        setMarkdownText(e.target.value);
    };

    const handleDownload = async () => {
        if (mission === -1) {
            alert('Please select a mission with the Select button above.');
            return;
        }
        axios
            .get(`${config.apiUrl}/markdown-report`, {
                headers: {
                    Authorization: `Token ${getCookiePart(Cookies.get('Token')!, 'token')}`,
                },
                params: {
                    mission,
                    download: true,
                },
                maxRedirects: 5,
                timeout: 100000,
            })
            .then((response) => {
                const blob = new Blob([response.data]);
                const url = window.URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = 'README.md'; // Set the desired filename here
                a.style.display = 'none';
                document.body.appendChild(a);

                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    return (
        <>
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
                        <Markdown>{markdownText}</Markdown>
                    </div>
                </div>
            </div>
            <button
                type="button"
                style={{ minWidth: '100px', margin: '20px' }}
                onClick={handleDownload}
            >
                <DownloadIcon
                    onClick={handleDownload}
                    sx={{ fontSize: '1em', paddingTop: '4px', color: 'white' }}
                />
                DOWNLOAD
            </button>
            <Tooltip tip={<MarkdownHelper />} />
        </>
    );
}

export default MarkdownEditor;
