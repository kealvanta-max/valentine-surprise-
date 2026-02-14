import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';

// ============================================================================
// CONFIG - Edit this object to personalize everything
// ============================================================================
// 
// IMAGE URLS: Google Drive images can be tricky. For best results:
// 1. Make sure your Google Drive files are set to "Anyone with the link can view"
// 2. Use this format: https://lh3.googleusercontent.com/d/FILE_ID
//    (where FILE_ID is the part after /d/ in your Google Drive link)
// 3. Alternative: Upload images to imgur.com or imgbb.com for more reliable hosting
//
// AUDIO URLS: Google Drive audio often doesn't work due to CORS restrictions.
// Better alternatives:
// 1. Use Dropbox: Upload file, get link, change ?dl=0 to ?dl=1
// 2. Use a direct .mp3 URL from a hosting service
// 3. The iframe fallback below will try to play from Google Drive
//
interface PlaylistItem {
  title: string;
  url: string;
}

interface Config {
  askerName: string;
  partnerName: string;
  headline: string;
  introText: string;
  storyTitle: string;
  storyText: string;
  reasons: string[];
  memories: Array<{ url: string; caption: string }>;
  videoUrl: string;
  letterText: string;
  finalMessage: string;
  dateIdea: string;
  playlist: PlaylistItem[];
  audioUrl: string;
}

