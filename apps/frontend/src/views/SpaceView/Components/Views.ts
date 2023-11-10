import { useMemo } from 'react';

export const SpaceViews = ({ spaceKey }) =>
  useMemo(
    () => [
      {
        label: 'Proposals',
        link: ``,
        value: '0',
        end: true,
      },
      {
        label: 'New proposal',
        link: `create`,
        value: '1',
        end: false,
      },
      {
        label: 'About',
        link: `about`,
        value: '2',
        end: true,
      },
      {
        label: 'Treasury',
        link: `treasury`,
        value: '3',
        end: false,
      },
      {
        label: 'Settings',
        link: `settings`,
        value: '4',
        end: true,
      },
      {
        label: 'Forum',
        link: `forum`,
        value: '5',
        end: true,
      },
    ],
    [spaceKey],
  );

export const ForumViews = ({ spaceKey }) =>
  useMemo(
    () => [
      {
        label: 'New post',
        link: `forum/create`,
        value: '6',
        end: false,
      },
      {
        label: 'Feed',
        link: `forum`,
        value: '7',
        end: true,
      },
      {
        label: 'About',
        link: `forum/about`,
        value: '8',
        end: false,
      },
      {
        label: `Home`,
        link: ``,
        value: '9',
        end: true,
      },
    ],
    [spaceKey],
  );

export const SpaceViewTypes = ['', 'create', 'about', 'treasury', 'settings', 'forum'];
export const ForumViewTypes = ['forum/posts', 'forum/create', 'forum/about'];