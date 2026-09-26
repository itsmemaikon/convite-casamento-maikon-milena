"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarPlus, Check, ChevronDown, ChevronLeft, ChevronRight, Clock3, ExternalLink, Heart, MapPin, Music2, Pause, Shirt, Sparkles } from "lucide-react";
import { weddingData } from "../data/wedding-data";

function useRevealSections(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const items = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -6%" });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [enabled]);
}

const WRITING_INTERVAL = 145;
const toPublicAsset = (path: string) => path.startsWith("/") ? `.${path}` : path;
const splitGuestNames = (names: string) => names
  .split(/\s*(?:,|;|\/|\+|&|\be\b)\s*/i)
  .map((name) => name.trim())
  .filter(Boolean);

function HandwrittenLine({ text, className, startDelay }: { text: string; className: string; startDelay: number }) {
  const words = text.trim().split(/\s+/);
  let characterOffset = 0;

  return <span className={`writing-line ${className}`} aria-hidden="true">
    {words.map((word, wordIndex) => {
      const wordStart = characterOffset;
      characterOffset += word.length + 1;

      return <span key={`${word}-${wordIndex}`}>
        {wordIndex > 0 && " "}
        <span className="writing-word">
          {Array.from(word).map((character, index) => <span
            className="writing-character"
            style={{ animationDelay: `${startDelay + (wordStart + index) * WRITING_INTERVAL}ms` }}
            key={`${character}-${index}`}
          >{character}</span>)}
        </span>
      </span>;
    })}
  </span>;
}

function EnvelopeIntro({ onOpen, guestName, guestReady, multipleGuests }: { onOpen: () => void; guestName: string; guestReady: boolean; multipleGuests: boolean }) {
  const [opening, setOpening] = useState(false);
  const [flapBehind, setFlapBehind] = useState(false);
  const [letterInFront, setLetterInFront] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{ x: number; y: number; size: number; delay: number; duration: number }>>([]);
  const helloText = guestName ? weddingData.copy.intro.greetingWithGuest : weddingData.copy.intro.greetingWithoutGuest;
  const guestNames = splitGuestNames(guestName);
  const helloStart = 180;
  const nameStart = helloStart + Array.from(helloText).length * WRITING_INTERVAL + 260;
  const eyebrowStart = guestName
    ? nameStart + Array.from(guestName).length * WRITING_INTERVAL + 360
    : helloStart + Array.from(helloText).length * WRITING_INTERVAL + 360;

  useEffect(() => {
    setSparkles(Array.from({ length: 20 }, () => ({
      x: 4 + Math.random() * 92,
      y: 5 + Math.random() * 90,
      size: 5 + Math.random() * 6,
      delay: Math.random() * -6,
      duration: 3.4 + Math.random() * 3.2,
    })));
  }, []);
  function openInvitation() {
    if (opening) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setOpening(true);
    window.setTimeout(() => setFlapBehind(true), reducedMotion ? 0 : 460);
    window.setTimeout(() => setLetterInFront(true), reducedMotion ? 0 : 640);
    window.setTimeout(onOpen, reducedMotion ? 80 : 1650);
  }
  return (
    <section className={`intro ${opening ? "is-opening" : ""} ${flapBehind ? "flap-behind" : ""} ${letterInFront ? "letter-in-front" : ""}`} aria-label={weddingData.copy.intro.ariaLabel}>
      <div className="intro-glow" aria-hidden="true" />
      <div className="intro-sparkles" aria-hidden="true">
        {sparkles.map((sparkle, index) => <span className="intro-sparkle" key={index} style={{
          left: `${sparkle.x}%`,
          top: `${sparkle.y}%`,
          width: `${sparkle.size}px`,
          height: `${sparkle.size}px`,
          animationDelay: `${sparkle.delay}s`,
          animationDuration: `${sparkle.duration}s`,
        }} />)}
      </div>
      <img className="intro-floral intro-floral-top" src="./flores-envelope.webp" alt="" aria-hidden="true" />
      <img className="intro-floral intro-floral-bottom" src="./flores-envelope.webp" alt="" aria-hidden="true" />
      <div className={`intro-copy ${guestReady ? "is-ready" : ""}`}>
        <p className="intro-greeting" aria-label={guestName ? `${weddingData.copy.intro.greetingWithGuest} ${guestName}` : weddingData.copy.intro.greetingWithoutGuest}>
          <HandwrittenLine text={helloText} className="writing-hello" startDelay={helloStart} />
          {guestName && <strong className="intro-guest-names">
            {guestNames.map((name, index) => {
              const previousCharacters = guestNames.slice(0, index).reduce((total, previousName) => total + previousName.length + 1, 0);
              return <HandwrittenLine key={`${name}-${index}`} text={name} className="writing-name" startDelay={nameStart + previousCharacters * WRITING_INTERVAL} />;
            })}
          </strong>}
        </p>
        <p className="intro-eyebrow" style={{ animationDelay: `${eyebrowStart}ms` }}>{multipleGuests ? weddingData.copy.intro.receivedMultiple : weddingData.copy.intro.receivedSingle}</p>
      </div>
      <button className="envelope-button" onClick={openInvitation} aria-label={weddingData.copy.intro.openAriaLabel}>
        <span className="envelope-scene" aria-hidden="true">
          <span className="invitation-peek"><span className="peek-monogram">{weddingData.monogram}</span><span className="peek-date">{weddingData.shortDate}</span></span>
          <span className="envelope-back" /><span className="envelope-letter" /><span className="envelope-front" /><span className="envelope-flap" />
          <span className="wax-seal"><span>{weddingData.monogram}</span></span>
        </span>
      </button>
      <button className="open-hint" onClick={openInvitation} tabIndex={opening ? -1 : 0}>
        <span>{weddingData.copy.intro.openHint}</span><ChevronDown size={17} strokeWidth={1.5} />
      </button>
    </section>
  );
}

