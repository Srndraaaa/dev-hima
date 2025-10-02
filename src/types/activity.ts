export interface Activity {
  id: string;
  title: string;
  content: string;
  description?: string;
  author: string;
  created_at: string;
  updated_at: string;
  image_url?: string;
  published: boolean;
}