import React from 'react';
import { VideoBookmark } from '../../chrome-api/types';
import VideoBookmarkItem from './popup-parts/videoBookmarkItem';

export type YoutubePageProps = {
  videoBookmarks: VideoBookmark[];
  setVideoBookmarks: React.Dispatch<React.SetStateAction<VideoBookmark[]>>;
  excludeVideoId: string | undefined;
  isVideoListAcive: boolean;
};

const YoutubePage = ({
  videoBookmarks,
  setVideoBookmarks,
  excludeVideoId,
  isVideoListAcive,
}: YoutubePageProps) => {
  return (
    <div className="">
      {videoBookmarks.length > 0 ? (
        videoBookmarks.map(({ id, title, url }) => (
          <VideoBookmarkItem
            key={id}
            videoId={id}
            videoTitle={title}
            videoUrl={url}
            videoBookmarks={videoBookmarks}
            setVideoBookmarks={setVideoBookmarks}
            excludeVideoId={excludeVideoId}
            isVideoListActive={isVideoListAcive}
          />
        ))
      ) : (
        <div className="flex justify-center ">
          <h2 className="text-2xl mt-2 mb-3">No bookmarks to show</h2>
        </div>
      )}
    </div>
  );
};

export default YoutubePage;
