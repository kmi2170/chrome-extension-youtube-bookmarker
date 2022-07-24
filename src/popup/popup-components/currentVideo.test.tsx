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

// jest.mock('../../chrome-api/sendMessage');
jest.mock('../../chrome-api/sendMessage', () => {
  return {
    __esModule: true,
    ...jest.requireActual('../../chrome-api/sendMessage'),
    sendMessage: jest.fn(),
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

    const title = screen.getByText(videoTitles[0] as string);
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

      const text = screen.getByText(desc);

      expect(text).toBeInTheDocument();
    });
  });

  const timeStampTime = timeStampsV0[0].time;
  it(`click play at timestamp: ${timeStampTime}, sendMessage called with ${timeStampTime} `, () => {
    const mockSetState = jest.fn();
    setup(mockProps(mockSetState));

    const playIcons = screen.getAllByRole('img', { name: /play/i });
    fireEvent.click(playIcons[0]);

    expect(sendMessage).toHaveBeenCalledWith(
      1,
      'PLAY',
      timeStampTime as number
    );
    // expect(sendMessage).toHaveBeenCalledWith(
    //   expect.arrayContaining([
    //     expect.objectContaining({
    //       t: timeStampTime as number,
    //     }),
    //   ])
    // );
  });

  const timeStampDesc = timeStampsV0[0].desc;
  it(`click to delete timestamp: ${timeStampDesc}, setVideoBookmarks called without desc: ${timeStampDesc} `, () => {
    const mockSetState = jest.fn();
    setup(mockProps(mockSetState));

    const deleteIcons = screen.getAllByRole('img', { name: /delete/i });
    fireEvent.click(deleteIcons[0]);

    expect(mockSetState).not.toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          desc: timeStampDesc as string,
        }),
      ])
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
  it(`click to delete icon, setVideoBookmarks called with videoId: ${videoId} `, () => {
    const mockSetState = jest.fn();
    setup(mockProps(mockSetState));

    const deleteIcons = screen.getAllByRole('img', { name: /delete/i });
    fireEvent.click(deleteIcons[0]);

    expect(mockSetState).not.toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: videoId as string,
        }),
      ])
    );
  });
});
