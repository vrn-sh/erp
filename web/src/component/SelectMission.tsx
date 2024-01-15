import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import config from '../config';
import { getCookiePart } from '../crypto-utils';

export default function SelectMission({
    setMissionId,
    missionId,
}: {
    setMissionId: (id: number) => void;
    missionId: number;
}) {
    const handleMissionSelect = (event: SelectChangeEvent) => {
        setMissionId(parseInt(event.target.value, 10));
    };

    const [list, setList] = useState<
        {
            value: number;
            label: string;
        }[]
    >([]);

    const getMission = async () => {
        await axios
            .get(`${config.apiUrl}/mission?page=1`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${getCookiePart(
                        Cookies.get('Token')!,
                        'token'
                    )}`,
                },
            })
            .then((data) => {
                const tab = [];
                for (let i = 0; i < data.data.results.length; i += 1) {
                    const res = data.data.results[i];
                    tab.push({
                        value: res.id,
                        label: res.title,
                        key: res.id,
                    });
                }
                tab.reverse();
                setList(tab);
            })
            .catch((e) => {
                throw e.message;
            });
    };
    useEffect(() => {
        getMission();
    }, []);

    return (
        <FormControl
            variant="standard"
            sx={{
                m: 1,
                minWidth: 121,
                fontSize: '12px',
                margin: '0 2em',
            }}
        >
            <InputLabel id="demo-simple-select-standard-label">
                Select a mission
            </InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={JSON.stringify(missionId)}
                label="mission"
                onChange={handleMissionSelect}
            >
                {list.map((elem) => {
                    return (
                        <MenuItem value={elem.value} key={elem.value}>
                            {elem.label}
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
}
