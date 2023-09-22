import React from 'react';
import './MarkdownHelper.scss';

export default function MarkdownHelper() {
    return (
        <div className="markdown-helper">
            <ul>
                <li>
                    <h1># Header 1</h1>

                    <p className="help-text">This will generate a h1 tag</p>
                </li>
            </ul>
            <ul>
                <li>
                    <h2>## Header 2</h2>

                    <p className="help-text">This will generate a h2 tag</p>
                </li>
            </ul>
            <ul>
                <li>
                    <h6>### Header 6</h6>

                    <p className="help-text">This will generate a h6 tag</p>
                </li>
            </ul>
            <ul>
                <li>
                    <p className="bold">**bold**</p>
                    <p className="help-text">
                        This makes the content between the ** bold
                    </p>
                </li>
            </ul>
            <ul>
                <li>
                    <p className="italic">*italic*</p>
                    <p className="help-text">
                        This makes the content between the * italic
                    </p>
                </li>
            </ul>
            <ul>
                <li className="puce">
                    <p>something</p>
                    <p className="help-text">
                        Putting one * in front of a line makes a list
                    </p>
                </li>
            </ul>
            <ul>
                <li>
                    <p>_ _ _</p>
                    <p className="help-text">
                        This one is to generate a whole new page
                    </p>
                </li>
            </ul>
        </div>
    );
}
