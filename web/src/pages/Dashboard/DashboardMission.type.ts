export interface IDashboardMission {
    id: number;
    name: string;
    type: string;
    percent: number;
    open: string; // Path
    edit: string; // Edit url
}

export const DashboardMissionList: IDashboardMission[] = [
    {
        id: 0,
        name: 'Fame mission web',
        type: 'Web penetration test',
        percent: 50,
        open: '',
        edit: '',
    },
    {
        id: 1,
        name: 'Test mission',
        type: 'Web penetration test',
        percent: 60,
        open: '',
        edit: '',
    },
    {
        id: 2,
        name: 'Test mission',
        type: 'Web penetration test',
        percent: 30,
        open: '',
        edit: '',
    },
    {
        id: 3,
        name: 'Test mission',
        type: 'Web penetration test',
        percent: 0,
        open: '',
        edit: '',
    },
    {
        id: 4,
        name: 'Test mission',
        type: 'Web penetration test',
        percent: 60,
        open: '',
        edit: '',
    },
    {
        id: 5,
        name: 'Test mission 100',
        type: 'Web penetration test',
        percent: 100,
        open: '',
        edit: '',
    },
    {
        id: 6,
        name: 'Test mission',
        type: 'Web penetration test',
        percent: 60,
        open: '',
        edit: '',
    },
];
