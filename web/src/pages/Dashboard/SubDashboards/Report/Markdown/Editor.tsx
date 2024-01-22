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

function MarkdownEditor({ missionid }: { missionid: number }) {
    const [markdownText, setMarkdownText] = useState(
        '# Loading from backend...'
    );
    const [isfetchDone, setFetchDone] = useState(false);

    const fetchDataFromBackend = async () => {
        const response = await axios.get(`${config.apiUrl}/markdown-report`, {
            headers: {
                Authorization: `Token ${getCookiePart(
                    Cookies.get('Token')!,
                    'token'
                )}`,
            },
            params: {
                mission: missionid,
                download: false,
            },
        });
        const data = await response.data;
        return data;
    };

    useEffect(() => {
        if (missionid === -1) {
            setMarkdownText(
                '# Please select a mission with the Select button above.'
            );
            return;
        }
        if (isfetchDone) {
            setTimeout(() => {
                const mdMission = JSON.parse(
                    localStorage.getItem('md') || '{}'
                );
                mdMission[missionid] = markdownText;
                localStorage.setItem('md', JSON.stringify(mdMission));
            }, 2000);
            return;
        }

        if (localStorage.getItem('md')) {
            const mdMission = JSON.parse(localStorage.getItem('md') || '{}');
            console.log('mdMission', mdMission);
            if (mdMission[missionid]) {
                setMarkdownText(mdMission[missionid]);
                setFetchDone(true);
                return;
            }
        }
        fetchDataFromBackend()
            .then((result) => {
                setMarkdownText(result);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                setFetchDone(true);
            });
    }, [markdownText, isfetchDone]); // Empty dependency array

    const handleInputChange = (e: any) => {
        setMarkdownText(e.target.value);
    };

    const handleDownload = async () => {
        if (missionid === -1) {
            alert('Please select a mission with the Select button above.');
            return;
        }

        const blob = new Blob([markdownText]);
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'README.md'; // Set the desired filename here
        a.style.display = 'none';
        document.body.appendChild(a);

        a.click();
        window.URL.revokeObjectURL(url);
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
