import { VideoBookmark } from '../../chrome-api/types';

export const deleteTimestampHandler = (
  t: number,
  videoId: string,
  videoBookmarks: VideoBookmark[]
) => {
  const newVideoBookmarks = videoBookmarks.map((bookmark) => {
    if (bookmark.id === videoId) {
      const newTimestamps = bookmark.timestamps.filter(
        ({ time }) => time !== t
      );
      return { ...bookmark, timestamp: newTimestamps };
    }
    return bookmark;
  });

  console.log(`delete timestamp ${t} from video: ${videoId}`);
  return newVideoBookmarks;
};

export const deleteVideoHandler = (
  videoId: string,
  videoBookmarks: VideoBookmark[]
) => {
  const newVideoBookmarks = videoBookmarks.filter(({ id }) => id !== videoId);
  console.log('delete video', videoId);
  return newVideoBookmarks;
};
