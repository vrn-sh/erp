import React, { useState } from 'react';
import './Tooltip.scss'; // Import your CSS file for styling

function Tooltip({tip}: {tip: React.ReactNode}) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleQuestionMarkClick = () => {
    document.getElementById("tooltip-content")!.style.display = showTooltip ? "none" : "block";
    setShowTooltip(!showTooltip);
  };

  return (
    <div className={`tooltip-container`}>
      <span className="question-mark" onClick={handleQuestionMarkClick}>
        ?
      </span>
        <div className={`tooltip`} id={"tooltip-content"}>
          <div className="tooltip-content">
            {tip}
            <button className="close-button" onClick={handleQuestionMarkClick}>
                Got it!
                </button>
          </div>
        </div>
    </div>
  );
}

export default Tooltip;