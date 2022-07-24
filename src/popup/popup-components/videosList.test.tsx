import React from 'react';
import '@testing-library/jest-dom';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import VideosList, { VideosListProps } from './videosList';
import { mockVideoBookmarks } from '../../assets/mockData';

jest.mock('../../chrome-api/sendMessage');

const setup = (props: VideosListProps) => {
  render(<VideosList {...props} />);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockProps = (mockFn: jest.Mock<any, any>) => ({
  tabId: 1,
  excludeVideoId: undefined,
  videoBookmarks: mockVideoBookmarks,
  setVideoBookmarks: mockFn,
});

const videoIds = [
  mockVideoBookmarks[0].id,
  mockVideoBookmarks[1].id,
  mockVideoBookmarks[2].id,
];

const videoTitles = [
  mockVideoBookmarks[0].title,
  mockVideoBookmarks[1].title,
  mockVideoBookmarks[2].title,
];

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
      'click icon to delete video $videoId, then setVideoBookmarks called without $videoId',
      ({ videoId }) => {
        const mockSetState = jest.fn();
        setup(mockProps(mockSetState));

        const deleteIcon = screen.getAllByRole('img', { name: /delete/i })[
          index
        ];
        index++;
        fireEvent.click(deleteIcon);

        expect(mockSetState).toHaveBeenCalledTimes(1);
        expect(mockSetState).not.toHaveBeenCalledWith(
          expect.arrayContaining([
            expect.objectContaining({
              id: videoId as string,
            }),
          ])
        );
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