const defaultConfig: Config = {
  askerName: "Kenneth Tibu",
  partnerName: "Auntie Esi",
  headline: "Auntie Esi, will you be my Valentine?",
  introText: "From the first moment I saw you, I knew my heart had found its home.",
  
  storyTitle: "Our Story",
  storyText: `Every love story is special, but ours is my favorite. From that very first meeting, something shifted in my world. You walked into my life and suddenly everything made sense.

The way you laugh, the way you care for everyone around you, the way you make even ordinary moments feel extraordinary. I remember every small detail, every shared glance, every moment that brought us closer.

Through the years, we've built something beautiful together. A partnership, a friendship, a love that grows deeper with each passing day. You've been my rock, my confidant, my best friend, and my greatest blessing.

They say home is where the heart is, and my heart has always been with you.`,
  
  reasons: [
    "Your smile lights up my darkest days and reminds me why life is beautiful.",
    "The way you care for everyone around you shows the depth of your beautiful soul.",
    "You make me want to be a better person every single day we're together.",
    "Your laughter is my favorite sound in the entire world.",
    "You see the best in me, even when I can't see it myself.",
    "With you, I found not just love, but my best friend and partner for life."
  ],
  
  memories: [
    { url: "https://lh3.googleusercontent.com/d/1t7evUANpAWUOprHEG8mq8ojvYZg9b3bL", caption: "A flower for my beautiful wife" },
    { url: "https://lh3.googleusercontent.com/d/1W6jV2uvl3bABxc02CkebhlttZaPKYTYF", caption: "Family moments we cherish" },
    { url: "https://lh3.googleusercontent.com/d/1RJ3oVJRnGTRv0SVOKz4jFOVGVZYPEqZm", caption: "Our hearts, forever entwined" },
    { url: "https://lh3.googleusercontent.com/d/1du1cPq5LJHossIyBoTw1-1e0VK9FCQbD", caption: "My better half" },
    { url: "https://lh3.googleusercontent.com/d/1dsi92X92YB5sCDBTUDqjm0TJLNfnptc6", caption: "Cherished memories" },
    { url: "https://lh3.googleusercontent.com/d/1hMpM9G9dCo-T3IukdpIm9lmq5lsbqE4J", caption: "The love of my life" },
    { url: "https://lh3.googleusercontent.com/d/1Tt03b3xjoPpmi9xTOL1ZTr7COTRMIwkJ", caption: "Your beautiful smile" }
  ],
  
  videoUrl: "https://drive.google.com/file/d/1tuv2nmXI31Y0eugY10h1lIzAaLO4XovJ/preview",
  // Note: Google Drive video URLs should use /preview format for embedding
  
  letterText: `My Dearest Love,

As I write this letter, my heart overflows with gratitude for every moment we've shared together. You came into my life and painted it with colors I never knew existed.

Every morning I wake up grateful that you're in my life. Every night I fall asleep thankful for another day spent loving you. You've taught me what it truly means to love and be loved in return.

I remember the day we met like it was yesterday. Something in my soul recognized you, as if we had known each other across lifetimes. With you, I found not just love, but a home.

You've stood by me through everything. The good days and the hard ones. The laughter and the tears. Through it all, your love has been my constant, my anchor, my guiding star.

I promise to spend every day showing you how much you mean to me. To be your partner, your supporter, your biggest fan. To love you through every season of our lives.

You are my yesterday, my today, and all of my tomorrows.

Forever yours,
With all my love`,
  
  finalMessage: "You just made me the happiest person alive!",
  dateIdea: "Our Valentine's celebration: A romantic dinner under the stars, February 14th, 2026",
  
  // =========================================================================
  // MUSIC PLAYLIST - Add your real songs here!
  // =========================================================================
  //
  // HOW TO ADD YOUR SONGS (choose one method):
  //
  // METHOD 1: DROPBOX (Best option - Free)
  // ----------------------------------------
  // 1. Go to dropbox.com and create a free account
  // 2. Upload your MP3 file (e.g., "Ed Sheeran - Thinking Out Loud.mp3")
  // 3. Click "Share" button on the file
  // 4. Click "Copy link"
  // 5. The link will look like: https://www.dropbox.com/s/abc123xyz/song.mp3?dl=0
  // 6. IMPORTANT: Change ?dl=0 to ?dl=1 at the end
  // 7. Final URL: https://www.dropbox.com/s/abc123xyz/song.mp3?dl=1
  //
  // METHOD 2: CATBOX.MOE (Free, no signup required)
  // ------------------------------------------------
  // 1. Go to catbox.moe
  // 2. Click "Browse" and select your MP3
  // 3. Click "Upload"
  // 4. Copy the direct link (e.g., https://files.catbox.moe/abc123.mp3)
  //
  // METHOD 3: FILE.IO (Temporary links)
  // ------------------------------------
  // 1. Go to file.io
  // 2. Upload your MP3
  // 3. Copy the link (note: link expires after first download)
  //
  
  playlist: [
    {
      title: "Artemas - I Like The Way You Kiss Me",
      url: "https://www.dropbox.com/scl/fi/ow3wjeczgt4g7be9wrn8y/Artemas_-_I_Like_The_Way_You_Kiss_Me.mp3?rlkey=o3pn8o8frubs7pdasya357fmg&st=ek8lu55e&dl=1"
    },
    {
      title: "Ed Sheeran - Thinking Out Loud",
      url: "https://www.dropbox.com/scl/fi/ru7vu962cb3mogdjnlln9/Edsheeran_-_thinking_out_loud_-mp3.pm.mp3?rlkey=zqhpyrzzydmqbbagd1jq6q658&st=r6ii5agn&dl=1"
    }
  ],
  
  // Fallback song (uses first song from playlist)
  audioUrl: "https://www.dropbox.com/scl/fi/ow3wjeczgt4g7be9wrn8y/Artemas_-_I_Like_The_Way_You_Kiss_Me.mp3?rlkey=o3pn8o8frubs7pdasya357fmg&st=ek8lu55e&dl=1"
};

// ============================================================================
// URL Parameter Handling
// ============================================================================
function getUrlParams(): { asker: string | null; partner: string | null } {
  const params = new URLSearchParams(window.location.search);
  return {
    asker: params.get('asker'),
    partner: params.get('partner')
  };
}

function getConfig() {
  const params = getUrlParams();
  if (params.asker && params.partner) {
    return {
      ...defaultConfig,
      askerName: params.asker,
      partnerName: params.partner,
      headline: `${params.partner}, will you be my Valentine?`
    };
  }
  return defaultConfig;
}

