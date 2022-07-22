import React from 'react';
import { VideoBookmark } from '../../chrome-api/types';
import BookmarkedVideoItem from './popup-parts/bookmarkedVideoItem';

export type BookmarkedVideosListProps = {
  videoBookmarks: VideoBookmark[];
  setVideoBookmarks: React.Dispatch<React.SetStateAction<VideoBookmark[]>>;
  excludeVideoId: string | undefined;
  // isVideoListAcive: boolean;
};

const BookmarkedVideosList = ({
  videoBookmarks,
  setVideoBookmarks,
  excludeVideoId,
}: // isVideoListAcive,
BookmarkedVideosListProps) => {
  return (
    <>
      <h3 className="font-medium text-xl mb-2">Bookmarked Videos</h3>
      {videoBookmarks.length > 0 ? (
        videoBookmarks.map(({ id, title, url }) => (
          <BookmarkedVideoItem
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

export default BookmarkedVideosList;