function MusicControl({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  const hasMusic = Boolean(weddingData.music);
  return <>
    <button className={`music-control ${playing ? "is-playing" : ""}`} onClick={onToggle} disabled={!hasMusic}
      aria-label={hasMusic ? (playing ? weddingData.copy.music.pauseAriaLabel : weddingData.copy.music.playAriaLabel) : weddingData.copy.music.unavailableAriaLabel}
      title={hasMusic ? (playing ? weddingData.copy.music.pauseAriaLabel : weddingData.copy.music.playAriaLabel) : weddingData.copy.music.unavailableHint}>
      {playing ? <Pause size={17} fill="currentColor" /> : <Music2 size={18} />}
      <span>{hasMusic ? (playing ? weddingData.copy.music.playing : weddingData.copy.music.paused) : weddingData.copy.music.unavailable}</span>
    </button>
  </>;
}

function CalendarMark() {
  return <div className="calendar-mark" aria-label={`${weddingData.date}, ${weddingData.time}`}>
    <span>{weddingData.month}</span><strong>{weddingData.day}</strong><small>{weddingData.year}</small>
  </div>;
}

type CountdownTime = { days: number; hours: number; minutes: number; seconds: number; finished: boolean };

function CountdownSection() {
  const [remaining, setRemaining] = useState<CountdownTime | null>(null);

  useEffect(() => {
    const targetDate = new Date(weddingData.countdownDate).getTime();
    const updateCountdown = () => {
      const difference = Math.max(targetDate - Date.now(), 0);
      setRemaining({
        days: Math.floor(difference / 86_400_000),
        hours: Math.floor((difference / 3_600_000) % 24),
        minutes: Math.floor((difference / 60_000) % 60),
        seconds: Math.floor((difference / 1_000) % 60),
        finished: difference === 0,
      });
    };

    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1_000);
    return () => window.clearInterval(interval);
  }, []);

  const units = [
    { label: weddingData.copy.countdown.days, value: remaining?.days },
    { label: weddingData.copy.countdown.hours, value: remaining?.hours },
    { label: weddingData.copy.countdown.minutes, value: remaining?.minutes },
    { label: weddingData.copy.countdown.seconds, value: remaining?.seconds },
  ];

  return <section className="countdown-section section-pad" data-reveal aria-labelledby="countdown-title">
    <p className="eyebrow">{weddingData.copy.countdown.eyebrow}</p>
    <h2 id="countdown-title">{weddingData.copy.countdown.title}</h2>
    <p className="countdown-intro">{weddingData.copy.countdown.intro}</p>
    {remaining?.finished ? <p className="countdown-finished">{weddingData.copy.countdown.finished}</p> : <div className="countdown-grid" role="timer" aria-label={weddingData.copy.countdown.ariaLabel}>
      {units.map((unit) => <div className="countdown-unit" key={unit.label}>
        <strong>{unit.value === undefined ? "--" : String(unit.value).padStart(2, "0")}</strong>
        <span>{unit.label}</span>
      </div>)}
    </div>}
  </section>;
}

