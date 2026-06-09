export interface Photo {
  id: number;
  url: string;
}

export interface PhotoResponse {
  // Picsum API returns id as string despite being a numeric value
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}
