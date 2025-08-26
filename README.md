# VibeStream - A Modern Music Streaming Web App

VibeStream is a modern music streaming web app that lets you discover and play trending songs directly from YouTube. Built with Next.js, TypeScript, and Tailwind CSS, it features a beautiful UI, trending music section, and seamless playback.

## Features

- 🎵 **Trending Now:** Listen to the latest trending songs, updated daily.
- 🔍 **YouTube Integration:** Fetches music and cover art directly from YouTube.
- ⚡ **Fast & Responsive:** Built with Next.js App Router and optimized for all devices.
- 🖼️ **Beautiful UI:** Clean, modern design with album cards and smooth transitions.
- 🛠️ **Custom Player:** Play, pause, and switch songs with ease.

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/pratham-prog861/vibestream.git
   cd vibestream
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Create a `.env.local` file in the root directory.
   - Add your YouTube Data API key:
     ```
     YOUTUBE_API_KEY=your_youtube_api_key_here
     ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Project Structure

- `src/app/` — Main Next.js app pages and components
- `src/services/youtube.ts` — YouTube Data API integration
- `src/store/` — State management for the player
- `src/components/` — UI components

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