function GallerySection() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const activeSlideRef = useRef(0);
  const ignoreScrollRef = useRef(false);
  const scrollResetRef = useRef<number | undefined>(undefined);
  const images = weddingData.galleryImages;

  function moveToSlide(index: number) {
    const nextIndex = (index + images.length) % images.length;
    activeSlideRef.current = nextIndex;
    setActiveSlide(nextIndex);
    ignoreScrollRef.current = true;
    if (scrollResetRef.current) window.clearTimeout(scrollResetRef.current);
    carouselRef.current?.scrollTo({ left: carouselRef.current.clientWidth * nextIndex, behavior: "smooth" });
    scrollResetRef.current = window.setTimeout(() => { ignoreScrollRef.current = false; }, 500);
  }

  useEffect(() => {
    if (images.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = window.setInterval(() => moveToSlide(activeSlideRef.current + 1), weddingData.copy.gallery.autoAdvanceMs);
    return () => {
      window.clearInterval(interval);
      if (scrollResetRef.current) window.clearTimeout(scrollResetRef.current);
    };
  }, [images.length]);

  if (!images.length) return null;

  function updateActiveSlide() {
    const carousel = carouselRef.current;
    if (!carousel || ignoreScrollRef.current) return;
    const nextIndex = Math.round(carousel.scrollLeft / carousel.clientWidth);
    activeSlideRef.current = nextIndex;
    setActiveSlide(nextIndex);
  }

  return <section className="gallery-section section-pad" data-reveal aria-labelledby="gallery-title">
    <p className="eyebrow">{weddingData.copy.gallery.eyebrow}</p>
    <h2 id="gallery-title">{weddingData.copy.gallery.titleFirstLine}<br />{weddingData.copy.gallery.titleSecondLine}</h2>
    <p className="gallery-intro">{weddingData.copy.gallery.intro}</p>
    <div className="gallery-carousel" aria-label={weddingData.copy.gallery.carouselAriaLabel}>
      <div className="gallery-track" ref={carouselRef} onScroll={updateActiveSlide}>
        {images.map((image, index) => {
          const caption = (image as { caption?: string }).caption;
          return <figure className="gallery-slide" key={image.src + index} aria-label={`${weddingData.copy.gallery.slideLabelPrefix} ${index + 1} ${weddingData.copy.gallery.slideLabelMiddle} ${images.length}`}>
            <img src={toPublicAsset(image.src)} alt={image.alt} loading={index === 0 ? "eager" : "lazy"} />
            {caption && <figcaption>{caption}</figcaption>}
          </figure>;
        })}
      </div>
      {images.length > 1 && <div className="gallery-controls">
        <button type="button" onClick={() => moveToSlide(activeSlide - 1)} aria-label={weddingData.copy.gallery.previousSlide}><ChevronLeft size={20} /></button>
        <span aria-live="polite">{activeSlide + 1} / {images.length}</span>
        <button type="button" onClick={() => moveToSlide(activeSlide + 1)} aria-label={weddingData.copy.gallery.nextSlide}><ChevronRight size={20} /></button>
      </div>}
    </div>
  </section>;
}

