export type VideoBookmark = {
  id: string;
  url: string;
  title: string;
  createdAt: string;
  timestamps: {
    time: number;
    desc: string;
  }[];
};
