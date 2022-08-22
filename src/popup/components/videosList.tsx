import React from 'react';
import { VideoBookmark } from '../../chrome-api/types';
import VideoItem from './parts/videoItem';

export type VideosListProps = {
  videoBookmarks: VideoBookmark[];
  setVideoBookmarks: React.Dispatch<React.SetStateAction<VideoBookmark[]>>;
  excludeVideoId: string | undefined;
};

const VideosList = ({
  videoBookmarks,
  setVideoBookmarks,
  excludeVideoId,
}: VideosListProps) => {
  return (
    <>
      <h3 className="font-medium text-xl mb-2">
        {videoBookmarks.length > 0 && (
          <span>
            {excludeVideoId ? videoBookmarks.length - 1 : videoBookmarks.length}{' '}
            Bookmarked Videos
          </span>
        )}
      </h3>

      {videoBookmarks.length > 0 ? (
        videoBookmarks.map(({ id, title, url }) => (
          <VideoItem
            key={id}
            videoId={id}
            videoTitle={title}
            videoUrl={url}
            videoBookmarks={videoBookmarks}
            setVideoBookmarks={setVideoBookmarks}
            excludeVideoId={excludeVideoId}
          />
        ))
      ) : (
        <div className="flex justify-center ">
          <h2 className="text-2xl mt-2 mb-3">No bookmarks to show</h2>
        </div>
      )}
    </>
  );
};

export default VideosList;
