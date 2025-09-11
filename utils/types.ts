export type Post = {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  upvotes: number;
  nr_of_comments: number;
  image: string | null;
  location: string;
  beds: string;
  rating: number;
  reviews: number;
  pricePerNight: string;
  filters: string[];
  availability: string;
  type: string;
  postedAt: string;
  latitude: number;
  longitude: number;
  reviewsList: Review[];
  group: Group;
  user: User;
};

export type Review = {
  user: string;
  rating: number;
  comment: string;
  avatar: string;
};

export type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  parent_id: string | null;
  comment: string;
  created_at: string;
  upvotes: number;
  user: User;
  replies: Comment[];
};

export type Group = {
  id: string;
  name: string;
  image: string;
};

export type User = {
  id: string;
  name: string;
  image: string | null;
};
