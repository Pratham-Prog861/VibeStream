// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs,
  deleteDoc,
  doc,
  Timestamp,
  serverTimestamp
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6Bs2iapmthw7ydY1XQntV0cx0PaAJ1gM",
  authDomain: "vibestream-jqezr.firebaseapp.com",
  projectId: "vibestream-jqezr",
  storageBucket: "vibestream-jqezr.appspot.com",
  messagingSenderId: "403341082245",
  appId: "1:403341082245:web:01550a3dff26646c0573ec"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Types
export interface Song {
  title: string;
  artist: string;
  videoId: string;
  coverUrl: string;
}

export interface Playlist {
  id?: string;
  name: string;
  description: string;
  songs: Song[];
  createdAt: any; // Will be Firestore timestamp
  updatedAt: any; // Will be Firestore timestamp
}

// Save playlist to Firestore
export const savePlaylist = async (playlistData: Omit<Playlist, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    // console.log('Saving playlist data:', JSON.stringify(playlistData, null, 2));
    
    // Validate playlist data
    if (!playlistData.name || !Array.isArray(playlistData.songs)) {
      throw new Error('Invalid playlist data');
    }
    
    const playlistWithTimestamp = {
      name: String(playlistData.name || 'Unnamed Playlist'),
      description: String(playlistData.description || ''),
      songs: (playlistData.songs || []).map(song => ({
        title: String(song.title || 'Unknown Title'),
        artist: String(song.artist || 'Unknown Artist'),
        videoId: String(song.videoId || ''),
        coverUrl: String(song.coverUrl || '')
      })),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      songCount: (playlistData.songs || []).length
    };

    // console.log('Processed playlist data:', JSON.stringify(playlistWithTimestamp, null, 2));
    
    const docRef = await addDoc(collection(db, 'playlists'), playlistWithTimestamp);
    // console.log('Playlist saved with ID:', docRef.id);
    return docRef.id;
  } catch (error : any) {
    // console.error('Error in savePlaylist:', error);
    throw new Error(`Failed to save playlist: ${error.message}`);
  }
};

// Get all playlists from Firestore
export const getPlaylists = async (): Promise<Playlist[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'playlists'));
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        songs: data.songs || [],
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as Playlist;
    });
  } catch (error : any) {
    console.error('Error getting playlists:', error);
    throw new Error('Failed to load playlists. Please try again.');
  }
};

// Delete a playlist from Firestore
export const deletePlaylist = async (playlistId: string): Promise<void> => {
  try {
    if (!playlistId) {
      throw new Error('No playlist ID provided');
    }
    await deleteDoc(doc(db, 'playlists', playlistId));
    // console.log('Playlist deleted successfully:', playlistId);
  } catch (error) {
    // console.error('Error deleting playlist:', error);
    throw new Error('Failed to delete playlist. Please try again.');
  }
};

export { app, db };
