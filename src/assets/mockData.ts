export const mockVideoBookmarks = [
  {
    id: 'id0001',
    title: 'first video title',
    createdAt: '2022-07-23T04:02:16.413Z',
    timestamp: [
      { time: 3, desc: 'Bookmark at 00:00:03' },
      { time: 1176, desc: 'Bookmark at 00:19:36' },
      { time: 1917, desc: 'Bookmark at 00:31:57' },
    ],
    url: 'https://www.youtube.com/watch?v=testvideo1',
  },
  {
    id: 'id0002',
    title: 'second video title',
    createdAt: '2022-07-23T04:02:54.179Z',
    timestamp: [],
    url: 'https://www.youtube.com/watch?v=testvideo2',
  },
  {
    id: 'id0003',
    title: 'third video title',
    createdAt: '2022-07-24T01:23:39.243Z',
    timestamp: [],
    url: 'https://www.youtube.com/watch?v=testvideo3',
  },
];

export const videoIds = [
  mockVideoBookmarks[0].id,
  mockVideoBookmarks[1].id,
  mockVideoBookmarks[2].id,
];

export const videoTitles = [
  mockVideoBookmarks[0].title,
  mockVideoBookmarks[1].title,
  mockVideoBookmarks[2].title,
];

export const timeStampsV0 = [...mockVideoBookmarks[0].timestamp];
