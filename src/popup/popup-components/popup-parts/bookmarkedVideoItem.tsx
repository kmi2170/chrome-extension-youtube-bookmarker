import React from 'react';
import ReactTooltip from 'react-tooltip';

import { VideoBookmark } from '../../../chrome-api/types';
import { getActiveTabURL } from '../../../chrome-api/getActiveTabURL';

type BookmarkedVideoItemProps = {
  currentVideo?: boolean;
  excludeVideoId?: string;
  videoId: string;
  videoUrl: string;
  videoTitle: string;
  videoBookmarks: VideoBookmark[];
  setVideoBookmarks: React.Dispatch<React.SetStateAction<VideoBookmark[]>>;
};

const BookmarkedVideoItem = ({
  currentVideo,
  excludeVideoId = undefined,
  videoId,
  videoUrl,
  videoTitle,
  videoBookmarks,
  setVideoBookmarks,
}: BookmarkedVideoItemProps) => {
  const handleDelete = async (vId: string) => {
    const activeTab = await getActiveTabURL();

    console.log('delete', vId, activeTab.id);
    const newVideoBookmarks = videoBookmarks.filter(({ id }) => id !== vId);
    setVideoBookmarks(newVideoBookmarks);

    chrome.tabs.sendMessage(activeTab.id as number, {
      type: 'DELETE_VIDEO',
      value: vId,
    });
  };

  const baseClass =
    'flex flex-row justify-between items-center w-full ' +
    'mt-2 mb-2 p-1 pl-8 pr-8 font-bold text-xl rounded-3xl ';
  const activeClass = baseClass + 'bg-purple-900 text-white';
  const inActiveClass =
    baseClass +
    'bg-white border-solid border-2 border-purple-900 text-purple-900 hover:bg-purple-700 hover:text-white hover:cursor-pointer';

  return (
    <>
      {excludeVideoId && excludeVideoId === videoId ? null : (
        <div className={currentVideo ? activeClass : inActiveClass}>
          {currentVideo ? (
            <div className="w-11/12">{videoTitle}</div>
          ) : (
            <a
              href={videoUrl}
              target="_blank"
              className="w-11/12"
              data-tip="Open"
              data-for={`open-video-${videoId}`}
            >
              {videoTitle}
            </a>
          )}
          <ReactTooltip
            id={`open-video-${videoId}`}
            place="top"
            type="dark"
            effect="float"
            disable={currentVideo}
          />
          <a
            data-tip="Delete"
            data-for={`delete-video-${videoId}`}
            className="ml-4"
          >
            <img
              src="assets/icon-delete.png"
              alt="delete"
              width="20px"
              height="20px"
              className="hover:cursor-pointer"
              onClick={() => handleDelete(videoId)}
            />
          </a>
          <ReactTooltip
            id={`delete-video-${videoId}`}
            place="top"
            type="dark"
            effect="float"
          />
        </div>
      )}
    </>
  );
};

export default BookmarkedVideoItem;
