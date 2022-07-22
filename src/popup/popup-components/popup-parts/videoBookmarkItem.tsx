import React from 'react';
import ReactTooltip from 'react-tooltip';

import { VideoBookmark } from '../../../chrome-api/types';
import { getActiveTabURL } from '../../../chrome-api/getActiveTabURL';

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
  excludeVideoId = undefined,
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

  const activeClass =
    'flex flex-row justify-between items-center w-full ' +
    `mt-2 p-1 pl-8 pr-8 font-bold text-xl rounded-3xl hover:cursor-pointer ${isVideoListActive
      ? 'bg-purple-700 text-white hover:bg-purple-800'
      : 'bg-white border-solid border-2 border-purple-900 text-purple-900'
    }`;

  return (
    <div className={activeClass}>
      <a href={videoUrl} target="_blank" className="w-11/12">
        {videoTitle}
      </a>
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
  );
  // return (
  //   <>
  //     {excludeVideoId && excludeVideoId === videoId ? null : (
  //       <div className={activeClass}>
  //       </div>
  //     )}
  //   </>
  // );
};

export default VideoBookmarkItem;
