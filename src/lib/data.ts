export const albums = [
  {
    title: 'Cosmic Echoes',
    artist: 'Galaxy Drifters',
    coverUrl: 'https://placehold.co/300x300/222629/4DBA99.png',
    aiHint: 'galaxy nebula',
  },
  {
    title: 'Oceanic Whispers',
    artist: 'Tidal Waves',
    coverUrl: 'https://placehold.co/300x300/222629/4DBA99.png',
    aiHint: 'ocean wave',
  },
  {
    title: 'Midnight Drive',
    artist: 'Night Cruisers',
    coverUrl: 'https://placehold.co/300x300/222629/4DBA99.png',
    aiHint: 'night city',
  },
  {
    title: 'Forest Lullaby',
    artist: 'The Woodsmen',
    coverUrl: 'https://placehold.co/300x300/222629/4DBA99.png',
    aiHint: 'misty forest',
  },
  {
    title: 'Cybernetic Dreams',
    artist: 'Synthwave Architects',
    coverUrl: 'https://placehold.co/300x300/222629/4DBA99.png',
    aiHint: 'cyberpunk cityscape',
  },
  {
    title: 'Desert Mirage',
    artist: 'Sand Dune Surfers',
    coverUrl: 'https://placehold.co/300x300/222629/4DBA99.png',
    aiHint: 'desert dunes',
  },
];

export const playlists = [
    {
        name: 'Chill Vibes',
        songCount: 25,
        coverUrl: 'https://placehold.co/300x300/222629/4DBA99.png',
        aiHint: 'cozy room',
    },
    {
        name: 'Workout Hits',
        songCount: 50,
        coverUrl: 'https://placehold.co/300x300/222629/4DBA99.png',
        aiHint: 'gym workout',
    },
    {
        name: 'Focus Flow',
        songCount: 42,
        coverUrl: 'https://placehold.co/300x300/222629/4DBA99.png',
        aiHint: 'rainy window',
    },
    {
        name: 'Indie Discovery',
        songCount: 30,
        coverUrl: 'https://placehold.co/300x300/222629/4DBA99.png',
        aiHint: 'record player',
    },
];

export const recentlyPlayed = albums.slice(0, 4);

export const madeForYou = playlists.slice(0, 2);
