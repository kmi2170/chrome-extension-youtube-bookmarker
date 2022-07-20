import React from 'react';
import ReactTooltip from 'react-tooltip';

import useChromeApi from '../chrome-api/hook';
import { VideoBookmark } from '../chrome-api/types';
import './popup.css';

const Popup = () => {
  const {
    activeTabId,
    currentVideoId,
    currentVideoTitle,
    currentVideoBookmarks,
    isYoutubePage,
    isYoutubeWatchPage,
    setCurrentVideoBookmarks,
  } = useChromeApi();

  const handlePlay = (t: number) => {
    chrome.tabs.sendMessage(activeTabId as number, {
      type: 'PLAY',
      value: t,
    });
  };

  const handleDelete = (t: number) => {
    const newVideoBookmarks = currentVideoBookmarks.filter(
      ({ time }) => time !== t
    );
    setCurrentVideoBookmarks(newVideoBookmarks);
    chrome.tabs.sendMessage(activeTabId as number, {
      type: 'DELETE',
      value: t,
    });
  };

  if (!isYoutubePage) {
    return (
      <div className="flex justify-center m-8">
        <p className="text-2xl text-red-600 ">This is not a Youtube page.</p>
      </div>
    );
  }
  console.log(isYoutubeWatchPage);
  console.log(currentVideoBookmarks);

  return (
    <div className="flex flex-col justify-center m-8">
      <h1 className="text-3xl font-bold text-violet-900 mb-4">
        Youtube Timestamp Bookmarker
      </h1>

      {isYoutubeWatchPage ? (
        <h2 className="mt-2 p-1 pl-3 pr-3 font-bold text-2xl bg-sky-100 rounde-md">
          {currentVideoTitle}
        </h2>
      ) : (
        <div>
          {currentVideoBookmarks.map(({ id, title, url }) => (
            <a href={url} target="_blank">
              <h2
                key={id}
                className="mt-2 p-1 pl-8 pr-8 font-bold text-2xl bg-sky-100 rounded-full"
              >
                {title}
              </h2>
            </a>
          ))}
        </div>
      )}
    </div>
  );

  // return (
  //   <div className="flex flex-col justify-center m-8">
  //     <h1 className="text-3xl text-green-500">Youtube Timestamp Bookmarker</h1>
  //     <h2 className="mt-2 p-1 pl-3 pr-3 font-bold text-2xl bg-sky-100 rounde-md">
  //       {currentVideoTitle}
  //     </h2>

  //     {currentVideoBookmarks?.length > 0 ? (
  //       currentVideoBookmarks.map(({ time, desc }: Bookmark, i) => {
  //         return (
  //           <h3 key={i} className="flex justify-center items-center">
  //             <a data-tip="Play" data-for="play">
  //               <img
  //                 src="assets/icon-play.png"
  //                 alt="play"
  //                 width="30px"
  //                 height="30px"
  //                 className="mr-2 hover:cursor-pointer"
  //                 onClick={() => handlePlay(time)}
  //               />
  //             </a>
  //             <ReactTooltip id="play" place="top" type="dark" effect="float" />

  //             <div className="text-2xl">{desc}</div>

  //             <a data-tip="Delete" data-for="delete">
  //               <img
  //                 src="assets/icon-delete.png"
  //                 alt="delete"
  //                 width="20px"
  //                 height="20px"
  //                 className="ml-2 hover:cursor-pointer"
  //                 onClick={() => handleDelete(time)}
  //               />
  //             </a>
  //             <ReactTooltip
  //               id="delete"
  //               place="top"
  //               type="dark"
  //               effect="float"
  //             />
  //           </h3>
  //         );
  //       })
  //     ) : (
  //       <h2 className="text-2xl">No Bookmarks to Show</h2>
  //     )}
  //   </div>
  // );
};

export default Popup;
