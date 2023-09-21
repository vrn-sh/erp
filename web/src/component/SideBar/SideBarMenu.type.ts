import { ReactNode } from 'react';

export interface ICardItem {
    item: ISideBarMenu;
}

export interface ISideBarMenu {
    path: string;
    title: string;
    icon: ReactNode;
    subNav: {
        path: string;
        title: string;
        idNav: string;
    }[];
    iconOpened: ReactNode;
    iconClosed: ReactNode;
    isForManager: boolean;
}
