export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  techStack: string[];
  palette: string[];
  link: string;
  images: string[];
  thumbnail?: string;
  thumbnailDark?: string;
}

export interface Position {
  x: number | string;
  y: number | string;
}
