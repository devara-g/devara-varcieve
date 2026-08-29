export interface Song {
  id: string;
  title: string;
  artist: string;
  src: string;
  duration?: string;
  genre: string;
}

export const PLAYLIST: Song[] = [
  {
    id: "lovemenot",
    title: "Love Me Not",
    artist: "Ravyn Lenae",
    src: "/assets/lovemenot.mp3",
    genre: "R&B / Soul / Synth",
  },
  {
    id: "tante",
    title: "Tante",
    artist: "Indonesian Classic / Remix",
    src: "/assets/tante.mp3",
    genre: "Indie / Vibes",
  },
];
