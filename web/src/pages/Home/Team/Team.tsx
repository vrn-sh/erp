import "./Team.scss";
import strings from "../../../assets/strings/en/team.json";
import { FunctionComponent, useEffect, useState } from "react";
import { MdOutlineNavigateNext, MdNavigateBefore } from "react-icons/md";
import { AiFillGithub } from 'react-icons/ai'
interface cardProps {
  member: member;
}

interface member {
  name: string;
  avatar: string;
  description: string;
  timezone: string;
  github: string;
}

export default function Team() {
  const [teamMember, setTeamMember] = useState(0);

  const nextMember = () => {
    if (teamMember + 1 > strings.members.length - 1) setTeamMember(0);
    else setTeamMember(teamMember + 1);
  };
  const previousMember = () => {
    if (teamMember - 1 < 0) setTeamMember(strings.members.length - 1);
    else setTeamMember(teamMember - 1);
  };

  return (
    <div id="team" className="team">
      <div className="heading">
        <h1>{strings.sectionTitle}</h1>
        <p>{strings.sectionSubtitle}</p>
      </div>
      <div className="carrousel">
        <button onClick={() => previousMember()}>
          <MdNavigateBefore />
          <p className="caroussel-nav-sub">Previous</p>
        </button>
        <MemberCard member={strings.members[teamMember]} />
        <button onClick={() => nextMember()}>
          <MdOutlineNavigateNext />
          <p className="caroussel-nav-sub">Next</p>
        </button>
      </div>
    </div>
  );
}

const MemberCard: FunctionComponent<cardProps> = ({ member }) => {
  return (
    <div className="carroussel-item">
      <div className="avatar-wrapper">
        <img src={member.avatar !== '#' ?  member.avatar : `/avatarph.png`} alt="avatar"></img>
      </div>
      <h2>{member.name}</h2>
      <p>{member.description}</p>
      <p className="timezone">{member.timezone}</p>
      <div className="socials">
        <a href={member.github}><AiFillGithub/></a>
      </div>
    </div>
  );
};
