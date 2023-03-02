export interface IDashboardMission {
    id: number;
    name: string;
    type: string;
    open: string; // Path
    edit: string; // Edit url
}

export const DashboardMissionList: IDashboardMission[] = [
    {
        id: 0,
        name: 'Fame mission web',
        type: 'Web penetration test',
        open: '',
        edit: '',
    },
    {
        id: 1,
        name: 'Test mission',
        type: 'Web penetration test',
        open: '',
        edit: '',
    },
];
