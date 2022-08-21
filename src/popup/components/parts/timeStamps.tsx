import ReactTooltip from 'react-tooltip';
import React from 'react';

import { VideoBookmark } from '../../../chrome-api/types';
import { sendMessage } from '../../../chrome-api/sendMessage';
import { storeVideoBookmarks } from '../../../chrome-api/storage/bookmarks';

const key_ytbookmark = 'yt-bookmarks';

type TimestampsProps = {
  tabId: number | null;
  videoBookmarks: VideoBookmark[];
  videoId: string | null;
  setVideoBookmarks: React.Dispatch<React.SetStateAction<VideoBookmark[]>>;
};

const Timestamps = ({
  tabId,
  videoBookmarks,
  videoId,
  setVideoBookmarks,
}: TimestampsProps) => {
  const videoBookmark = videoBookmarks.filter(
    (bookmark) => bookmark.id === videoId
  );

  const timeStamps = videoBookmark[0]?.timestamps;

  const handlePlay = (t: number) => {
    sendMessage(tabId as number, 'PLAY', t);
  };

  const handleDelete = (t: number) => {
    const newVideoBookmarks = videoBookmarks.map((bookmark) => {
      if (bookmark.id === videoId) {
        const newTimestamps = bookmark.timestamps.filter(
          ({ time }) => time !== t
        );
        return { ...bookmark, timestamps: newTimestamps };
      }
      return bookmark;
    });

    // sendMessage(tabId as number, 'DELETE_TIMESTAMP', t);
    storeVideoBookmarks(key_ytbookmark, newVideoBookmarks).catch((error) =>
      console.error(error)
    );

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
          <h2 className="text-2xl mt-2">No timestamp to show</h2>
        </div>
      )}
    </>
  );
};

export default Timestamps;
