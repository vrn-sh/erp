import "./MarkdownHelper.scss";

export function MarkdownHelper() {
    return (
        <div className="markdown-helper">
            <ul>
                <li>
                    <h1># Header 1</h1>
                </li>
                <li>
                    <p className="help-text">This will generate a h1 tag</p>
                </li>
            </ul>
            <ul>
                <li>
                    <h2>## Header 2</h2>
                </li>
                <li>
                    <p className="help-text">This will generate a h2 tag</p>
                </li>
            </ul>
            <ul>
                <li>
                    <h6>### Header 6</h6>
                </li>
                <li>
                    <p className="help-text">This will generate a h6 tag</p>
                </li>
            </ul>
            <ul>
                <li>
                    <p className="bold">**bold**</p>
                </li>
                <li>
                    <p className="help-text">This makes the content between the ** bold</p>
                </li>
            </ul>
            <ul>
                <li>
                    <p className="italic">*italic*</p>
                </li>
                <li>
                    <p className="help-text">This makes the content between the * italic</p>
                </li>
            </ul>
            <ul>
                <li>
                    _ _ _
                </li>
                <li>
                    <p className="help-text">This one is to generate a whole new page</p>
                </li>
            </ul>
        </div>
    );
}