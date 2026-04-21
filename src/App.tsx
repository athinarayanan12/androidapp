/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Search, 
  Download, Music, Settings, Home, Library, 
  ArrowLeft, DownloadCloud, CheckCircle2, X,
  Maximize2, Volume2, MonitorPlay
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types
interface Video {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
  duration: string;
  views: string;
}

const MOCK_VIDEOS: Video[] = [
  {
    id: 'dQw4w9WgXcQ',
    title: 'Never Gonna Give You Up',
    thumbnail: 'https://picsum.photos/seed/rick/480/270',
    channel: 'Rick Astley',
    duration: '3:32',
    views: '1.4B views'
  },
  {
    id: '9bZkp7q19f0',
    title: 'PSY - GANGNAM STYLE(ê°•ë‚¨ìŠ¤íƒ€ì¼) M/V',
    thumbnail: 'https://picsum.photos/seed/psy/480/270',
    channel: 'officialpsy',
    duration: '4:12',
    views: '5.1B views'
  },
  {
    id: 'jNQXAC9IVRw',
    title: 'Me at the zoo',
    thumbnail: 'https://picsum.photos/seed/zoo/480/270',
    channel: 'jawed',
    duration: '0:19',
    views: '310M views'
  },
  {
    id: 'kJQP7kiw5Fk',
    title: 'Despacito',
    thumbnail: 'https://picsum.photos/seed/despacito/480/270',
    channel: 'Luis Fonsi',
    duration: '4:41',
    views: '8.4B views'
  },
  {
    id: 'l0U7SxXHkPY',
    title: 'Lo-fi Hip Hop Radio - Beats to relax/study to',
    thumbnail: 'https://picsum.photos/seed/lofi/480/270',
    channel: 'Lofi Girl',
    duration: '24/7',
    views: '1M watching'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'library' | 'downloads' | 'settings'>('home');
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Video[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [downloads, setDownloads] = useState<Video[]>([]);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Media Session API for background playback control
  useEffect(() => {
    if ('mediaSession' in navigator && currentVideo) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentVideo.title,
        artist: currentVideo.channel,
        album: 'YouTube',
        artwork: [
          { src: currentVideo.thumbnail, sizes: '512x512', type: 'image/jpeg' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => setIsPlaying(true));
      navigator.mediaSession.setActionHandler('pause', () => setIsPlaying(false));
      navigator.mediaSession.setActionHandler('previoustrack', () => console.log('Prev'));
      navigator.mediaSession.setActionHandler('nexttrack', () => console.log('Next'));
    }
  }, [currentVideo]);

  // Search and Gemini Logic
  const performSearch = async (query: string) => {
    if (!query.trim()) return;
    setIsSearching(true);
    
    // Simulate intelligent search results
    setTimeout(() => {
      const results = MOCK_VIDEOS.filter(v => 
        v.title.toLowerCase().includes(query.toLowerCase()) || 
        v.channel.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results.length > 0 ? results : MOCK_VIDEOS.slice(0, 3));
      setIsSearching(false);
    }, 800);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) performSearch(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Persistent storage for downloads
  useEffect(() => {
    const saved = localStorage.getItem('autotube_downloads');
    if (saved) setDownloads(JSON.parse(saved));
  }, []);

  const handleDownload = (video: Video) => {
    if (downloads.some(v => v.id === video.id)) return;
    
    setIsDownloading(video.id);
    setDownloadProgress(0);
    
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          const newDownloads = [...downloads, video];
          setDownloads(newDownloads);
          localStorage.setItem('autotube_downloads', JSON.stringify(newDownloads));
          setIsDownloading(null);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'library', icon: Library, label: 'Library' },
    { id: 'downloads', icon: Download, label: 'Offline' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen w-screen bg-black overflow-hidden select-none">
      {/* Sidebar - Geometric Balance Rail */}
      <nav className="w-[100px] bg-[#121212] flex flex-col items-center py-10 gap-12 border-r border-[#333]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`w-12 h-12 rounded-xl transition-all duration-300 relative group flex items-center justify-center ${
              activeTab === item.id 
                ? 'bg-[#FF0000] text-white shadow-[0_0_20px_rgba(255,0,0,0.3)]' 
                : 'bg-[#1A1A1A] text-[#666] hover:text-white hover:bg-[#222]'
            }`}
          >
            <item.icon size={24} />
            <span className="absolute left-full ml-6 px-3 py-1.5 bg-[#121212] border border-[#333] text-[10px] uppercase tracking-wider rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              {item.label}
            </span>
          </button>
        ))}
        
        <div className="mt-auto flex flex-col items-center gap-8">
          <div className="text-[12px] font-bold text-[#666] uppercase tracking-widest bg-[#1A1A1A] px-3 py-1.5 rounded-lg border border-[#333]">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF0000] shadow-[0_0_10px_rgba(255,0,0,0.6)] animate-pulse" />
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#000000]">
        {/* Header - Geometric Balance */}
        <header className="h-[100px] flex items-center px-10 justify-between z-10">
          <div className="flex items-center gap-6">
            {activeTab !== 'home' && (
              <button 
                onClick={() => setActiveTab('home')}
                className="p-3 bg-[#1A1A1A] border border-[#333] hover:bg-[#222] rounded-xl transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h1 className="text-3xl font-bold uppercase tracking-widest text-[#AAA]">
              {activeTab === 'home' ? 'AutoTube' : activeTab}
            </h1>
          </div>
          
          {activeTab === 'search' && (
            <div className="flex-1 max-w-2xl mx-12 relative group">
              <input 
                type="text" 
                placeholder="Search..."
                className="w-full bg-[#121212] border border-[#333] rounded-2xl py-4 px-14 text-xl focus:ring-1 focus:ring-[#FF0000] outline-none transition-all placeholder:text-[#444]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#666]" size={24} />
              {isSearching && (
                <div className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-[#FF0000] border-t-transparent rounded-full animate-spin" />
              )}
            </div>
          )}
        </header>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto px-10 pb-40">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 py-4"
            >
              {activeTab === 'home' && MOCK_VIDEOS.map((video) => (
                <VideoCard 
                  key={video.id} 
                  video={video} 
                  onPlay={() => {
                    setCurrentVideo(video);
                    setIsPlaying(true);
                  }}
                  onDownload={() => handleDownload(video)}
                  isDownloaded={downloads.some(v => v.id === video.id)}
                  isDownloading={isDownloading === video.id}
                  progress={downloadProgress}
                />
              ))}

              {activeTab === 'search' && searchResults.map((video) => (
                <VideoCard 
                  key={video.id} 
                  video={video} 
                  onPlay={() => {
                    setCurrentVideo(video);
                    setIsPlaying(true);
                  }}
                  onDownload={() => handleDownload(video)}
                  isDownloaded={downloads.some(v => v.id === video.id)}
                  isDownloading={isDownloading === video.id}
                  progress={downloadProgress}
                />
              ))}

              {activeTab === 'downloads' && (
                downloads.length > 0 ? (
                  downloads.map((video) => (
                    <VideoCard 
                      key={video.id} 
                      video={video} 
                      onPlay={() => {
                        setCurrentVideo(video);
                        setIsPlaying(true);
                      }}
                      onDownload={() => {}}
                      isDownloaded={true}
                    />
                  ))
                ) : (
                  <div className="col-span-full h-96 flex flex-col items-center justify-center text-gray-600 gap-6">
                    <DownloadCloud size={80} strokeWidth={1} className="opacity-10" />
                    <div className="text-center">
                      <p className="text-2xl font-medium text-white/50">Your library is empty</p>
                      <p className="text-sm mt-2">Content you download will appear here for offline use</p>
                    </div>
                  </div>
                )
              )}

              {activeTab === 'settings' && (
                <div className="col-span-full max-w-2xl bg-[#1a1a1a] rounded-3xl p-8 border border-white/5 space-y-8">
                  <section>
                    <h2 className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-4">Playback</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                        <span>Background Playback</span>
                        <div className="w-12 h-6 bg-red-600 rounded-full relative p-1 cursor-pointer">
                          <div className="w-4 h-4 bg-white rounded-full absolute right-1" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl opacity-50">
                        <span>Picture-in-Picture</span>
                        <div className="w-12 h-6 bg-gray-600 rounded-full" />
                      </div>
                    </div>
                  </section>
                  <section>
                    <h2 className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-4">Storage</h2>
                    <div className="p-6 bg-white/5 rounded-2xl space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Cache Used</span>
                        <span className="text-white">12.4 MB</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="w-[15%] h-full bg-red-600 rounded-full" />
                      </div>
                      <button 
                        onClick={() => {
                          setDownloads([]);
                          localStorage.removeItem('autotube_downloads');
                        }}
                        className="w-full py-3 bg-red-950 text-red-500 rounded-xl font-semibold hover:bg-red-900 transition-colors"
                      >
                        Clear All Offline Data
                      </button>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'library' && (
                <div className="col-span-full h-96 flex items-center justify-center text-gray-500/50 italic text-xl">
                  Recent activities and playlists will be here.
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Fullscreen Video Player UI - Geometric Balance Pattern */}
        <AnimatePresence>
          {currentVideo && (
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 bg-[#000000] z-[100] flex p-[40px] items-center justify-center"
            >
              <div className="w-full max-w-6xl h-full flex gap-10">
                {/* Player Card */}
                <div className="flex-1 bg-[#121212] rounded-[32px] border border-[#222] p-8 flex flex-col items-center">
                  <div className="w-full relative aspect-video bg-[#1A1A1A] rounded-[20px] overflow-hidden group">
                    <iframe 
                      src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1&controls=0&modestbranding=1&rel=0`}
                      title="Player"
                      className="w-full h-full border-none pointer-events-none"
                      allow="autoplay; encrypted-media; picture-in-picture"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    <div className="absolute bottom-6 right-6 bg-black/90 pointer-events-none border border-[#FF0000]/30 px-3 py-1.5 rounded-md font-bold text-[#FF0000] text-[10px] tracking-[2px] uppercase shadow-[0_0_15px_rgba(255,0,0,0.2)]">
                      BG PLAYBACK ACTIVE
                    </div>
                  </div>

                  <div className="w-full mt-10">
                    <h2 className="text-4xl font-bold tracking-tight leading-tight">{currentVideo.title}</h2>
                    <div className="flex items-center gap-4 mt-3">
                      <p className="text-xl text-[#AAA]">{currentVideo.channel}</p>
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-[#222] border border-[#333] px-3 py-1 rounded-full text-white/80">Verified</span>
                    </div>
                  </div>

                  <div className="w-full mt-auto flex flex-col gap-10">
                    <div className="flex items-center justify-center gap-12">
                      <button className="w-[72px] h-[72px] bg-[#1A1A1A] border border-[#333] rounded-full flex items-center justify-center text-[#AAA] hover:text-white transition-all transform active:scale-95">
                        <SkipBack size={32} />
                      </button>
                      <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-[96px] h-[96px] bg-[#FF0000] text-white rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,0,0,0.3)] hover:scale-105 active:scale-90 transition-all"
                      >
                        {isPlaying ? <Pause size={48} fill="currentColor" /> : <Play size={48} fill="currentColor" className="translate-x-1" />}
                      </button>
                      <button className="w-[72px] h-[72px] bg-[#1A1A1A] border border-[#333] rounded-full flex items-center justify-center text-[#AAA] hover:text-white transition-all transform active:scale-95">
                        <SkipForward size={32} />
                      </button>
                    </div>

                    <div className="w-full px-4">
                      <div className="w-full h-[6px] bg-[#333] rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: isPlaying ? '100%' : '35%' }}
                          transition={{ duration: 180, ease: 'linear' }}
                          className="h-full bg-[#FF0000] shadow-[0_0_15px_rgba(255,0,0,0.6)]"
                        />
                      </div>
                      <div className="flex justify-between mt-4 text-sm font-mono text-[#666] tracking-widest">
                        <span>{isPlaying ? '14:20' : '0:00'}</span>
                        <span>{currentVideo.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel - Downloads Preview */}
                <div className="w-[340px] flex flex-col h-full">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[14px] font-bold uppercase tracking-[2px] text-[#AAA]">Offline Library</span>
                    <span className="text-[10px] text-[#00FF44] font-bold uppercase tracking-wider flex items-center gap-2">
                       <span className="w-2 h-2 bg-[#00FF44] rounded-full animate-pulse" />
                       Synced
                    </span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {downloads.length > 0 ? (
                      downloads.map((video) => (
                        <div key={video.id} className="bg-[#121212] border border-[#222] rounded-2xl p-4 flex gap-4 items-center">
                          <img src={video.thumbnail} className="w-20 aspect-video rounded-lg object-cover" alt="" />
                          <div className="min-w-0">
                            <div className="text-[13px] font-bold truncate leading-tight">{video.title}</div>
                            <div className="text-[10px] text-[#666] flex items-center gap-2 mt-1">
                               <span className="w-2 h-2 bg-[#00FF44] rounded-full" />
                               1.2 GB • Available
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center opacity-20 border-2 border-dashed border-[#333] rounded-[32px]">
                        <DownloadCloud size={48} />
                      </div>
                    )}
                  </div>
                  <button 
                  onClick={() => {
                    setCurrentVideo(null);
                    setIsPlaying(false);
                  }}
                  className="mt-6 w-full py-5 bg-[#1A1A1A] border border-[#333] rounded-2xl font-bold uppercase tracking-widest text-[#AAA] hover:text-white transition-all"
                >
                  Close Player
                </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mini Player - Android Auto Style */}
        <AnimatePresence>
          {currentVideo && !isPlaying && (
            <motion.div 
              initial={{ y: 200 }}
              animate={{ y: 0 }}
              exit={{ y: 200 }}
              onClick={() => setIsPlaying(true)}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl h-24 bg-[#1a1a1a]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] px-8 py-4 flex items-center gap-6 z-[60] cursor-pointer hover:bg-[#222] transition-colors shadow-2xl"
            >
              <div className="w-16 h-10 rounded-lg overflow-hidden bg-white/5">
                <img src={currentVideo.thumbnail} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate text-lg">{currentVideo.title}</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest">{currentVideo.channel}</div>
              </div>
              <div className="flex items-center gap-4">
                <SkipBack size={24} className="text-gray-500" />
                <button 
                  className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center"
                >
                  <Play size={20} fill="currentColor" className="translate-x-0.5" />
                </button>
                <SkipForward size={24} className="text-gray-500" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

interface VideoCardProps {
  video: Video;
  onPlay: () => void;
  onDownload: () => void;
  isDownloaded: boolean;
  isDownloading?: boolean;
  progress?: number;
}

const VideoCard: React.FC<VideoCardProps> = ({ 
  video, 
  onPlay, 
  onDownload, 
  isDownloaded, 
  isDownloading, 
  progress 
}) => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      onClick={onPlay}
      className="bg-[#121212] rounded-[20px] overflow-hidden group cursor-pointer border border-[#222] hover:border-[#333] transition-all shadow-xl"
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-16 h-16 bg-[#FF0000] rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-all shadow-2xl">
            <Play fill="white" size={32} className="translate-x-0.5" />
          </div>
        </div>
        <div className="absolute bottom-3 right-3 bg-black/90 px-3 py-1 rounded-md text-[10px] font-bold border border-[#FF0000]/20 tracking-wider">
          {video.duration}
        </div>
      </div>

      <div className="p-6 flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-xl leading-tight line-clamp-2 transition-colors">
            {video.title}
          </h3>
          <div className="flex items-center gap-3 mt-3">
            <p className="text-sm text-[#AAA] truncate">{video.channel}</p>
            <span className="w-1 h-1 bg-[#444] rounded-full" />
            <p className="text-[10px] uppercase font-bold text-[#666] tracking-widest">{video.views}</p>
          </div>
        </div>
        
        <button 
          onClick={(e) => { e.stopPropagation(); onDownload(); }}
          disabled={isDownloaded || isDownloading}
          className={`shrink-0 p-4 rounded-xl transition-all ${
            isDownloaded 
              ? 'bg-[#1A1A1A] text-[#00FF44] border border-[#333]' 
              : isDownloading 
                ? 'bg-[#1A1A1A] text-[#FF0000] animate-pulse border border-[#FF0000]/30'
                : 'bg-[#1A1A1A] text-[#666] hover:text-white hover:bg-[#222] border border-[#333]'
          }`}
        >
          {isDownloaded ? <CheckCircle2 size={24} /> : isDownloading ? (
            <div className="relative">
              <Download size={24} />
              <svg className="absolute -inset-2 w-[40px] h-[40px] -rotate-90" viewBox="0 0 24 24">
                <circle
                  className="text-[#333]"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  fill="transparent"
                  r="10"
                  cx="12"
                  cy="12"
                />
                <circle
                  className="text-[#FF0000] transition-all duration-300"
                  strokeWidth="2.5"
                  strokeDasharray={62.8}
                  strokeDashoffset={62.8 - (62.8 * (progress || 0)) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="10"
                  cx="12"
                  cy="12"
                />
              </svg>
            </div>
          ) : <Download size={24} />}
        </button>
      </div>
    </motion.div>
  );
}
