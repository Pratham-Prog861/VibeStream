export type SeedSong = {
  title: string;
  artist: string;
  videoId: string;
  coverUrl: string;
  aiHint?: string;
  genre?: string;
  mood?: string;
  language?: string;
};

export type PlaylistCard = {
  name: string;
  artist: string;
  coverUrl: string;
  aiHint?: string;
};

const ytCover = (videoId: string) => `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

export const trending: SeedSong[] = [
  {
    title: 'Shaky ( Official #Video ) Sanju Rathod Ft. Isha Malviya | G-Spark |',
    artist: 'Sanju Rathod',
    videoId: 'sUf2PtEZris',
    coverUrl: ytCover('sUf2PtEZris'),
    aiHint: 'Party Vibes',
    genre: 'Pop',
    mood: 'Energetic',
    language: 'Hindi',
  },
  {
    title: 'Monica - Lyric Video| COOLIE | Superstar Rajinikanth | Sun Pictures | Lokesh | Anirudh | Pooja Hegde',
    artist: 'Anirudh',
    videoId: '2qCpY38ompo',
    coverUrl: ytCover('2qCpY38ompo'),
    aiHint: 'Coolie',
    genre: 'Film Music',
    mood: 'Energetic',
    language: 'Tamil',
  },
  {
    title: 'Janaab-e-Aali | Full Song | WAR 2 | Hrithik Roshan, NTR | Pritam, Sachet Tandon, Saaj Bhatt, Amitabh',
    artist: 'Pritam',
    videoId: '9l5QY7BJmHQ',
    coverUrl: ytCover('9l5QY7BJmHQ'),
    aiHint: 'War 2',
    genre: 'Film Music',
    mood: 'Intense',
    language: 'Hindi',
  },
  {
    title: 'Uyi Amma - Azaad | Aaman D, Rasha Thadani| Madhubanti Bagchi,Amit Trivedi,Amitabh| Bosco| Abhishek K',
    artist: 'Amitabh',
    videoId: 'FZLadzn5i6Q',
    coverUrl: ytCover('FZLadzn5i6Q'),
    aiHint: 'Azaad',
    genre: 'Indie',
    mood: 'Melancholic',
    language: 'Hindi',
  },
  {
    title: 'Afusic - Pal Pal (Official Music Video) Prod. @AliSoomroMusic',
    artist: 'Afusic',
    videoId: '8of5w7RgcTc',
    coverUrl: ytCover('8of5w7RgcTc'),
    aiHint: 'Pal Pal',
    genre: 'Indie',
    mood: 'Calm',
    language: 'Hindi',
  },
  {
    title: 'Guru Randhawa - SIRRA ( Official Video )',
    artist: 'Guru Randhawa',
    videoId: 'knGCfzm4jWs',
    coverUrl: ytCover('knGCfzm4jWs'),
    aiHint: 'Sirra',
    genre: 'Pop',
    mood: 'Energetic',
    language: 'Hindi',
  },
  {
    title: 'Qatal - Guru Randhawa | Latest Hindi Song 2024 | New Punjabi Song 2024',
    artist: 'Guru Randhawa',
    videoId: 'c-FKlE3_kHo',
    coverUrl: ytCover('c-FKlE3_kHo'),
    aiHint: 'Qatal',
    genre: 'Pop',
    mood: 'Energetic',
    language: 'Hindi',
  },
  {
    title: 'LAAL PARI (Song): Yo Yo Honey Singh | Sajid Nadiadwala | Tarun Mansukhani | Housefull 5 - 6th June',
    artist: 'Yo Yo Honey Singh',
    videoId: 'KGn-erOG-Bs',
    coverUrl: ytCover('KGn-erOG-Bs'),
    aiHint: 'Housefull 5',
    genre: 'Film Music',
    mood: 'Energetic',
    language: 'Hindi',
  },
];

export const madeForYou: PlaylistCard[] = [
  {
    name: 'Best Bollywood Romantic Songs',
    artist: 'T-Series',
    coverUrl: ytCover('3-buUW3gmtU'),
    aiHint: 'romantic couple',
  },
  {
    name: 'Evergreen Hits of KK',
    artist: 'T-Series',
    coverUrl: ytCover('r0c1f6XxRQg'),
    aiHint: 'vintage microphone',
  },
  {
    name: 'Viral Songs Latest Chill Vibe',
    artist: 'Curated Playlist',
    coverUrl: ytCover('_ubIpFG0JZc'),
    aiHint: 'social media',
  },
  {
    name: 'Top Favourites on YouTube',
    artist: 'T-Series',
    coverUrl: ytCover('cYatYLzx9hA'),
    aiHint: 'youtube logo',
  },
  {
    name: 'Non Stop Party Vibes',
    artist: 'Aditya Music',
    coverUrl: ytCover('7u8MyPmhla4'),
    aiHint: 'party dance',
  },
];

export const featuredPlaylists: PlaylistCard[] = [
  {
    name: 'Zero Distractions - Coding Music for Deep Focus',
    artist: 'Cosmic Hippo',
    coverUrl: ytCover('0w80F8FffQ4'),
    aiHint: 'Coding Music',
  },
  {
    name: 'TOP 15 BEST BGM OF ANIRUDH | BEST BGM 2025 ft. VIP, ROLEX, MASTER, PETTA, JAILER etc. @Zedtvog',
    artist: 'ZEDTV',
    coverUrl: ytCover('lr3wbxL9LUk'),
    aiHint: 'South BGM',
  },
  {
    name: 'OFFICIAL: Best ITEM SONGS of Bollywood | Devil Song, Ghagra, Fevicol',
    artist: 'T-Series',
    coverUrl: ytCover('uVRs6TFb0OU'),
    aiHint: 'Item Song',
  },
  {
    name: '7 years let me down ..- Melody Chill Music',
    artist: 'Featured Playlist',
    coverUrl: ytCover('POETazMpykQ'),
    aiHint: 'Sad Song',
  },
];
