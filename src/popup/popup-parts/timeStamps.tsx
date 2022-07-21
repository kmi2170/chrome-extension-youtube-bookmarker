import ReactTooltip from 'react-tooltip';
import React from 'react';

import { VideoBookmark } from '../../chrome-api/types';

type TimeStampsProps = {
  tabId: number | null;
  videoBookmarks: VideoBookmark[];
  videoId: string | null;
  setVideoBookmarks: React.Dispatch<React.SetStateAction<VideoBookmark[]>>;
};

const TimeStamps = ({
  tabId,
  videoBookmarks,
  videoId,
  setVideoBookmarks,
}: TimeStampsProps) => {
  const videoBookmark = videoBookmarks.filter((bookmark) => {
    if (bookmark.id === videoId) {
      return bookmark;
    }
  });

  const timeStamps = videoBookmark[0]?.timestamp;

  const handlePlay = (t: number) => {
    chrome.tabs.sendMessage(tabId as number, {
      type: 'PLAY',
      value: t,
    });
  };

  const handleDelete = (t: number) => {
    const newVideoBookmarks = videoBookmarks.map((bookmark) => {
      if (bookmark.id === videoId) {
        const newTimestamp = bookmark.timestamp.filter(
          ({ time }) => time !== t
        );
        return { ...bookmark, timestamp: newTimestamp };
      }
      return bookmark;
    });

    chrome.tabs.sendMessage(tabId as number, {
      type: 'DELETE_TIMESTAMP',
      value: t,
    });

    setVideoBookmarks(newVideoBookmarks);
  };

  return (
    <div className="mt-2 mb-4 flex flex-col ">
      {timeStamps?.length > 0 ? (
        timeStamps.map(({ time, desc }) => {
          return (
            <div
              key={desc}
              className="flex justify-center items-center bg-pink-50 rounded-full"
            >
              <a data-tip="Play" data-for={`play-${desc}`}>
                <img
                  src="assets/icon-play.png"
                  alt="play"
                  width="30px"
                  height="30px"
                  className="mr-2 hover:cursor-pointer"
                  onClick={() => handlePlay(time)}
                />
              </a>
              <ReactTooltip
                id={`play-${desc}`}
                place="top"
                type="dark"
                effect="float"
              />

              <div className="pt-1 text-2xl">{desc}</div>

              <a data-tip="Delete" data-for={`delete-${desc}`}>
                <img
                  src="assets/icon-delete.png"
                  alt="delete"
                  width="20px"
                  height="20px"
                  className="ml-2 hover:cursor-pointer"
                  onClick={() => handleDelete(time)}
                />
              </a>
              <ReactTooltip
                id={`delete-${desc}`}
                place="top"
                type="dark"
                effect="float"
              />
            </div>
          );
        })
      ) : (
        <div className="flex justify-center ">
          <h2 className="text-2xl mt-2">No Timestamp to Show</h2>
        </div>
      )}
    </div>
  );
};

export default TimeStamps;
