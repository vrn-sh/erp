import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SideBar from '../../component/SideBar/SideBar';
import TopBar from '../../component/SideBar/TopBar';
import '../Dashboard/Dashboard.scss';
import './MissionDetail.scss';
import Scope from './Scope';
import Recon from './Recon';
import * as AiIcons from 'react-icons/ai';
import Cookies from 'js-cookie';
import Feedbacks from '../../component/Feedback';
import HunterIo from './HunterIo/HunterIo';

export default function MissionDetail() {
    const [active, setActive] = useState('scope');
    const [id, setId] = useState(0);
    const location = useLocation();
    const [isFavory, setIsFavory] = useState(false);
    const [favList, setFav] = useState<string>();
    const [message, setMess] = useState<{ mess: string; color: string }>({
        mess: '',
        color: 'success',
    });
    const [open, setOpen] = useState(false);


    const handleClick = (event: any) => {
        setActive(event.target.id);
    };

    const addFavory = () => {

        if (favList && !isFavory) {
            let val = favList.split('/');
            val.pop()
            if (val.length < 3) {
                const fav = favList?.concat( `${id}/`);
                Cookies.set('Fav', fav!);
                setIsFavory(true)
                setMess({mess : "Added to Favory", color : 'success'})
                setOpen(true)
            } else {
                // console.log('limite atteinte veuillez supprimer des favoris')
                setMess({mess : "limite atteinte veuillez supprimer des favoris", color : 'error'})
                setOpen(true)
            }
        } else {
            const fav = favList?.concat( `${id}/`);
                Cookies.set('Fav', fav!);
                setIsFavory(true)
                setMess({mess : "Added to Favory", color : 'success'})
                setOpen(true)
        }
    };

    const deleteFavory = () => {
        if (favList && isFavory) {
            let val = favList.split('/');
            val.pop()
            for (let i = 0; i < val.length; i++) {
                if (Number(val[i]) == id) {
                    val.splice(i, 1)
                }
            }
            if (val[0] === '') {
                let cpy : string = val.join('/') + '/'
                Cookies.set('Fav', cpy);
            } else {
                Cookies.set('Fav', "");
            }
            setIsFavory(false)
            // setFav(Cookies.get('Fav'))
            // setMess({mess : "Deleted !", color : 'sucess'})
            // setOpen(true)
        }
    }

    const close = () => {
        setOpen(false);
    };

    const handleFavory = () => {
        if (isFavory) {
            deleteFavory()
        } else {
            addFavory()
        }
    }

    const checkFavory = () => {
        if (favList) {
            let val = favList.split('/');
            val.pop()
            for (let i = 0; i < val.length; i++) {
                console.log(val[i] + id)
                if (Number(val[i]) == id) {
                    setIsFavory(true);
                }
            }
        }
    }

    useEffect(() => {
        setId(location.state.missionId);
        setFav(Cookies.get('Fav'))
    }, []);
    
    useEffect(() => {
        checkFavory();
    }, [id]);

    const getSubMissionDetail = () => {
        if (active === 'scope') {
            return <Scope />;
        }
        if (active === 'recon') {
            return <Recon id={id} />;
        }
        if (active === 'hunter') {
            return <HunterIo />;
        }
        return null;
    };

    return (
        <div className="dashboard">
            <SideBar />
            <div className="dashboard_container">
                <TopBar />
                <div className="mission-detail-container">
                    <h1>Fame mission web 
                        {isFavory ? <AiIcons.AiFillStar
                                            className="scope-action-icons"
                                            style={{ color: 'orange' }}
                                            onClick={(e) => {e.preventDefault(); handleFavory();}}
                                        /> : <AiIcons.AiOutlineStar
                                        className="scope-action-icons"
                                        style={{ color: 'orange' }}
                                        onClick={(e) => {e.preventDefault(); handleFavory();}}
                                    />}</h1>
                    <p>Additional description if required</p>

                    <div className="subHeader">
                        <div className="submenu-mission">
                            {/* <button
                                key={1}
                                id="scope"
                                type="button"
                                className={
                                    active === 'scope' ? 'active' : undefined
                                }
                                onClick={handleClick}
                            >
                                Scope
                            </button> */}
                            <button
                                key={2}
                                id="recon"
                                type="button"
                                className={
                                    active === 'recon' ? 'active' : undefined
                                }
                                onClick={handleClick}
                            >
                                Recon
                            </button>
                            <button
                                key={3}
                                id="hunter"
                                type="button"
                                className={
                                    active === 'hunter' ? 'active' : undefined
                                }
                                onClick={handleClick}
                            >
                                Hunter IO
                            </button>
                        </div>
                    </div>
                    {getSubMissionDetail()}
                </div>
                {open && (
                            <Feedbacks
                                mess={message.mess}
                                color={message.color}
                                close={close}
                                open={open}
                            />
                        )}
            </div>
        </div>
    );
}
