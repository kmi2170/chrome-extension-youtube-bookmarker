import ReactTooltip from 'react-tooltip';
import React from 'react';

import { VideoBookmark } from '../../chrome-api/types';
import { getActiveTabURL } from '../../chrome-api/getActiveTabURL';

type VideoBookmarkItemProps = {
  tabId: number | null;
  videoId: string;
  videoUrl: string;
  videoTitle: string;
  videoBookmarks: VideoBookmark[];
  setVideoBookmarks: React.Dispatch<React.SetStateAction<VideoBookmark[]>>;
};

const VideoBookmarkItem = ({
  tabId,
  videoId,
  videoUrl,
  videoTitle,
  videoBookmarks,
  setVideoBookmarks,
}: VideoBookmarkItemProps) => {
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

  return (
    <h2
      key={videoId}
      className="mt-2 p-1 pl-8 pr-8 font-bold text-2xl text-white  bg-purple-900 rounded-full hover:cursor-pointer hover:drop-shadow-2xl"
    >
      <div className="flex flex-row justify-between items-center">
        <a href={videoUrl} target="_blank">
          {videoTitle}
        </a>
        <a data-tip="Delete" data-for={`delete-video-${videoId}`}>
          <img
            src="assets/icon-delete.png"
            alt="delete"
            width="20px"
            height="20px"
            className="ml-2 hover:cursor-pointer"
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
    </h2>
  );
};

export default VideoBookmarkItem;
