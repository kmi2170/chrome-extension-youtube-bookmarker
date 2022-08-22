import React from 'react';
import '@testing-library/jest-dom';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import VideosList, { VideosListProps } from './videosList';
import {
  mockVideoBookmarks,
  videoIds,
  videoTitles,
} from '../../assets/mockData';
import { key_ytbookmark } from '../../assets';
import { storeVideoBookmarks } from '../../chrome-api/storage/bookmarks';
import type * as Bookmarks from '../../chrome-api/storage/bookmarks';

jest.mock('../../chrome-api/storage/bookmarks', () => {
  return {
    __esModule: true,
    ...jest.requireActual<typeof Bookmarks>(
      '../../chrome-api/storage/bookmarks'
    ),
    storeVideoBookmarks: jest.fn(() => Promise.resolve()),
  };
});

const setup = (props: VideosListProps) => {
  render(<VideosList {...props} />);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockProps = (mockFn: jest.Mock<any, any>) => ({
  excludeVideoId: undefined,
  videoBookmarks: mockVideoBookmarks,
  setVideoBookmarks: mockFn,
});

describe('VideoList', () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  describe('Display vidoe title', () => {
    it.each`
      videoTitle
      ${videoTitles[0]}
      ${videoTitles[1]}
      ${videoTitles[2]}
    `('video title:$videoTitle', ({ videoTitle }) => {
      const mockSetState = jest.fn();
      setup(mockProps(mockSetState));

      const title = screen.getByText(videoTitle as string);
      expect(title).toBeInTheDocument();
    });
  });

  describe('delete video from bookmark', () => {
    let index = 0;
    it.each`
      videoId
      ${videoIds[0]}
      ${videoIds[1]}
      ${videoIds[2]}
    `(
      'click icon to delete video $videoId, then storeVideoBookmarks and setVideoBookmarks called with new videobookmarks',
      ({ videoId }) => {
        const mockSetState = jest.fn();
        setup(mockProps(mockSetState));

        const deleteIcon = screen.getAllByRole('img', { name: /delete/i })[
          index
        ];
        fireEvent.click(deleteIcon);

        const newVideoBookmarks = mockProps(mockSetState).videoBookmarks.filter(
          ({ id }) => id !== videoId
        );
        expect.assertions(2);
        expect(storeVideoBookmarks).toHaveBeenCalledWith(
          key_ytbookmark,
          newVideoBookmarks
        );
        expect(mockSetState).toHaveBeenCalledWith(newVideoBookmarks);

        index++;
      }
    );
  });

  const message = 'No bookmarks to show';
  describe('video bookmark is empty', () => {
    it(`display "${message}"`, () => {
      const mockSetState = jest.fn();
      setup({ ...mockProps(mockSetState), videoBookmarks: [] });

      const msg = screen.getByText(message);
      expect(msg).toBeInTheDocument();
    });
  });
});
