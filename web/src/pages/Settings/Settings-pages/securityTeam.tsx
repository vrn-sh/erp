import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import {
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from '@mui/material';
import * as AiIcons from 'react-icons/ai';
import config from '../../../config';
import '../Settings.scss';
import Feedbacks from '../../../component/Feedback';
import { getCookiePart } from '../../../crypto-utils';

type TeamType = {
    id: number;
    name: string;
    leader: string;
}[];

type MemberType = {
    member: {
        id: number;
        auth: {
            username: string;
            email: string;
            first_name: string;
            last_name: string;
            last_login: string | null;
            date_joined: string;
            password: string;
            phone_number: string | null;
            role: number;
            favorites: string | null;
            profile_image: string | null;
        };
        creation_date: string;
    }[];
    teamId: number;
}[];

type MemberBoxType = {
    id: number;
    username: string;
    email: string;
}[];

export default function SecurityTeam() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [open, setOpen] = useState(false);
    const [message, setMess] = useState<{ mess: string; color: string }>({
        mess: '',
        color: 'success',
    });
    // Variables de mot de passes
    const [newPwdType, setNewPwdType] = useState('password');
    const [confirmPwdType, setConfirmPwdType] = useState('password');
    const [newPwdIcon, setNewPwdIcon] = useState(
        <AiIcons.AiOutlineEyeInvisible />
    );
    const [confirmPwdIcon, setConfirmPwdIcon] = useState(
        <AiIcons.AiOutlineEyeInvisible />
    );

    const setMessage = (mess: string, color: string) => {
        setMess({ mess, color });
    };

    const role = Number(getCookiePart(Cookies.get('Token')!, 'role'));
    const [userInfos, setUserInfos] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        profile_image: '',
        phone_number: '',
    });
    const [teamList, setTeamList] = useState<TeamType>([]);
    const [members, setMembers] = useState<MemberType>([]);
    const [getMembers, setGetMembers] = useState<MemberBoxType>([]);
    const [MemberSelected, setMemberSelected] = useState(0);
    const [Team, setTeam] = useState(0);

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const pwdChangeApi = async () => {
        await axios
            .patch(
                `${config.apiUrl}/pentester/${MemberSelected}`,
                JSON.stringify({
                    auth: {
                        password: confirmPassword,
                    },
                }),
                {
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: `Token ${getCookiePart(
                            Cookies.get('Token')!,
                            'token'
                        )}`,
                    },
                }
            )
            .then(() => {
                setMessage('Changed password successfully!', 'success');
            })
            .catch((e) => {
                setMessage('The actual password is incorrect.', 'error');
                throw e;
            });
    };

    const getUserInfos = async () => {
        let url = `${config.apiUrl}/`;
        if (getCookiePart(Cookies.get('Token')!, 'role')?.toString() === '3') {
            url += 'freelancer';
        } else if (
            getCookiePart(Cookies.get('Token')!, 'role')?.toString() === '2'
        ) {
            url += 'manager';
        } else {
            url += 'pentester';
        }
        await axios
            .get(`${url}/${getCookiePart(Cookies.get('Token')!, 'id')}`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${getCookiePart(
                        Cookies.get('Token')!,
                        'token'
                    )}`,
                },
            })
            .then((data) => {
                setUserInfos(data.data.auth);
            })
            .catch((e) => {
                throw e;
            });
    };

    const getTeams = async () => {
        await axios
            .get(`${config.apiUrl}/team?page=1`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${getCookiePart(
                        Cookies.get('Token')!,
                        'token'
                    )}`,
                },
            })
            .then((data) => {
                const res = data.data;
                const teams = [];
                const m = [];
                for (let j = 0; j < res.length; j += 1) {
                    teams.push({
                        id: res[j].id,
                        name: res[j].name,
                        leader: res[j].leader.auth.email,
                    });
                    m.push({
                        member: res[j].members,
                        teamId: res[j].id,
                    });
                }
                setTeamList(teams);
                setMembers(m);
            })
            .catch((e) => {
                throw e;
            });
    };

    const submitChangePwd = async () => {
        setOpen(true);
        if (
            !newPassword ||
            !confirmPassword ||
            newPassword !== confirmPassword
        ) {
            setMessage(
                'Please check all the password were filled correctly',
                'error'
            );
        } else if (MemberSelected === 0 || Team === 0) {
            setMessage(
                'Please select a team then select a member correctly',
                'error'
            );
        } else if (newPassword.length < 8 || confirmPassword.length < 8) {
            setMessage('A password should have at least 8 characters', 'error');
        } else pwdChangeApi();
        // Si les mot de passes sont correctes, alors faire la demande d'api pour
        // reset le mot de passe
    };

    useEffect(() => {
        const keyDownHandler = async (event: any) => {
            if (event.key === 'Enter') {
                submitChangePwd();
            }
        };

        document.addEventListener('keydown', keyDownHandler);
        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    }, [MemberSelected, newPassword, confirmPassword]);

    const handleChange = (event: SelectChangeEvent) => {
        setTeam(Number(event.target.value));
        // get the member list according to team selected
        const res = [];
        for (let i = 0; i < members.length; i += 1) {
            if (members[i].teamId === Number(event.target.value)) {
                for (let j = 0; j < members[i].member.length; j += 1) {
                    res.push({
                        id: members[i].member[j].id,
                        username: members[i].member[j].auth.username,
                        email: members[i].member[j].auth.email,
                    });
                }
            }
        }
        setGetMembers(res);
    };

    const MemberSelect = (event: SelectChangeEvent) => {
        setMemberSelected(Number(event.target.value));
    };

    useEffect(() => {
        getUserInfos();
        getTeams();
    }, []);

    useEffect(() => {
        const tmpTeam = teamList;
        const tmpMember = members;
        for (let i = 0; i < tmpTeam.length; i += 1) {
            if (tmpTeam[i]!.leader === userInfos.email) {
                delete tmpTeam[i];
                delete tmpMember[i];
            }
        }
        setTeamList(tmpTeam);
        setMembers(tmpMember);
    }, [userInfos]);

    if (role === 2) {
        return (
            <div>
                {open && (
                    <Feedbacks
                        mess={message.mess}
                        color={message.color}
                        open={open}
                        close={handleClose}
                    />
                )}
                <div style={{ marginTop: '3em' }}>
                    <Stack spacing={5}>
                        <FormControl
                            sx={{
                                paddingY: 2,
                                marginTop: '10px',
                            }}
                            size="small"
                            fullWidth
                        >
                            <InputLabel
                                id="Team"
                                sx={{
                                    fontFamily: 'Poppins-Regular',
                                    fontSize: '14px',
                                }}
                            >
                                Team
                            </InputLabel>
                            <Select
                                labelId="Team"
                                id="select"
                                value={Team.toString()}
                                required
                                label="Team"
                                onChange={handleChange}
                            >
                                {teamList.map((team) => {
                                    return (
                                        <MenuItem
                                            sx={{
                                                fontFamily: 'Poppins-Regular',
                                                fontSize: '14px',
                                            }}
                                            value={team.id}
                                        >
                                            {team.name}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                        <FormControl
                            sx={{
                                margin: 0,
                            }}
                            size="small"
                            fullWidth
                        >
                            <InputLabel
                                id="Members"
                                sx={{
                                    fontFamily: 'Poppins-Regular',
                                    fontSize: '14px',
                                }}
                            >
                                Members
                            </InputLabel>
                            <Select
                                labelId="Members"
                                id="select"
                                value={MemberSelected.toString()}
                                required
                                label="Member"
                                onChange={MemberSelect}
                            >
                                {getMembers.map((member) => {
                                    return (
                                        <MenuItem
                                            sx={{
                                                fontFamily: 'Poppins-Regular',
                                                fontSize: '16px',
                                            }}
                                            value={member.id}
                                        >
                                            {member.username}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>

                        <div className="pwd">
                            <label>New password</label>
                            <input
                                id="input_pwd"
                                type={newPwdType}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <i
                                role="presentation"
                                onClick={() => {
                                    if (newPwdType === 'password') {
                                        setNewPwdType('text');
                                        setNewPwdIcon(<AiIcons.AiOutlineEye />);
                                    } else {
                                        setNewPwdType('password');
                                        setNewPwdIcon(
                                            <AiIcons.AiOutlineEyeInvisible />
                                        );
                                    }
                                }}
                                onKeyDown={() => {}}
                                className="pwdEyeBtn"
                            >
                                {newPwdIcon}
                            </i>
                        </div>

                        <div className="pwd">
                            <label>Confirm the new password</label>
                            <input
                                id="input_pwd"
                                type={confirmPwdType}
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />
                            <i
                                role="presentation"
                                onClick={() => {
                                    if (confirmPwdType === 'password') {
                                        setConfirmPwdType('text');
                                        setConfirmPwdIcon(
                                            <AiIcons.AiOutlineEye />
                                        );
                                    } else {
                                        setConfirmPwdType('password');
                                        setConfirmPwdIcon(
                                            <AiIcons.AiOutlineEyeInvisible />
                                        );
                                    }
                                }}
                                onKeyDown={() => {}}
                                className="pwdEyeBtn"
                            >
                                {confirmPwdIcon}
                            </i>
                        </div>
                    </Stack>
                </div>
                <button
                    type="submit"
                    onClick={submitChangePwd}
                    className="secu-btn"
                    style={{ marginTop: '1.5rem' }}
                >
                    Submit
                </button>
            </div>
        );
    }

    return <h3>Only manager can change someone's password</h3>;
}
