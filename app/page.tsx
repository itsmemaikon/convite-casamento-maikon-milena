"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Clock3, ExternalLink, Heart, MapPin, Music2, Pause, Shirt, Sparkles } from "lucide-react";
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

function EnvelopeIntro({ onOpen }: { onOpen: () => void }) {
  const [opening, setOpening] = useState(false);
  function openInvitation() {
    if (opening) return;
    setOpening(true);
    window.setTimeout(onOpen, 1320);
  }
  return (
    <section className={`intro ${opening ? "is-opening" : ""}`} aria-label="Abertura do convite">
      <div className="intro-glow" aria-hidden="true" />
      <p className="intro-eyebrow">Você recebeu um convite</p>
      <button className="envelope-button" onClick={openInvitation} aria-label="Abrir o convite de casamento">
        <span className="envelope-scene" aria-hidden="true">
          <span className="invitation-peek"><span className="peek-monogram">{weddingData.monogram}</span><span className="peek-date">{weddingData.shortDate}</span></span>
          <span className="envelope-back" /><span className="envelope-letter" /><span className="envelope-front" /><span className="envelope-flap" />
          <span className="wax-seal"><span>{weddingData.monogram}</span></span>
        </span>
      </button>
      <button className="open-hint" onClick={openInvitation} tabIndex={opening ? -1 : 0}>
        <span>Toque para abrir</span><ChevronDown size={17} strokeWidth={1.5} />
      </button>
    </section>
  );
}

function MusicControl({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  const hasMusic = Boolean(weddingData.music);
  return <>
    <button className={`music-control ${playing ? "is-playing" : ""}`} onClick={onToggle} disabled={!hasMusic}
      aria-label={hasMusic ? (playing ? "Pausar música" : "Reproduzir música") : "Música ainda não configurada"}
      title={hasMusic ? (playing ? "Pausar música" : "Reproduzir música") : "Adicione a música no arquivo de configuração"}>
      {playing ? <Pause size={17} fill="currentColor" /> : <Music2 size={18} />}
      <span>{hasMusic ? (playing ? "Tocando" : "Música") : "Sem música"}</span>
    </button>
  </>;
}

function CalendarMark() {
  return <div className="calendar-mark" aria-label={`${weddingData.date}, ${weddingData.time}`}>
    <span>{weddingData.month}</span><strong>{weddingData.day}</strong><small>{weddingData.year}</small>
  </div>;
}

function Invitation() {
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  useRevealSections(opened);
  const whatsappUrl = useMemo(() => `https://wa.me/${weddingData.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(weddingData.whatsappMessage)}`, []);

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

  return <><audio ref={audioRef} src={weddingData.music || undefined} loop preload="none" />
  {!opened ? <EnvelopeIntro onOpen={openEnvelope} /> : <main className="invitation-page">
    <MusicControl playing={playing} onToggle={toggleMusic} />
    <section className="hero" aria-labelledby="couple-name">
      <div className="hero-arch" aria-hidden="true" />
      <div className="hero-content">
        <div className="monogram" aria-hidden="true">{weddingData.monogram}</div>
        <p className="eyebrow">Nosso casamento</p>
        <h1 id="couple-name"><span>{weddingData.bride}</span><i>&amp;</i><span>{weddingData.groom}</span></h1>
        <div className="gold-rule" aria-hidden="true"><Heart size={12} fill="currentColor" /></div>
        <p className="hero-message">{weddingData.message}</p>
        <a className="scroll-cue" href="#data" aria-label="Continuar para os detalhes"><span>Descubra os detalhes</span><ChevronDown size={19} /></a>
      </div>
    </section>

    <section className="story-section section-pad" data-reveal>
      <p className="eyebrow">Com alegria</p><h2>Escolhemos celebrar<br />o nosso amor</h2><p>{weddingData.invitationText}</p>
      <div className="signature-mark" aria-hidden="true">{weddingData.monogram}</div>
    </section>

    <section id="data" className="date-section section-pad" data-reveal><div className="date-card paper-card">
      <CalendarMark /><div className="date-copy"><p className="eyebrow">Reserve esta data</p><h2>{weddingData.date}</h2><p className="time-line"><Clock3 size={18} /> {weddingData.time}</p></div>
    </div></section>

    <section className="location-section section-pad" data-reveal>
      <div className="section-icon"><MapPin size={22} /></div><p className="eyebrow">Onde será</p><h2>{weddingData.venue}</h2><p>{weddingData.address}</p>
      <a className="button button-outline" href={weddingData.mapsUrl} target="_blank" rel="noreferrer">Ver localização <ExternalLink size={17} /></a>
    </section>

    <section className="details-section section-pad" data-reveal><p className="eyebrow">Para você se preparar</p><h2>Alguns detalhes</h2>
      <div className="details-grid">{weddingData.details.map((detail, index) => <article className="detail-card" key={detail.title}>
        <span className="detail-number">0{index + 1}</span><div className="detail-icon">{index === 0 ? <Shirt size={21} /> : index === 1 ? <MapPin size={21} /> : <Sparkles size={21} />}</div>
        <h3>{detail.title}</h3><p>{detail.text}</p>
      </article>)}</div>
    </section>

    <section className="rsvp-section section-pad" data-reveal><div className="rsvp-card paper-card">
      <div className="section-icon"><Check size={21} /></div><p className="eyebrow">Você faz parte deste dia</p><h2>Confirme sua presença</h2>
      <p>Conte para nós se você poderá celebrar esse momento ao nosso lado.</p>
      <a className="button button-primary" href={whatsappUrl} target="_blank" rel="noreferrer">Confirmar pelo WhatsApp</a>
      <small>Por favor, confirme até {weddingData.rsvpDeadline}.</small>
    </div></section>

    <footer><Heart size={17} fill="currentColor" aria-hidden="true" /><p>Esperamos você para brindar com a gente.</p><strong>{weddingData.bride} &amp; {weddingData.groom}</strong><span>{weddingData.year}</span></footer>
  </main>}</>;
}

export default function Home() { return <Invitation />; }
