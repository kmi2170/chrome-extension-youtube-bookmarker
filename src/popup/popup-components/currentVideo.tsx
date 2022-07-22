import React from 'react';
import { VideoBookmark } from '../../chrome-api/types';
import BookmarkedTimestamps from './popup-parts/bookmarkedTimeStamps';
import BookmarkedVideoItem from './popup-parts/bookmarkedVideoItem';

export type CurrentVideoProps = {
  tabId: number;
  isVideoBookmarked: boolean;
  videoId: string;
  videoTitle: string;
  videoUrl: string;
  videoBookmarks: VideoBookmark[];
  setVideoBookmarks: React.Dispatch<React.SetStateAction<VideoBookmark[]>>;
};

const CurrentVideo = ({
  tabId,
  isVideoBookmarked,
  videoId,
  videoTitle,
  videoUrl,
  videoBookmarks,
  setVideoBookmarks,
}: CurrentVideoProps) => {
  return (
    <>
      <h3 className="font-medium text-xl mb-2">Current Video</h3>
      {isVideoBookmarked ? (
        <div className="w-full flex flex-col justify-center">
          <BookmarkedVideoItem
            tabId={tabId}
            videoId={videoId}
            videoTitle={videoTitle}
            videoUrl={videoUrl}
            videoBookmarks={videoBookmarks}
            setVideoBookmarks={setVideoBookmarks}
            currentVideo
          />
          <BookmarkedTimestamps
            tabId={tabId}
            videoId={videoId}
            videoBookmarks={videoBookmarks}
            setVideoBookmarks={setVideoBookmarks}
          />
        </div>
      ) : (
        <div className="flex justify-center ">
          <h2 className="text-2xl mt-2 mb-3">
            Current video is not bookmarked
          </h2>
        </div>
      )}
    </>
  );
};

export default CurrentVideo;
//<div className="mt-2 p-1 pl-3 pr-3 font-bold text-2xl w-full rounde-md bg-gray-200">
