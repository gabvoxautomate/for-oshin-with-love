import { forwardRef, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import HTMLFlipBook from "react-pageflip";
import { bookPages, chapters, type BookPage } from "./bookContent";

type FlipBookApi = {
  pageFlip: () => {
    flipNext: () => void;
    flipPrev: () => void;
    turnToPage: (page: number) => void;
  } | undefined;
};

type FlipPageProps = {
  page: BookPage;
  active: boolean;
};

function Photo({ image, alt, active }: { image: string; alt: string; active: boolean }) {
  const [missing, setMissing] = useState(false);

  if (missing) {
    return (
      <div className="photo-missing" role="img" aria-label={alt}>
        <span aria-hidden="true">♡</span>
        <p>Photograph unavailable</p>
        <small>{image}</small>
      </div>
    );
  }

  return <img className={active ? "photo-active" : undefined} src={image} alt={alt} onError={() => setMissing(true)} />;
}

function TypedParagraph({ text, active, offset }: { text: string; active: boolean; offset: number }) {
  return (
    <p className={`typed-paragraph${active ? " typed-paragraph--active" : ""}`} aria-label={text}>
      <span className="visually-hidden">{text}</span>
      <span aria-hidden="true" className="typed-visual">
        {Array.from(text).map((character, index) => (
          <span
            className="typed-character"
            style={{ "--char-index": index + offset } as CSSProperties}
            key={`${text}-${index}`}
          >
            {character === " " ? "\u00A0" : character}
          </span>
        ))}
      </span>
    </p>
  );
}

function PageContent({ page, active }: FlipPageProps) {
  if (page.kind === "front-cover") {
    return (
      <div className="page-cover page-cover--front">
        <span className="cover-ornament">✦</span>
        <span className="cover-kicker">A birthday keepsake</span>
        <h2>For Oshin,<br /><em>With Love</em></h2>
        <span className="cover-rule" />
        <p>A story of friendship,<br />faith, and becoming.</p>
        <span className="cover-heart">♡</span>
      </div>
    );
  }

  if (page.kind === "back-cover") {
    return (
      <div className="page-cover page-cover--back">
        <span className="back-cover-flourish" aria-hidden="true">♡</span>
        <span className="back-cover-dedication">On behalf of your best friend</span>
        <strong>Timileyin</strong>
        <span className="back-cover-name">(Yahwe's D'light)</span>
        <span className="cover-rule" />
        <span className="back-cover-date">November 10, 2026</span>
      </div>
    );
  }

  if (page.kind === "memory") {
    return (
      <div className="chapter-page memory-page">
        <span className="eyebrow">A keepsake</span>
        <h2>{page.title}</h2>
        <div className="photo-frame">
          <Photo image={page.image} alt={page.alt} active={active} />
          <span className="photo-corner photo-corner--top" />
          <span className="photo-corner photo-corner--bottom" />
        </div>
      </div>
    );
  }

  if (page.kind === "chapter") {
    return (
      <div className="chapter-page">
        <span className="eyebrow">Chapter {page.chapter.number}</span>
        <h2>{page.chapter.title}</h2>
        <div className="photo-frame">
          <Photo image={page.chapter.image} alt={page.chapter.alt} active={active} />
          <span className="photo-corner photo-corner--top" />
          <span className="photo-corner photo-corner--bottom" />
        </div>
        <span className="chapter-caption">A moment, held in light</span>
      </div>
    );
  }

  const isFinal = page.chapter.number === 5 && page.paragraphs[0].startsWith("With love");
  let characterOffset = 0;

  return (
    <div className={`letter-page${isFinal ? " letter-page--final" : ""}`}>
      <span className="eyebrow">{page.chapter.title}</span>
      <div className="letter-copy">
        {page.paragraphs.map((paragraph, index) => {
          const offset = characterOffset;
          characterOffset += Array.from(paragraph).length + 6;
          return (
            <TypedParagraph
              active={active}
              text={paragraph}
              offset={offset}
              key={`${paragraph}-${index}`}
            />
          );
        })}
      </div>
      {isFinal && <span className="final-heart" aria-hidden="true">♡</span>}
    </div>
  );
}

const FlipPage = forwardRef<HTMLDivElement, FlipPageProps>(function FlipPage({ page, active }, ref) {
  const isCover = page.kind === "front-cover" || page.kind === "back-cover";

  return (
    <div className={`book-page${isCover ? " book-page--cover" : ""}`} data-density={isCover ? "hard" : "soft"} ref={ref}>
      <PageContent page={page} active={active} />
    </div>
  );
});

function findChapterForPage(index: number) {
  for (let pageIndex = index; pageIndex >= 0; pageIndex -= 1) {
    const page = bookPages[pageIndex];
    if (page?.kind === "chapter" || page?.kind === "text") return page.chapter;
  }
  return chapters[0]!;
}

function App() {
  const [opened, setOpened] = useState(false);
  const [opening, setOpening] = useState(false);
  const [coverTurned, setCoverTurned] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [closing, setClosing] = useState(false);
  const [bookAngle, setBookAngle] = useState(0);
  const [coverRotation, setCoverRotation] = useState({ x: 2, y: -12 });
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [bookSize, setBookSize] = useState({ width: 260, height: 400 });
  const bookRef = useRef<FlipBookApi>(null);
  const bookAreaRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const pointerStart = useRef<{ x: number; y: number; angle: number } | null>(null);
  const coverPointerStart = useRef<{ x: number; y: number; rotation: { x: number; y: number } } | null>(null);
  const shouldOpenCover = useRef(false);
  const currentPage = bookPages[pageIndex];
  const currentChapter = findChapterForPage(pageIndex);
  const isBackCover = currentPage?.kind === "back-cover";
  const storyPageCount = bookPages.length - 2;
  const shownStoryPage = Math.max(1, Math.min(storyPageCount, pageIndex));
  const progress = Math.max(1, Math.min(5, currentChapter.number));

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  useEffect(() => {
    const area = bookAreaRef.current;
    if (!area) return;

    const updateSize = () => {
      const bounds = area.getBoundingClientRect();
      const width = Math.max(220, Math.min(400, Math.floor(bounds.width - 4)));
      const height = Math.max(240, Math.min(bounds.height - 12, Math.floor(width * 1.42)));
      setBookSize((current) => (
        current.width === width && current.height === height ? current : { width, height }
      ));
    };

    const observer = new ResizeObserver(updateSize);
    observer.observe(area);
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, [opened]);

  useEffect(() => {
    if (!opened || !shouldOpenCover.current) return;
    let attempts = 0;
    const timer = window.setInterval(() => {
      const flip = bookRef.current?.pageFlip();
      if (flip) {
        shouldOpenCover.current = false;
        window.clearInterval(timer);
        flip.flipNext();
      } else if (attempts++ >= 40) {
        window.clearInterval(timer);
      }
    }, 100);
    return () => window.clearInterval(timer);
  }, [opened]);

  const startMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.42;
    audio.muted = muted;
    try {
      await audio.play();
      setMusicPlaying(true);
    } catch (error) {
      setMusicPlaying(false);
      console.error("Birthday music could not be played.", error);
    }
  };

  const openBook = () => {
    if (opening) return;
    setOpening(true);
    setCoverRotation({ x: 2, y: coverTurned ? 168 : -12 });
    shouldOpenCover.current = true;
    void startMusic();
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 650;
    window.setTimeout(() => {
      setOpened(true);
      setOpening(false);
    }, duration);
  };

  const closeBook = () => {
    setClosing(true);
    window.setTimeout(() => {
      bookRef.current?.pageFlip()?.turnToPage(0);
      setPageIndex(0);
      setOpened(false);
      setClosing(false);
    }, 550);
  };

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicPlaying) {
      audio.pause();
      setMusicPlaying(false);
    } else {
      await startMusic();
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.target instanceof Element && event.target.closest("button, .stf__parent")) return;
    pointerStart.current = { x: event.clientX, y: event.clientY, angle: bookAngle };
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const start = pointerStart.current;
    if (!start || event.buttons === 0) return;
    const horizontal = (event.clientX - start.x) * 0.18;
    const vertical = (event.clientY - start.y) * -0.1;
    setBookAngle(Math.max(-24, Math.min(24, start.angle + horizontal + vertical)));
  };

  const handlePointerEnd = () => {
    pointerStart.current = null;
  };

  const handleCoverPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    coverPointerStart.current = { x: event.clientX, y: event.clientY, rotation: coverRotation };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleCoverPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const start = coverPointerStart.current;
    if (!start || event.buttons === 0) return;
    const rotation = {
      x: Math.max(-35, Math.min(35, start.rotation.x - (event.clientY - start.y) * 0.35)),
      y: start.rotation.y + (event.clientX - start.x) * 0.55,
    };
    setCoverRotation(rotation);
    setCoverTurned(Math.cos(rotation.y * Math.PI / 180) < 0);
  };

  const handleCoverPointerEnd = () => {
    coverPointerStart.current = null;
  };

  const turnCover = () => {
    const showBack = Math.cos(coverRotation.y * Math.PI / 180) >= 0;
    setCoverTurned(showBack);
    setCoverRotation((rotation) => ({ ...rotation, y: showBack ? 168 : -12 }));
  };

  return (
    <main className="stage">
      <div className="stars" aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => (
          <span
            key={index}
            style={{
              "--left": `${(index * 37 + 11) % 100}%`,
              "--top": `${(index * 53 + 7) % 100}%`,
              "--delay": `${index * -0.61}s`,
            } as CSSProperties}
          />
        ))}
      </div>

      {!opened ? (
        <section className="welcome" aria-label="Birthday book cover">
          <div
            className="cover-scene"
            onPointerDown={handleCoverPointerDown}
            onPointerMove={handleCoverPointerMove}
            onPointerUp={handleCoverPointerEnd}
            onPointerCancel={handleCoverPointerEnd}
          >
            <div
              className={`cover-book${coverTurned ? " cover-book--back" : ""}${opening ? " cover-book--opening" : ""}`}
              style={{ transform: `rotateX(${coverRotation.x}deg) rotateY(${coverRotation.y}deg)` }}
            >
              <div className="cover-spine" />
              <div className="cover-face cover-face--front">
                <span className="cover-ornament">✦</span>
                <span className="cover-kicker">A birthday keepsake</span>
                <h1>For Oshin,<br /><em>With Love</em></h1>
                <span className="cover-rule" />
                <p>A story of friendship,<br />faith, and becoming.</p>
                <span className="cover-heart">♡</span>
              </div>
              <div className="cover-face cover-face--reverse">
                <span className="back-cover-flourish" aria-hidden="true">♡</span>
                <span className="back-cover-dedication">On behalf of your best friend</span>
                <strong>Timileyin</strong>
                <span className="back-cover-name">(Yahwe's D'light)</span>
                <span className="back-cover-date">November 10, 2026</span>
              </div>
              <div className="cover-pages" />
            </div>
          </div>
          <div className="welcome-copy">
            <p className="welcome-overline">A little something, just for you</p>
            <div className="cover-actions">
              <button className="text-button rotate-cover-button" onClick={turnCover}>
                {coverTurned ? "Show front cover" : "Turn book over"}
              </button>
              <button className="open-button" onClick={openBook} disabled={opening}>
                Open Your Gift <span aria-hidden="true">→</span>
              </button>
            </div>
            <p className="welcome-note">Best enjoyed one page at a time</p>
          </div>
        </section>
      ) : (
        <section className={`reader${closing ? " reader--closing" : ""}`} aria-label="Birthday book">
          <header className="reader-header">
            <button className="text-button return-button" onClick={closeBook} aria-label="Close book and return to cover">
              <span aria-hidden="true">‹</span> Cover
            </button>
            <div className="chapter-progress" aria-label={`Chapter ${progress} of 5`}>
              {chapters.map((chapter) => (
                <span className={chapter.number <= progress ? "active" : ""} key={chapter.number} />
              ))}
            </div>
            <div className="music-control">
              <button
                className="icon-button"
                onClick={() => void toggleMusic()}
                aria-label={musicPlaying ? "Pause birthday music" : "Play birthday music"}
                title={musicPlaying ? "Pause music" : "Play music"}
              >
                {musicPlaying ? "Ⅱ" : "♫"}
              </button>
              <button
                className={`icon-button${muted ? " is-muted" : ""}`}
                onClick={() => setMuted((value) => !value)}
                aria-label={muted ? "Unmute birthday music" : "Mute birthday music"}
                title={muted ? "Unmute" : "Mute"}
              >
                {muted ? "×" : "♪"}
              </button>
            </div>
          </header>

          <div className="book-tools">
            <button className="text-button rotate-book-button" onClick={() => setBookAngle((angle) => Math.max(-14, angle - 7))} aria-label="Rotate book left">
              ↶ <span>Rotate</span>
            </button>
            <button className="text-button reset-book-button" onClick={() => setBookAngle(0)} aria-label="Reset book angle">Reset view</button>
            <button className="text-button rotate-book-button" onClick={() => setBookAngle((angle) => Math.min(14, angle + 7))} aria-label="Rotate book right">
              <span>Rotate</span> ↷
            </button>
          </div>

          <div className="book-area" ref={bookAreaRef}>
            <div
              className="book-perspective"
              style={{ transform: `rotateY(${bookAngle}deg)` }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
            >
              <HTMLFlipBook
                ref={bookRef}
                key={`${bookSize.width}-${bookSize.height}`}
                className="flip-book"
                style={{}}
                width={bookSize.width}
                height={bookSize.height}
                size="fixed"
                minWidth={220}
                maxWidth={400}
                minHeight={240}
                maxHeight={680}
                startPage={pageIndex}
                drawShadow
                flippingTime={1000}
                usePortrait
                startZIndex={0}
                autoSize
                maxShadowOpacity={0.45}
                showCover
                mobileScrollSupport={false}
                swipeDistance={28}
                clickEventForward
                useMouseEvents
                showPageCorners
                disableFlipByClick={false}
                onFlip={(event: { data: number }) => setPageIndex(event.data)}
              >
                {bookPages.map((page, index) => (
                  <FlipPage page={page} active={index === pageIndex} key={`${page.kind}-${index}`} />
                ))}
              </HTMLFlipBook>
            </div>
          </div>

          <footer className="reader-footer">
            <button
              className="nav-button"
              onClick={() => bookRef.current?.pageFlip()?.flipPrev()}
              disabled={pageIndex === 0}
              aria-label="Previous page"
            >
              <span aria-hidden="true">←</span><span>Previous</span>
            </button>
            <span className="page-count">{shownStoryPage} <i>/</i> {storyPageCount}</span>
            {isBackCover ? (
              <button className="nav-button next-button" onClick={closeBook} aria-label="Close the book">
                <span>Close book</span><span aria-hidden="true">♡</span>
              </button>
            ) : (
              <button
                className="nav-button next-button"
                onClick={() => bookRef.current?.pageFlip()?.flipNext()}
                aria-label="Next page"
              >
                <span>Next</span><span aria-hidden="true">→</span>
              </button>
            )}
          </footer>
          {isBackCover && (
            <button className="read-again" onClick={() => bookRef.current?.pageFlip()?.turnToPage(1)}>
              Read again
            </button>
          )}
        </section>
      )}
      <audio
        ref={audioRef}
        src="/audio/birthday-music.mp3"
        loop
        preload="none"
        onError={() => {
          setMusicPlaying(false);
          console.error("Birthday music could not be loaded.");
        }}
        onPause={() => setMusicPlaying(false)}
        onPlay={() => setMusicPlaying(true)}
      />
    </main>
  );
}

export default App;
