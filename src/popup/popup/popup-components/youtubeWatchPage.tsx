import React from 'react';
import { VideoBookmark } from '../../../chrome-api/types';
import TimeStamps from './popup-parts/timeStamps';
import VideoBookmarkItem from './popup-parts/videoBookmarkItem';

export type YoutubeWatchPageProps = {
  tabId: number;
  isVideoBookmarked: boolean;
  videoId: string;
  videoTitle: string;
  videoUrl: string;
  videoBookmarks: VideoBookmark[];
  setVideoBookmarks: React.Dispatch<React.SetStateAction<VideoBookmark[]>>;
};

const YoutubeWatchPage = ({
  tabId,
  isVideoBookmarked,
  videoId,
  videoTitle,
  videoUrl,
  videoBookmarks,
  setVideoBookmarks,
}: YoutubeWatchPageProps) => {
  return (
    <div className="mt-2 p-1 pl-3 pr-3 font-bold text-2xl  rounde-md">
      {isVideoBookmarked ? (
        <>
          <VideoBookmarkItem
            videoId={videoId as string}
            videoTitle={videoTitle}
            videoUrl={videoUrl}
            videoBookmarks={videoBookmarks}
            setVideoBookmarks={setVideoBookmarks}
            isVideoListActive
          />
          <TimeStamps
            tabId={tabId}
            videoId={videoId}
            videoBookmarks={videoBookmarks}
            setVideoBookmarks={setVideoBookmarks}
          />
        </>
      ) : (
        <div className="flex justify-center ">
          <h2 className="text-2xl mt-2 mb-3">Current Page is not Bookmarked</h2>
        </div>
      )}
    </div>
  );
};

export default YoutubeWatchPage;
