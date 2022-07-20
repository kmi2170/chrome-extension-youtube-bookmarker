import ReactTooltip from 'react-tooltip';
import React from 'react';

type VideoBookmarkItemProps = {
  id: string;
  url: string;
  title: string;
};

const VideoBookmarkItem = ({ id, url, title }: VideoBookmarkItemProps) => {
  return (
    <h2
      key={id}
      className="mt-2 p-1 pl-8 pr-8 font-bold text-2xl text-white  bg-purple-900 rounded-full hover:cursor-pointer hover:drop-shadow-2xl"
    >
      <div className="flex flex-row justify-between items-center">
        <a href={url} target="_blank">
          {title}
        </a>
        <a data-tip="Delete" data-for={`delete-video-${id}`}>
          <img
            src="assets/icon-delete.png"
            alt="delete"
            width="20px"
            height="20px"
            className="ml-2 hover:cursor-pointer"
            // onClick={() => handleDelete(time)}
          />
        </a>
        <ReactTooltip
          id={`delete-video-${id}`}
          place="top"
          type="dark"
          effect="float"
        />
      </div>
    </h2>
  );
};

export default VideoBookmarkItem;
