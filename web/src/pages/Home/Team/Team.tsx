import "./Team.scss";
import strings from "../../../assets/strings/en/team.json";
import { FunctionComponent, useEffect, useState } from "react";
import { MdOutlineNavigateNext, MdNavigateBefore } from "react-icons/md";
import { AiFillGithub } from 'react-icons/ai'
import { CSSTransition } from "react-transition-group";
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
  const [teamMemberIndex, setTeamMemberIndex] = useState(0);
  const [teamMemberComponents, setTeamMemberComponents] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [animate, setAnimate] = useState(false);

  const nextMember = () => {
    if (teamMemberIndex + 1 > strings.members.length - 1) setTeamMemberIndex(0);
    else setTeamMemberIndex(teamMemberIndex + 1);
    setAnimate(true);
    setTimeout(() => {
      setAnimate(false);
    }, 300)
  };
  const previousMember = () => {
    if (teamMemberIndex - 1 < 0) setTeamMemberIndex(strings.members.length - 1);
    else setTeamMemberIndex(teamMemberIndex - 1);
    setAnimate(true);
    setTimeout(() => {
      setAnimate(false);
    }, 300)
  };

  useEffect(() => {
    strings.members.forEach((member, idx) => {
      const newComp = <MemberCard member={member} key={idx}/>
      setTeamMemberComponents((state: any) => [...state, newComp])
    })
    setIsLoading(false);
  }, [teamMemberIndex])

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
        <CSSTransition
          timeout={600}
          in={animate}
          classNames="fade"
        >
        {!isLoading ? teamMemberComponents[teamMemberIndex] : <p>Loading our awesome members...</p>}
        </CSSTransition>
        <button onClick={() => nextMember()}>
          <MdOutlineNavigateNext />
          <p className="caroussel-nav-sub">Next</p>
        </button>
      </div>
    </div>
  );
}

const MemberCard: React.FC<cardProps> = ({ member }) => {
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
