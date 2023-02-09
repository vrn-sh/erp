<<<<<<< HEAD
import "./About.scss";
import strings from "../../../assets/strings/en/about.json";
export default function About() {
  return (
    <div id="about" className="about">
      <div className="about-main-row">
        <div className="about-catch">
          <h1>{strings.catch}</h1>
          <button>{strings.catchCTA}</button>
        </div>
        <div className="about-bullets">
          <p>{strings.catchHighlight}</p>
          <ul>
            {strings.bullets.map((bullet) => (
              <li>{bullet}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="about-more">
        {strings.more.map((item) => (
          <div>
            <h2>{item.title}</h2>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
=======
import "./About.scss"

export default function About() {
    return (
        <div id="about" className="about">
            <h1>About<span>VORON</span></h1>
            <div>
                <p>
                    Voron is a platform that allows service providers 
                    to test deployed defenses and processes to ensure 
                    the sustainability of the system, through the missions 
                    to infiltrate corporate networks which are provided by 
                    Voron.
                </p>
                <p>
                    Voron ensures that the companies who will be tested 
                    had already authorized computer attacks on their 
                    information networks.
                </p>
                <p>
                    Volon will provide a report detailing the findings 
                    and various vulnerabilities, while attesting that 
                    the rules of engagement are being followed.
                </p>
            </div>
        </div>
    )
}
>>>>>>> a86432b2972997a9c86389e10e5dc904724ee361
