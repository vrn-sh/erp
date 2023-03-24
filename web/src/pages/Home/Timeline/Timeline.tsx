import React from 'react';
import './Timeline.scss';
import {
    VerticalTimeline,
    VerticalTimelineElement,
} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import * as TbIcon from 'react-icons/tb';
import timeline from '../../../assets/strings/en/timeline.json';

export default function Timeline() {
    const workIconStyles = { background: '#F5E6FD' };
    const notIconStyles = { background: '#ECF8FD' };

    const getIcon = (icon: string) => {
        if (icon === 'work') return <TbIcon.TbCircleDot />;
        if (icon === 'finished') return <TbIcon.TbCircleCheck />;
        return <TbIcon.TbCircleDashed />;
    };

    const getIconStyle = (icon: string) => {
        if (icon === 'work') return workIconStyles;
        return notIconStyles;
    };
    return (
        <div id="timeline" className="timeline">
            <h1 className="title">Timeline</h1>
            <VerticalTimeline className="timeline_container">
                {timeline.timelineElements.map((element) => {
                    return (
                        <VerticalTimelineElement
                            key={element.id}
                            date={element.date}
                            dateClassName="date"
                            iconStyle={getIconStyle(element.icon)}
                            icon={getIcon(element.icon)}
                            className="try"
                        >
                            <h3 className="vertical-timeline-element-title timeline-title">
                                {element.title}
                            </h3>
                            <p className="timeline-description">
                                {element.description}
                            </p>
                        </VerticalTimelineElement>
                    );
                })}
            </VerticalTimeline>
        </div>
    );
}
