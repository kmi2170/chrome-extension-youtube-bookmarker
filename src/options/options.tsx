import React, { useEffect, useState } from 'react';

import { fetchOptions } from '../chrome-api/fetchOptions';
import './options.css';

const key = 'yt-bookmarks-options';

const Options = () => {
  const [isAllPages, setIsAllPages] = useState(true);

  // chrome.storage.sync.remove([key]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAllPages(e.target.checked);

    chrome.storage.sync.set({ [key]: { isAllPages: e.target.checked } }, () => {
      console.log('options are saved');
    });
  };

  useEffect(() => {
    fetchOptions(key)
      .then((data) => setIsAllPages(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <h1 className="mt-8 ml-8 text-3xl text-black">Options</h1>
      <div className="ml-12 mt-4 text-2xl flex items-center">
        <input type="checkbox" checked={isAllPages} onChange={handleChange} />
        <label className="ml-3 text-2xl">Always show bookmarks</label>
      </div>
    </div>
  );
};

export default Options;