// ============================================================================
// Main App Component
// ============================================================================
export function App() {
  const config = getConfig();
  const urlParams = getUrlParams();
  const hasCustomParams = !!(urlParams.asker && urlParams.partner);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [noButtonAttempts, setNoButtonAttempts] = useState(0);
  const [showLightbox, setShowLightbox] = useState<number | null>(null);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Link copied to clipboard!');
  const [typedText, setTypedText] = useState('');
  const [audioError, setAudioError] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Get valid playlist songs (filter out placeholder URLs)
  const validPlaylist = config.playlist?.filter(
    song => song.url && !song.url.includes('YOUR_') && song.url.startsWith('http')
  ) || [];
  
  // Use playlist if available, otherwise fallback
  const currentAudioUrl = validPlaylist.length > 0 
    ? validPlaylist[currentSongIndex % validPlaylist.length]?.url 
    : config.audioUrl;
  
  const currentSongTitle = validPlaylist.length > 0 
    ? validPlaylist[currentSongIndex % validPlaylist.length]?.title 
    : 'Background Music';
  const noButtonRef = useRef<HTMLButtonElement>(null);
  
  // Typing animation for the main question
  useEffect(() => {
    const question = config.headline;
    let index = 0;
    const interval = setInterval(() => {
      if (index <= question.length) {
        setTypedText(question.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 80);
    return () => clearInterval(interval);
  }, [config.headline]);
  
  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    
    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, []);
  
  // Audio control with error handling
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setAudioError(false);
            setShowMusicPlayer(true);
          })
          .catch((err) => {
            console.warn('Audio playback failed:', err);
            setAudioError(true);
            setToastMessage('Audio failed. See instructions in config to add your songs.');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4000);
          });
      }
    }
  };
  
  // Update audio source when song changes
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.load();
      audioRef.current.play().catch(() => {});
    }
  }, [currentSongIndex]);
  
  // No button dodge logic
  const handleNoHover = () => {
    if (noButtonAttempts >= 3) return;
    
    const btn = noButtonRef.current;
    if (!btn) return;
    
    const maxX = window.innerWidth - btn.offsetWidth - 20;
    const maxY = window.innerHeight - btn.offsetHeight - 20;
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;
    
    btn.style.position = 'fixed';
    btn.style.left = `${newX}px`;
    btn.style.top = `${newY}px`;
    btn.style.zIndex = '9999';
    
    setNoButtonAttempts((prev) => prev + 1);
  };
  
  // Celebration trigger
  const handleYes = () => {
    setShowCelebration(true);
    
    // Start music if not playing
    if (audioRef.current && !isPlaying) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Audio failed but don't ruin the moment
        });
    }
    
    // Fire confetti
    const duration = 6000;
    const end = Date.now() + duration;
    
    const frame = () => {
      // Regular confetti
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#e11d48', '#f9a8d4', '#fbbf24']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#e11d48', '#f9a8d4', '#fbbf24']
      });
      
      // Heart-shaped burst
      if (Math.random() > 0.8) {
        confetti({
          particleCount: 10,
          spread: 100,
          origin: { y: 0.6, x: Math.random() },
          colors: ['#e11d48', '#f9a8d4'],
          shapes: ['circle'],
          scalar: 1.2
        });
      }
      
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };
  
  // Smooth scroll to section
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="min-h-screen bg-[#1a0f14] text-white overflow-x-hidden">
      {/* Background floating hearts */}
      <FloatingHearts />
      
      {/* Audio element - uses playlist if valid, otherwise fallback */}
      <audio 
        ref={audioRef} 
        preload="auto"
        onEnded={() => {
          // Auto-play next song when current ends
          if (validPlaylist.length > 1) {
            setCurrentSongIndex((prev) => (prev + 1) % validPlaylist.length);
          }
        }}
      >
        <source src={currentAudioUrl} type="audio/mpeg" />
      </audio>
      
      {/* Mini Music Player (shows when playing) */}
      {showMusicPlayer && isPlaying && (
        <div className="fixed bottom-4 left-4 z-40 bg-[#1a0f14]/95 backdrop-blur-md border border-pink-500/20 rounded-xl p-4 shadow-xl max-w-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-600 to-pink-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-pink-100 text-sm font-medium truncate">{currentSongTitle}</p>
              <p className="text-pink-300/60 text-xs">
                {validPlaylist.length > 1 ? `${currentSongIndex + 1} of ${validPlaylist.length}` : 'Now Playing'}
              </p>
            </div>
            {validPlaylist.length > 1 && (
              <button
                onClick={() => setCurrentSongIndex((prev) => (prev + 1) % validPlaylist.length)}
                className="p-2 text-pink-300 hover:text-pink-100"
                title="Next song"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
            <button
              onClick={() => setShowMusicPlayer(false)}
              className="p-1 text-pink-300/60 hover:text-pink-300"
              title="Hide player"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Navbar */}
      <Navbar
        config={config}
        isPlaying={isPlaying}
        toggleMusic={toggleMusic}
        scrollTo={scrollTo}
      />
      
      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0f14] via-[#1a0f14]/90 to-[#1a0f14]" />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto animate-on-scroll">
          <p className="text-rose-400 font-inter text-sm md:text-base tracking-widest uppercase mb-4">
            A message for {config.partnerName}
          </p>
          
          <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-rose-400 via-pink-300 to-amber-300 bg-clip-text text-transparent">
              {typedText}
            </span>
            <span className="animate-pulse">|</span>
          </h1>
          
          <p className="font-inter text-pink-200/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            {config.introText}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => scrollTo('letter')}
              className="group relative px-8 py-4 bg-gradient-to-r from-rose-600 to-pink-600 rounded-full font-semibold text-white shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10">Open My Love Letter</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
            </button>
            
            {!hasCustomParams && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 border border-pink-400/30 rounded-full text-pink-300 hover:bg-pink-500/10 hover:border-pink-400/50 transition-all duration-300"
              >
                Create Your Own Version
              </button>
            )}
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>
      
      {/* Our Story Section */}
      <section id="story" className="py-20 md:py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-on-scroll text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-5xl font-bold mb-4 text-pink-100">
              {config.storyTitle}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-rose-500 to-amber-400 mx-auto rounded-full" />
          </div>
          
          <div className="animate-on-scroll bg-gradient-to-br from-rose-900/20 to-pink-900/10 backdrop-blur-sm border border-pink-500/10 rounded-2xl p-8 md:p-12">
            {config.storyText.split('\n\n').map((paragraph, i) => (
              <p key={i} className="font-inter text-pink-100/80 text-lg leading-relaxed mb-6 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>
      
      {/* Why You Section */}
      <section id="reasons" className="py-20 md:py-32 px-4 bg-gradient-to-b from-[#1a0f14] via-[#1f1015] to-[#1a0f14]">
        <div className="max-w-6xl mx-auto">
          <div className="animate-on-scroll text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-5xl font-bold mb-4 text-pink-100">
              Why I Love You
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-rose-500 to-amber-400 mx-auto rounded-full" />
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {config.reasons.map((reason, i) => (
              <ReasonCard key={i} reason={reason} index={i} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Memories Section */}
      <section id="memories" className="py-20 md:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-on-scroll text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-5xl font-bold mb-4 text-pink-100">
              Our Memories
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-rose-500 to-amber-400 mx-auto rounded-full" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {config.memories.map((memory, i) => (
              <MemoryCard
                key={i}
                memory={memory}
                index={i}
                onClick={() => setShowLightbox(i)}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Video Section */}
      <section id="video" className="py-20 md:py-32 px-4 bg-gradient-to-b from-[#1a0f14] via-[#1f1015] to-[#1a0f14]">
        <div className="max-w-4xl mx-auto">
          <div className="animate-on-scroll text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-5xl font-bold mb-4 text-pink-100">
              Our Special Video
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-rose-500 to-amber-400 mx-auto rounded-full" />
          </div>
          
          <div className="animate-on-scroll aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-rose-500/20 border border-pink-500/20">
            <iframe
              src={config.videoUrl}
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="Our Special Video"
            />
          </div>
        </div>
      </section>
      
      {/* The Letter Section */}
      <section id="letter" className="py-20 md:py-32 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="animate-on-scroll text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-5xl font-bold mb-4 text-pink-100">
              My Letter To You
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-rose-500 to-amber-400 mx-auto rounded-full" />
          </div>
          
          <Envelope
            isOpen={envelopeOpen}
            onOpen={() => setEnvelopeOpen(true)}
            letterText={config.letterText}
            senderName={config.askerName}
          />
        </div>
      </section>
      
      {/* The Big Question Section */}
      <section id="ask" className="py-20 md:py-32 px-4 min-h-screen flex items-center bg-gradient-to-b from-[#1a0f14] via-[#200f16] to-[#1a0f14]">
        <div className="max-w-4xl mx-auto text-center w-full">
          <div className="animate-on-scroll">
            <p className="text-rose-400 font-inter text-sm md:text-base tracking-widest uppercase mb-6">
              The moment of truth
            </p>
            
            <h2 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold mb-12 bg-gradient-to-r from-rose-400 via-pink-300 to-amber-300 bg-clip-text text-transparent animate-pulse">
              {config.partnerName}, will you be my Valentine?
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={handleYes}
                className="relative px-12 py-5 bg-gradient-to-r from-rose-600 to-pink-600 rounded-full font-bold text-xl text-white shadow-lg shadow-rose-500/40 hover:shadow-rose-500/60 transition-all duration-300 hover:scale-110 animate-glow"
              >
                Yes!
              </button>
              
              <button
                ref={noButtonRef}
                onMouseEnter={handleNoHover}
                onTouchStart={handleNoHover}
                className="px-12 py-5 border-2 border-pink-400/30 rounded-full font-semibold text-lg text-pink-300 hover:bg-pink-500/10 transition-all duration-300"
              >
                {noButtonAttempts >= 3 ? 'Please?' : 'No'}
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Lightbox */}
      {showLightbox !== null && (
        <Lightbox
          memories={config.memories}
          currentIndex={showLightbox}
          onClose={() => setShowLightbox(null)}
          onNavigate={setShowLightbox}
        />
      )}
      
      {/* Create Your Own Modal */}
      {showCreateModal && (
        <CreateModal
          onClose={() => setShowCreateModal(false)}
          onCopied={() => {
            setToastMessage('Link copied to clipboard!');
            setAudioError(false);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
          }}
        />
      )}
      
      {/* Toast */}
      {showToast && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 ${audioError ? 'bg-amber-600' : 'bg-green-600'} text-white rounded-full font-inter shadow-lg animate-fade-in`}>
          {toastMessage}
        </div>
      )}
      
      {/* Celebration Overlay */}
      {showCelebration && (
        <CelebrationOverlay config={config} onClose={() => setShowCelebration(false)} />
      )}
      
      {/* Global styles */}
      <style>{`
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .animate-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite alternate;
        }
        @keyframes glow {
          from { box-shadow: 0 0 20px rgba(225, 29, 72, 0.4); }
          to { box-shadow: 0 0 40px rgba(225, 29, 72, 0.8), 0 0 60px rgba(249, 168, 212, 0.4); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// Navbar Component
// ============================================================================
interface NavbarProps {
  config: Config;
  isPlaying: boolean;
  toggleMusic: () => void;
  scrollTo: (id: string) => void;
}

function Navbar({ config, isPlaying, toggleMusic, scrollTo }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#1a0f14]/90 backdrop-blur-md shadow-lg' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">
            <svg className="w-8 h-8 text-rose-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </span>
          <span className="font-playfair text-lg text-pink-200 hidden sm:block">
            {config.askerName} & {config.partnerName}
          </span>
        </div>
        
        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {['story', 'memories', 'video', 'letter', 'ask'].map((section) => (
            <button
              key={section}
              onClick={() => scrollTo(section)}
              className="font-inter text-sm text-pink-200/70 hover:text-pink-100 transition-colors capitalize"
            >
              {section === 'ask' ? 'The Question' : section}
            </button>
          ))}
        </div>
        
        {/* Music Toggle */}
        <button
          onClick={toggleMusic}
          className="p-2 rounded-full bg-pink-500/10 hover:bg-pink-500/20 transition-colors"
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? (
            <svg className="w-6 h-6 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg className="w-6 h-6 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
}

// ============================================================================
// Floating Hearts Background
// ============================================================================
function FloatingHearts() {
  const [hearts, setHearts] = useState<Array<{ id: number; left: number; delay: number; size: number }>>([]);
  
  useEffect(() => {
    const newHearts = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      size: Math.random() * 12 + 8
    }));
    setHearts(newHearts);
  }, []);
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute animate-float text-rose-500/20"
          style={{
            left: `${heart.left}%`,
            animationDelay: `${heart.delay}s`,
            fontSize: `${heart.size}px`
          }}
        >
          &#9829;
        </div>
      ))}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-float {
          animation: float 15s linear infinite;
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// Reason Card Component
// ============================================================================
function ReasonCard({ reason, index }: { reason: string; index: number }) {
  return (
    <div
      className="animate-on-scroll group relative p-6 bg-gradient-to-br from-rose-900/30 to-pink-900/20 border border-pink-500/10 rounded-xl hover:border-pink-500/30 transition-all duration-500 hover:scale-105"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="absolute top-4 right-4 text-4xl font-playfair text-rose-500/20 group-hover:text-rose-500/40 transition-colors">
        {index + 1}
      </div>
      <p className="font-inter text-pink-100/80 leading-relaxed pr-8">{reason}</p>
    </div>
  );
}

// ============================================================================
// Memory Card Component (with error handling for Google Drive images)
// ============================================================================
interface MemoryCardProps {
  memory: { url: string; caption: string };
  index: number;
  onClick: () => void;
}

function MemoryCard({ memory, index, onClick }: MemoryCardProps) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Fallback placeholder if image fails to load
  const placeholder = `https://placehold.co/400x400/1a0f14/e11d48?text=Memory+${index + 1}`;

  return (
    <div
      onClick={onClick}
      className="animate-on-scroll group relative aspect-square overflow-hidden rounded-xl cursor-pointer bg-rose-900/30"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {!imgLoaded && !imgError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <img
        src={imgError ? placeholder : memory.url}
        alt={memory.caption}
        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        loading="lazy"
        onLoad={() => setImgLoaded(true)}
        onError={() => {
          setImgError(true);
          setImgLoaded(true);
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <p className="absolute bottom-0 left-0 right-0 p-3 text-sm text-white font-inter opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {memory.caption}
      </p>
    </div>
  );
}

// ============================================================================
// Envelope Component
// ============================================================================
interface EnvelopeProps {
  isOpen: boolean;
  onOpen: () => void;
  letterText: string;
  senderName: string;
}

function Envelope({ isOpen, onOpen, letterText, senderName }: EnvelopeProps) {
  if (!isOpen) {
    return (
      <div className="animate-on-scroll flex flex-col items-center">
        <button
          onClick={onOpen}
          className="group relative w-48 h-32 md:w-64 md:h-44"
        >
          {/* Envelope body */}
          <div className="absolute inset-0 bg-gradient-to-b from-rose-800 to-rose-900 rounded-lg shadow-xl group-hover:shadow-rose-500/30 transition-all duration-500" />
          
          {/* Envelope flap */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-br from-rose-700 to-rose-800 rounded-t-lg origin-top transform transition-transform duration-500 group-hover:rotate-x-12" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
          
          {/* Wax seal */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <span className="text-2xl md:text-3xl">&#9829;</span>
          </div>
        </button>
        <p className="mt-6 text-pink-300/60 font-inter text-sm">Click to open</p>
      </div>
    );
  }
  
  return (
    <div className="animate-on-scroll bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-8 md:p-12 shadow-2xl max-w-2xl mx-auto">
      <div className="font-playfair text-amber-900/80 leading-relaxed whitespace-pre-line text-lg" style={{ fontStyle: 'italic' }}>
        {letterText}
      </div>
      <div className="mt-8 text-right">
        <p className="font-playfair text-2xl text-amber-800">{senderName}</p>
      </div>
    </div>
  );
}

// ============================================================================
// Lightbox Component
// ============================================================================
interface LightboxProps {
  memories: Array<{ url: string; caption: string }>;
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

function Lightbox({ memories, currentIndex, onClose, onNavigate }: LightboxProps) {
  const current = memories[currentIndex];
  const [imgError, setImgError] = useState(false);
  
  // Reset error state when navigating
  useEffect(() => {
    setImgError(false);
  }, [currentIndex]);
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(currentIndex - 1);
    if (e.key === 'ArrowRight' && currentIndex < memories.length - 1) onNavigate(currentIndex + 1);
  }, [currentIndex, memories.length, onClose, onNavigate]);
  
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  const placeholder = `https://placehold.co/800x600/1a0f14/e11d48?text=Memory+${currentIndex + 1}`;
  
  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      {currentIndex > 0 && (
        <button
          onClick={() => onNavigate(currentIndex - 1)}
          className="absolute left-4 p-2 text-white/70 hover:text-white transition-colors"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      
      {currentIndex < memories.length - 1 && (
        <button
          onClick={() => onNavigate(currentIndex + 1)}
          className="absolute right-4 p-2 text-white/70 hover:text-white transition-colors"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
      
      <div className="max-w-4xl max-h-[80vh] flex flex-col items-center">
        <img
          src={imgError ? placeholder : current.url}
          alt={current.caption}
          className="max-w-full max-h-[70vh] object-contain rounded-lg"
          onError={() => setImgError(true)}
        />
        <p className="mt-4 text-white/80 font-inter text-center">{current.caption}</p>
        <p className="mt-2 text-white/50 text-sm font-inter">
          {currentIndex + 1} / {memories.length}
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// Create Modal Component
// ============================================================================
interface CreateModalProps {
  onClose: () => void;
  onCopied: () => void;
}

function CreateModal({ onClose, onCopied }: CreateModalProps) {
  const [yourName, setYourName] = useState('');
  const [theirName, setTheirName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  
  const generateLink = () => {
    if (!yourName.trim() || !theirName.trim()) return;
    
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams({
      asker: yourName.trim(),
      partner: theirName.trim()
    });
    setGeneratedLink(`${baseUrl}?${params.toString()}`);
  };
  
  const copyLink = async () => {
    if (generatedLink) {
      await navigator.clipboard.writeText(generatedLink);
      onCopied();
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-gradient-to-br from-[#1a0f14] to-[#2a1520] border border-pink-500/20 rounded-2xl p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-playfair text-2xl text-pink-100 mb-6 text-center">
          Create Your Own Version
        </h3>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-pink-200/70 text-sm mb-2 font-inter">Your Name</label>
            <input
              type="text"
              value={yourName}
              onChange={(e) => setYourName(e.target.value)}
              className="w-full px-4 py-3 bg-rose-900/30 border border-pink-500/20 rounded-lg text-white font-inter focus:outline-none focus:border-pink-500/50"
              placeholder="Enter your name"
            />
          </div>
          
          <div>
            <label className="block text-pink-200/70 text-sm mb-2 font-inter">Their Name</label>
            <input
              type="text"
              value={theirName}
              onChange={(e) => setTheirName(e.target.value)}
              className="w-full px-4 py-3 bg-rose-900/30 border border-pink-500/20 rounded-lg text-white font-inter focus:outline-none focus:border-pink-500/50"
              placeholder="Enter their name"
            />
          </div>
        </div>
        
        {!generatedLink ? (
          <button
            onClick={generateLink}
            disabled={!yourName.trim() || !theirName.trim()}
            className="w-full py-3 bg-gradient-to-r from-rose-600 to-pink-600 rounded-lg font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            Generate Link
          </button>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-rose-900/30 rounded-lg">
              <p className="text-pink-200/70 text-xs break-all font-mono">{generatedLink}</p>
            </div>
            <button
              onClick={copyLink}
              className="w-full py-3 bg-gradient-to-r from-rose-600 to-pink-600 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Copy Link
            </button>
          </div>
        )}
        
        <button
          onClick={onClose}
          className="w-full mt-4 py-2 text-pink-300/60 hover:text-pink-300 transition-colors font-inter text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Celebration Overlay Component
// ============================================================================
interface CelebrationOverlayProps {
  config: Config;
  onClose: () => void;
}

function CelebrationOverlay({ config, onClose }: CelebrationOverlayProps) {
  const shareUrl = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent(`${config.partnerName} said yes! We're going to be valentines!`);
  
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#1a0f14] via-[#2a1520] to-[#1a0f14] flex items-center justify-center p-4 overflow-auto">
      <div className="text-center max-w-2xl">
        <div className="text-8xl mb-8 animate-bounce">&#9829;</div>
        
        <h2 className="font-playfair text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-rose-400 via-pink-300 to-amber-300 bg-clip-text text-transparent">
          {config.finalMessage}
        </h2>
        
        <p className="font-inter text-xl text-pink-200/80 mb-8">
          {config.dateIdea}
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <a
            href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#1DA1F2] rounded-full font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Share on Twitter
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#4267B2] rounded-full font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Share on Facebook
          </a>
          <a
            href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#25D366] rounded-full font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Share on WhatsApp
          </a>
        </div>
        
        <button
          onClick={onClose}
          className="px-8 py-3 border border-pink-400/30 rounded-full text-pink-300 hover:bg-pink-500/10 transition-colors font-inter"
        >
          Close
        </button>
      </div>
    </div>
  );
      }
