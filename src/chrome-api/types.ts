export type VideoBookmark = {
  id: string;
  url: string;
  title: string;
  createdAt: string;
  timestamp: {
    time: number;
    desc: string;
  }[];
};
