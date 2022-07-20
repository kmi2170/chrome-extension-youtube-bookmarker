import ReactTooltip from 'react-tooltip';
import React from 'react';

import { VideoBookmark } from '../../chrome-api/types';

type TimeStampsProps = {
  videoBookmarks: VideoBookmark[];
  videoId: string | null;
};

const TimeStamps = ({ videoBookmarks, videoId }: TimeStampsProps) => {
  const videoBookmark = videoBookmarks.filter((bookmark) => {
    if (bookmark.id === videoId) {
      return bookmark;
    }
  });

  const timeStamps = videoBookmark[0]?.timestamp;

  return (
    <div className="mt-2">
      {timeStamps?.length > 0 ? (
        timeStamps.map(({ time, desc }) => {
          return (
            <h3 key={time} className="flex justify-center items-center">
              <a data-tip="Play" data-for="play">
                <img
                  src="assets/icon-play.png"
                  alt="play"
                  width="30px"
                  height="30px"
                  className="mr-2 hover:cursor-pointer"
                  // onClick={() => handlePlay(time)}
                />
              </a>
              <ReactTooltip id="play" place="top" type="dark" effect="float" />

              <div className="text-2xl">{desc}</div>

              <a data-tip="Delete" data-for="delete">
                <img
                  src="assets/icon-delete.png"
                  alt="delete"
                  width="20px"
                  height="20px"
                  className="ml-2 hover:cursor-pointer"
                  // onClick={() => handleDelete(time)}
                />
              </a>
              <ReactTooltip
                id="delete"
                place="top"
                type="dark"
                effect="float"
              />
            </h3>
          );
        })
      ) : (
        <h2 className="text-2xl">No Bookmarks to Show</h2>
      )}
    </div>
  );
};

export default TimeStamps;