function Invitation() {
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [multipleGuests, setMultipleGuests] = useState(false);
  const [guestReady, setGuestReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  useRevealSections(opened);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rawName = params.get(weddingData.guestQueryParam) ?? params.get("nome") ?? "";
    const normalizedName = rawName.replace(/\s+/g, " ").trim().slice(0, 80);
    const detectedPlural = /(?:\s+e\s+|&|[,;/+]|\bfam[ií]lia\b)/i.test(normalizedName);
    const pluralParam = params.get("plural")?.trim().toLowerCase();
    const explicitPlural = pluralParam
      ? ["1", "true", "sim"].includes(pluralParam)
      : undefined;

    setGuestName(normalizedName);
    setMultipleGuests(explicitPlural ?? detectedPlural);
    setGuestReady(true);
  }, []);
  const whatsappUrl = useMemo(() => {
    const phone = weddingData.whatsappNumber.replace(/\D/g, "");
    return phone ? `https://wa.me/${phone}?text=${encodeURIComponent(weddingData.whatsappMessage)}` : "#";
  }, []);

  async function openEnvelope() {
    setOpened(true);
    if (weddingData.music && audioRef.current) {
      try { await audioRef.current.play(); setPlaying(true); } catch { setPlaying(false); }
    }
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "instant" }), 20);
  }
  async function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) { await audio.play(); setPlaying(true); }
    else { audio.pause(); setPlaying(false); }
  }

  return <><audio ref={audioRef} src={weddingData.music ? toPublicAsset(weddingData.music) : undefined} loop preload="none" />
  {!opened ? <EnvelopeIntro onOpen={openEnvelope} guestName={guestName} guestReady={guestReady} multipleGuests={multipleGuests} /> : <main className="invitation-page">
    <MusicControl playing={playing} onToggle={toggleMusic} />
    <section className="hero" aria-labelledby="couple-name">
      <div className="hero-photo-frame" aria-hidden="true">
        <img className="hero-photo" src="./foto-casal.jpg" alt="" />
      </div>
      <div className="hero-arch" aria-hidden="true" />
      <div className="hero-content">
        <div className="monogram" aria-hidden="true">{weddingData.monogram}</div>
        <p className="eyebrow">{weddingData.copy.hero.eyebrow}</p>
        <h1 id="couple-name"><p>{weddingData.bride}</p><p>&amp;</p><p>{weddingData.groom}</p></h1>
        <div className="gold-rule" aria-hidden="true"><Heart size={12} fill="currentColor" /></div>
        <div>
        <p className="hero-message">{weddingData.heroMessage1}</p>
        <p className="hero-message">{weddingData.heroMessage2}</p>
        </div>
      </div>
    </section>

    <section className="story-section section-pad" data-reveal>
      <p className="eyebrow">{weddingData.copy.story.eyebrow}</p><h2>{weddingData.copy.story.titleFirstLine}<br />{weddingData.copy.story.titleSecondLine}</h2><p>{weddingData.invitationText}</p>
      <div className="signature-mark" aria-hidden="true">{weddingData.monogram}</div>
    </section>

    <GallerySection />

    <section id="data" className="date-section section-pad" data-reveal><div className="date-card paper-card">
      <CalendarMark /><div className="date-copy"><p className="eyebrow">{weddingData.copy.date.eyebrow}</p><h2>{weddingData.date}</h2><p className="time-line"><Clock3 size={18} /> {weddingData.time}</p>
        <a className="calendar-link" href={toPublicAsset(weddingData.calendarFile)}><CalendarPlus size={18} /> {weddingData.copy.date.calendarLink}</a>
      </div>
    </div></section>

    <CountdownSection />

    <section className="location-section section-pad" data-reveal>
      <figure className="venue-photo-frame">
        <img src="./foto-local.jpg" alt={`${weddingData.copy.location.photoAltPrefix} ${weddingData.venue}`} loading="lazy" />
        <figcaption>{weddingData.copy.location.photoCaption}</figcaption>
      </figure>
      <div className="section-icon"><MapPin size={22} /></div><p className="eyebrow">{weddingData.copy.location.eyebrow}</p><h2>{weddingData.venue}</h2>{weddingData.venueRoom && <p className="venue-room">{weddingData.venueRoom}</p>}<p>{weddingData.address}</p>
      <a className="button button-outline" href={weddingData.mapsUrl} target="_blank" rel="noreferrer">{weddingData.copy.location.mapsLink} <ExternalLink size={17} /></a>
    </section>

    <section className="details-section section-pad" data-reveal><p className="eyebrow">{weddingData.copy.details.eyebrow}</p><h2>{weddingData.copy.details.title}</h2>
      <div className="details-grid">{weddingData.details.map((detail, index) => <article className="detail-card" key={detail.title}>
        <span className="detail-number">0{index + 1}</span><div className="detail-icon">{index === 0 ? <Shirt size={21} /> : index === 1 ? <MapPin size={21} /> : <Sparkles size={21} />}</div>
        <h3>{detail.title}</h3><p>{detail.text}</p>
      </article>)}</div>
    </section>

    <section className="rsvp-section section-pad" data-reveal><div className="rsvp-card paper-card">
      <div className="section-icon"><Check size={21} /></div><p className="eyebrow">{weddingData.copy.rsvp.eyebrow}</p><h2>{weddingData.copy.rsvp.title}</h2>
      <p>{weddingData.copy.rsvp.intro}</p>
      <a className={`button button-primary ${!weddingData.whatsappNumber ? "is-disabled" : ""}`} href={whatsappUrl}
        target={weddingData.whatsappNumber ? "_blank" : undefined} rel={weddingData.whatsappNumber ? "noreferrer" : undefined}
        aria-disabled={!weddingData.whatsappNumber} onClick={(event) => { if (!weddingData.whatsappNumber) event.preventDefault(); }}>
        {weddingData.whatsappNumber ? weddingData.copy.rsvp.confirmButton : weddingData.copy.rsvp.unavailableButton}
      </a>
      {weddingData.rsvpDeadline && <small>{weddingData.copy.rsvp.deadlinePrefix} {weddingData.rsvpDeadline}.</small>}
    </div></section>

    <footer><Heart size={17} fill="currentColor" aria-hidden="true" /><p>{weddingData.footerMessage}</p><strong>{weddingData.bride} &amp; {weddingData.groom}</strong><span>{weddingData.year}</span></footer>
  </main>}</>;
}

export default function Home() { return <Invitation />; }
