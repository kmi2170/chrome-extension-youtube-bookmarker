import ReactTooltip from 'react-tooltip';
import React from 'react';

import { VideoBookmark } from '../../../../chrome-api/types';
import { getActiveTabURL } from '../../../../chrome-api/getActiveTabURL';

type VideoBookmarkItemProps = {
  isVideoListActive: boolean;
  excludeVideoId?: string;
  videoId: string;
  videoUrl: string;
  videoTitle: string;
  videoBookmarks: VideoBookmark[];
  setVideoBookmarks: React.Dispatch<React.SetStateAction<VideoBookmark[]>>;
};

const VideoBookmarkItem = ({
  isVideoListActive,
  videoId,
  videoUrl,
  videoTitle,
  videoBookmarks,
  excludeVideoId = undefined,
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

  const activeClass = `mt-2 p-1 pl-8 pr-8 font-bold text-2xl rounded-full hover:cursor-pointer hover:drop-shadow-lg ${
    isVideoListActive
      ? 'bg-purple-900 text-white'
      : 'bg-white border-solid border-2 border-purple-900 text-purple-900'
  }`;

  return (
    <>
      {excludeVideoId && excludeVideoId === videoId ? null : (
        <h2 key={videoId} className={activeClass}>
          <div className="flex flex-row justify-between items-center">
            <a href={videoUrl} target="_blank">
              {videoTitle}
            </a>
            <a data-tip="Delete" data-for={`delete-video-${videoId}`}>
              <img
                src="assets/icon-delete.png"
                alt="delete"
                width="30px"
                height="30px"
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
      )}
    </>
  );
};

export default VideoBookmarkItem;
