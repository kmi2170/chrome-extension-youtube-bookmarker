import ReactTooltip from 'react-tooltip';
import React from 'react';

import { VideoBookmark } from '../../../chrome-api/types';

type BookmarkedTimestampsProps = {
  tabId: number | null;
  videoBookmarks: VideoBookmark[];
  videoId: string | null;
  setVideoBookmarks: React.Dispatch<React.SetStateAction<VideoBookmark[]>>;
};

const BookmarkedTimestamps = ({
  tabId,
  videoBookmarks,
  videoId,
  setVideoBookmarks,
}: BookmarkedTimestampsProps) => {
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
    <>
      {timeStamps?.length > 0 ? (
        <div className="mt-2 mb-4 flex flex-col justify-center">
          {timeStamps.map(({ time, desc }) => {
            return (
              <div
                key={desc}
                className="ml-8 mr-8 mb-1 flex justify-between items-center  rounded-full border-2 border-pink-300 hover:bg-pink-200"
              >
                <a data-tip="Play" data-for={`play-${desc}`} className="ml-6">
                  <img
                    src="assets/icon-play.png"
                    alt="play"
                    width="30px"
                    height="30px"
                    className="hover:cursor-pointer"
                    onClick={() => handlePlay(time)}
                  />
                </a>
                <ReactTooltip
                  id={`play-${desc}`}
                  place="top"
                  type="dark"
                  effect="float"
                />

                <div className="pt-1 font-bold text-xl ">{desc}</div>

                <a
                  data-tip="Delete"
                  data-for={`delete-${desc}`}
                  className="mr-6"
                >
                  <img
                    src="assets/icon-delete.png"
                    alt="delete"
                    width="20px"
                    height="20px"
                    className="hover:cursor-pointer"
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
          })}
        </div>
      ) : (
        <div className="flex justify-center ">
          <h2 className="text-2xl mt-2">No Timestamp to Show</h2>
        </div>
      )}
    </>
  );
};

export default BookmarkedTimestamps;