import { beforeAll, describe, expect, it, vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import Home from '../pages/Home/Home';

describe('Testing Home page', () => {
    beforeAll(() => {
        vi.mock('react-router-dom', async () => {
            return {
                ...vi.importMock('react-router-dom'),
                useHistory: vi.fn(),
                useParams: vi.fn(),
                useLocation: () => ({
                    search: '',
                    pathname: '/',
                }),
                matchPath: vi.fn(),
                withRouter: vi.fn(),
                useRouteMatch: vi.fn(),
                Link: ({
                    children,
                    to,
                }: {
                    children: JSX.Element;
                    to: string;
                }) => React.createElement('a', { href: to }, children),
                Router: () => vi.fn(),
                HashRouter: () => vi.fn(),
                Switch: () => vi.fn(),
                Routes: () => React.createElement('div'),
                Route: () => React.createElement('div'),
            };
        });
    });
    it('Should contain Voron', async () => {
        const wrapper = render(<Home />);
        expect(wrapper.container.querySelector('a')?.textContent).toBe('voron');
    });
});
