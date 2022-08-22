import React from 'react';
import '@testing-library/jest-dom';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import CurrentVideo, { CurrentVideoProps } from './currentVideo';
import {
  mockVideoBookmarks,
  videoIds,
  videoTitles,
  timeStampsV0,
} from '../../assets/mockData';
import { sendMessage } from '../../chrome-api/sendMessage';
import type * as SendMessage from '../../chrome-api/sendMessage';
import { storeVideoBookmarks } from '../../chrome-api/storage/bookmarks';
import type * as Bookmarks from '../../chrome-api/storage/bookmarks';
import { key_ytbookmark } from '../../assets';
// import { VideoBookmark } from '../../chrome-api/types';

jest.mock('../../chrome-api/sendMessage', () => {
  return {
    __esModule: true,
    ...jest.requireActual<typeof SendMessage>('../../chrome-api/sendMessage'),
    sendMessage: jest.fn(),
  };
});
jest.mock('../../chrome-api/storage/bookmarks', () => {
  return {
    __esModule: true,
    ...jest.requireActual<typeof Bookmarks>(
      '../../chrome-api/storage/bookmarks'
    ),
    storeVideoBookmarks: jest.fn(() => Promise.resolve()),
  };
});

const setup = (props: CurrentVideoProps) => {
  render(<CurrentVideo {...props} />);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockProps = (mockFn: jest.Mock<any, any>) => ({
  tabId: 1,
  isVideoBookmarked: true,
  videoId: mockVideoBookmarks[0].id,
  videoTitle: mockVideoBookmarks[0].title,
  videoUrl: mockVideoBookmarks[0].url,
  excludeVideoId: undefined,
  videoBookmarks: mockVideoBookmarks,
  setVideoBookmarks: mockFn,
});

describe('VideoList', () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it(`display current video title: ${videoTitles[0]}`, () => {
    const mockSetState = jest.fn();
    setup(mockProps(mockSetState));

    const title = screen.getByText(videoTitles[0]);
    expect(title).toBeInTheDocument();
  });

  describe('dsplay timestamps', () => {
    it.each`
      time                    | desc
      ${timeStampsV0[0].time} | ${timeStampsV0[0].desc}
      ${timeStampsV0[1].time} | ${timeStampsV0[1].desc}
      ${timeStampsV0[2].time} | ${timeStampsV0[2].desc}
    `('display, $desc', ({ desc }) => {
      const mockSetState = jest.fn();
      setup(mockProps(mockSetState));

      const text = screen.getByText(desc as string);
      expect(text).toBeInTheDocument();
    });
  });

  const timeStampTime = timeStampsV0[0].time;
  it(`click play at timestamp: ${timeStampTime}, sendMessage called with ${timeStampTime} `, () => {
    const mockSetState = jest.fn();
    setup(mockProps(mockSetState));

    const playIcons = screen.getAllByRole('img', { name: /play/i });
    fireEvent.click(playIcons[0]);

    expect(sendMessage).toHaveBeenCalledWith(1, 'PLAY', timeStampTime);
  });

  const timeStampDesc = timeStampsV0[0].desc;
  // const timeStamp = timeStampsV0[0].time;
  it(`click to delete timestamp: ${timeStampDesc}, setVideoBookmarks called without desc: ${timeStampDesc} `, () => {
    const mockSetState = jest.fn();
    setup(mockProps(mockSetState));

    const deleteIcons = screen.getAllByRole('img', { name: /delete/i });
    fireEvent.click(deleteIcons[0]);

    // const newVideoBookmarks = getVideoBookmarksWithNewTimestamps(
    //   mockProps(mockSetState).videoBookmarks,
    //   mockProps(mockSetState).videoId,
    //   timeStamp
    // );
    // expect.assertions(2);
    // expect(mockSetState).toHaveBeenCalledWith(newVideoBookmarks);
    // expect(storeVideoBookmarks).toHaveBeenCalledWith(
    //   key_ytbookmark,
    //   newVideoBookmarks
    // );

    expect(mockSetState).not.toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ desc: timeStampDesc })])
    );
    expect(storeVideoBookmarks).not.toHaveBeenCalledWith(
      key_ytbookmark,
      expect.arrayContaining([expect.objectContaining({ desc: timeStampDesc })])
    );
  });

  const msgNoTimestamps = 'No timestamp to show';
  it(`when no timestamps, display: "${msgNoTimestamps}"`, () => {
    const mockSetState = jest.fn();
    setup({ ...mockProps(mockSetState), videoId: videoIds[1] });

    const msg = screen.getByText(msgNoTimestamps);
    expect(msg).toBeInTheDocument();
  });

  const msgNotBookmarked = 'Current video is not bookmarked';
  it(`when current video is not bookmarked, display "${msgNotBookmarked}"`, () => {
    const mockSetState = jest.fn();
    setup({ ...mockProps(mockSetState), isVideoBookmarked: false });

    const msg = screen.getByText(msgNotBookmarked);
    expect(msg).toBeInTheDocument();
  });

  const videoId = videoIds[0];
  it(`click to delete icon of the video (id: ${videoId}), then storeVideoBookmarks and setVideoBookmarks called with new videoBookmarks`, () => {
    const mockSetState = jest.fn();
    setup(mockProps(mockSetState));

    const deleteIcons = screen.getAllByRole('img', { name: /delete/i });
    fireEvent.click(deleteIcons[0]);

    const newVideoBookmarks = mockProps(mockSetState).videoBookmarks.filter(
      ({ id }) => id !== videoId
    );

    expect.assertions(2);
    expect(mockSetState).toHaveBeenCalledWith(newVideoBookmarks);
    expect(storeVideoBookmarks).toHaveBeenCalledWith(
      key_ytbookmark,
      newVideoBookmarks
    );
  });
});

// const getVideoBookmarksWithNewTimestamps = (
//   videoBookmarks: VideoBookmark[],
//   videoId: string,
//   t: number
// ) => {
//   return videoBookmarks.map((bookmark) => {
//     if (bookmark.id === videoId) {
//       const newTimestamps = bookmark.timestamps.filter(
//         ({ time }) => time !== t
//       );
//       return { ...bookmark, timestamps: newTimestamps };
//     }
//     return bookmark;
//   });
// };
