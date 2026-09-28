import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  List,
  Star,
  X,
} from '@phosphor-icons/react';
import FadeContent from './components/FadeContent';
import ControllerParticles from './components/ControllerParticles';
import StarBorder from './components/StarBorder';

const partners = [
  { name: 'Harvard University', image: '/images/partners/harvard.png' },
  { name: 'Fisher College', image: '/images/partners/fisher-college.png' },
  { name: 'Boston University', image: '/images/partners/boston-university.png' },
  { name: 'New England College', image: '/images/partners/new-england-college.png' },
  { name: 'Brookdale Community College', image: '/images/partners/brookdale.png' },
  { name: 'Connecticut College', image: '/images/partners/connecticut-college.png' },
  { name: 'Framingham State University', image: '/images/partners/framingham-state.png' },
  { name: 'Emmanuel College', image: '/images/partners/emmanuel-college.png' },
];

const experiences = [
  {
    eyebrow: '01 / ALL PLAY, ALL NIGHT',
    title: 'Gaming event',
    description: 'Full-scale multiplayer setups, consoles and giant screens for any crowd.',
    detail: 'Multiplayer setups · Giant screens · Every skill level',
    image: '/images/gaming-event.jpg',
    imageAlt: 'Guests playing multiplayer games on large screens at a Next Level Gaming event',
  },
  {
    eyebrow: '02 / TAKE THE STAGE',
    title: 'Esports tournament',
    description: 'Turn the games everyone loves into a shared moment, with big-screen matches and a crowd behind every play.',
    detail: 'Tournament production · Live play · Event crew',
    image: '/images/esports-event.jpeg',
    imageAlt: 'Esports tournament setup with competitors, lighting, and a large match screen',
  },
  {
    eyebrow: '03 / MAKE IT YOURS',
    title: 'Outdoor movie night',
    description: 'Bring people together around a giant screen, a custom event, and all the small details that make it yours.',
    detail: 'Outdoor cinema · Trivia · Social games',
    image: '/images/interactive-event.jpg',
    imageAlt: 'A live audience gathered together for an immersive event',
  },
];

const testimonials = [
  {
    quote: 'Our students were completely engaged from the first game to the last. The crew made the whole night easy.',
    name: 'Campus event organizer',
  },
  {
    quote: 'The setup looked incredible, and the team kept everything running smoothly all evening.',
    name: 'Community event planner',
  },
  {
    quote: 'They brought the energy and equipment that made this an event people still talk about.',
    name: 'Event coordinator',
  },
  {
    quote: 'Professional, responsive, and great with our guests. We’re already planning the next one.',
    name: 'Organization host',
  },
];

function useReveal() {
  useEffect(() => {
    const items = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.14, rootMargin: '0px 0px -36px 0px' },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
}

function Brand({ footer = false }) {
  return (
    <a className={`brand${footer ? ' brand--footer' : ''}`} href="#home" aria-label="Next Level Gaming Events, home">
      <img src="/images/next-level-logo-cropped.png" alt="Next Level Gaming and Novelties" />
      <span className="brand-divider" aria-hidden="true" />
      <span className="brand-caption">GAMING<br />EVENTS</span>
    </a>
  );
}

function LogoMarquee() {
  const repeatedPartners = [...partners, ...partners];

  return (
    <section className="partners" aria-labelledby="partners-title">
      <div className="partners-heading wrap">
        <p className="eyebrow" id="partners-title">Trusted collaborations</p>
      </div>
      <div className="marquee">
        <div className="marquee-track">
          {repeatedPartners.map((partner, index) => (
            <div className="partner-mark" key={`${partner.name}-${index}`} aria-hidden={index >= partners.length}>
              <img src={partner.image} alt={index < partners.length ? partner.name : ''} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Header({ onQuote }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="header-inner wrap">
        <Brand />
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X size={21} /> : <List size={21} />}
        </button>
        <nav className={`primary-nav${menuOpen ? ' primary-nav--open' : ''}`} aria-label="Main navigation">
          <a href="#division" onClick={closeMenu}>Events</a>
          <a href="#experiences" onClick={closeMenu}>Experiences</a>
          <a href="https://www.nextlevelgamingevents.com/art" target="_blank" rel="noreferrer" onClick={closeMenu}>Novelties</a>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </nav>
        <div className="header-actions">
          <StarBorder className="button button--primary button--small" onClick={onQuote} type="button">
            Get a quote <ArrowUpRight size={14} weight="bold" />
          </StarBorder>
        </div>
      </div>
    </header>
  );
}

function QuoteDialog({ open, onClose }) {
  const firstInput = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    firstInput.current?.focus();
    const onKeyDown = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKeyDown);
    document.body.classList.add('dialog-open');
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('dialog-open');
    };
  }, [open, onClose]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const subject = `Event quote request — ${formData.get('experience')}`;
    const body = [
      `Name: ${formData.get('name')}`,
      `Email: ${formData.get('email')}`,
      `Experience: ${formData.get('experience')}`,
      `Event date: ${formData.get('date') || 'Flexible'}`,
      `Guests: ${formData.get('guests') || 'Not specified'}`,
      '',
      formData.get('message'),
    ].join('\n');
    window.location.href = `mailto:sales@nextlevelgamingevents.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setReady(true);
  };

  if (!open) return null;

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="quote-dialog" role="dialog" aria-modal="true" aria-labelledby="quote-title">
        <button className="dialog-close" type="button" onClick={onClose} aria-label="Close quote request"><X size={20} /></button>
        <p className="eyebrow">Start planning</p>
        <h2 id="quote-title">Let’s make it<br /><span>your event.</span></h2>
        {ready ? (
          <div className="quote-confirmation" role="status">
            <span className="confirmation-icon"><Check size={20} weight="bold" /></span>
            <div><strong>Your email app is ready.</strong><p>Finish sending your request there, and our event team can take it from here.</p></div>
          </div>
        ) : (
          <form className="quote-form" onSubmit={handleSubmit}>
            <div className="form-pair">
              <label>Name<input ref={firstInput} autoComplete="name" name="name" placeholder="Your name" required /></label>
              <label>Email<input autoComplete="email" name="email" type="email" placeholder="you@email.com" required /></label>
            </div>
            <div className="form-pair">
              <label>Event type<select name="experience" defaultValue="Gaming event"><option>Gaming event</option><option>Esports tournament</option><option>Movie night</option><option>Virtual reality</option><option>Something else</option></select></label>
              <label>Event date<input name="date" type="date" /></label>
            </div>
            <label>Tell us a little about it<textarea name="message" rows="3" placeholder="Where, when, and what are you dreaming up?" required /></label>
            <StarBorder className="button button--primary form-submit" type="submit">Build my event <ArrowUpRight size={16} weight="bold" /></StarBorder>
            <p className="form-note">This opens a pre-filled email in your email app. No information is sent from this page.</p>
          </form>
        )}
      </section>
    </div>
  );
}

function Hero({ onQuote }) {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero-content wrap">
        <ControllerParticles />
        <div className="hero-copy">
          <h1 id="hero-title">Take your event<br />to the next level.</h1>
          <p className="hero-description">Gaming, entertainment, and interactive experiences for unforgettable events.</p>
          <div className="hero-actions">
            <StarBorder className="button button--primary" onClick={onQuote} type="button">Plan your event <ArrowUpRight size={16} weight="bold" /></StarBorder>
            <a className="button button--outline" href="#division">Explore explanation <ArrowUpRight size={15} /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceSection() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const setIndex = (index) => setActive((index + experiences.length) % experiences.length);
  const previous = () => setIndex(active - 1);
  const next = () => setIndex(active + 1);
  const prevIndex = (active + experiences.length - 1) % experiences.length;
  const nextIndex = (active + 1) % experiences.length;
  const pointerStart = useRef(null);
  const didSwipe = useRef(false);

  useEffect(() => {
    if (isPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % experiences.length), 4800);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  return (
    <section className="experiences section-pad" id="experiences" aria-labelledby="experiences-title">
      <div className="wrap">
        <h2 className="experience-heading" id="experiences-title" data-reveal>Choose your experience</h2>
        <div
          className="experience-carousel"
          aria-roledescription="carousel"
          aria-label="Event experiences"
          onKeyDown={(event) => { if (event.key === 'ArrowLeft') previous(); if (event.key === 'ArrowRight') next(); }}
          onPointerEnter={() => setIsPaused(true)}
          onPointerLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false); }}
          onPointerDown={(event) => { pointerStart.current = event.clientX; didSwipe.current = false; setIsPaused(true); }}
          onPointerUp={(event) => { if (pointerStart.current !== null && Math.abs(event.clientX - pointerStart.current) > 45) { didSwipe.current = true; event.clientX < pointerStart.current ? next() : previous(); } pointerStart.current = null; }}
          tabIndex="0"
        >
          {[prevIndex, active, nextIndex].map((index, position) => {
            const item = experiences[index];
            return (
              <button
                key={item.title}
                className={`experience-card experience-card--${position === 1 ? 'active' : position === 0 ? 'previous' : 'next'}`}
                type="button"
                aria-label={`Show ${item.title}`}
                aria-current={position === 1 ? 'true' : undefined}
                onClick={() => { if (didSwipe.current) didSwipe.current = false; else if (position !== 1) setIndex(index); }}
                tabIndex={position === 1 ? -1 : 0}
              >
                <img src={item.image} alt={position === 1 ? item.imageAlt : ''} aria-hidden={position !== 1} />
                <span className="experience-card-shade" />
                {position === 1 && <span className="experience-card-caption"><strong>{item.title.split(' ')[0]} <i>{item.title.split(' ').slice(1).join(' ')}</i></strong><small>{item.description}</small></span>}
              </button>
            );
          })}
          <span className="experience-count" aria-live="polite">0{active + 1} <i /> 0{experiences.length}</span>
        </div>
      </div>
    </section>
  );
}

function DivisionSection() {
  return (
    <section className="division section-pad" id="division" aria-labelledby="division-title">
      <div className="wrap division-grid">
        <FadeContent blur={false} duration={0.8} delay={0.08}>
          <div className="division-image-frame photo-placeholder" role="img" aria-label="Gaming event photo placeholder"><span>Gaming event photo</span></div>
        </FadeContent>
        <div className="division-copy" data-reveal>
          <p className="eyebrow"><span className="eyebrow-rule" /> The gaming division</p>
          <h2 id="division-title">Level up the<br /><span>experience.</span></h2>
          <p>From multiplayer gaming to full-scale esports tournaments, we bring the screens, sound, lighting, and event crew to make every gathering feel like an occasion.</p>
          <a className="text-link" href="#experiences">Explore gaming events <ArrowRight size={16} /></a>
        </div>
      </div>
    </section>
  );
}

function TestimonialSection() {
  return (
    <section className="testimonials section-pad" aria-labelledby="testimonials-title">
      <div className="wrap testimonial-heading" data-reveal>
        <h2 className="section-title" id="testimonials-title">What our clients <span>say.</span></h2>
        <p className="section-intro">Feedback from event organizers who trusted us with their crowd.</p>
      </div>
      {[0, 1].map((row) => (
        <div className="testimonial-marquee" key={row}>
          <div className={`testimonial-track${row ? ' testimonial-track--reverse' : ''}`}>
            {[0, 1].map((copy) => (
              <div className="testimonial-group" key={copy} aria-hidden={copy === 1}>
                {testimonials.map((review, index) => (
                  <article className="testimonial-card" key={`${row}-${copy}-${index}`}>
                    <div className="testimonial-stars" aria-label="5 out of 5 stars">{Array.from({ length: 5 }, (_, star) => <Star key={star} size={16} weight="fill" />)}</div>
                    <blockquote>“{review.quote}”</blockquote>
                    <span className="testimonial-author">— {review.name}</span>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function AboutSection() {
  return (
    <section className="about section-pad" id="about">
      <div className="wrap about-grid">
        <div className="about-copy" data-reveal>
          <p className="eyebrow">Who we are</p>
          <h2>More than gaming.<br />It’s an <span>experience.</span></h2>
          <p>For over a decade, we’ve turned get-togethers into shared stories—from giant outdoor screens to esports stages. Every event is planned, staffed, and run by our own crew.</p>
          <a className="button button--outline" href="https://www.nextlevelgamingevents.com/" target="_blank" rel="noreferrer">Learn more <ArrowUpRight size={15} /></a>
        </div>
        <FadeContent blur={false} duration={0.9} delay={0.12}>
          <figure className="about-image-frame photo-placeholder" role="img" aria-label="Event photo placeholder"><figcaption>About us photo</figcaption></figure>
        </FadeContent>
      </div>
    </section>
  );
}

function ClosingCta({ onQuote }) {
  return (
    <section className="closing-cta" aria-labelledby="cta-title">
      <div className="cta-photo" aria-hidden="true" />
      <div className="closing-cta-inner wrap" data-reveal>
        <h2 id="cta-title">Ready to <span>level up</span><br />your event?</h2>
        <StarBorder className="button button--primary" onClick={onQuote} type="button">Build your event <ArrowUpRight size={17} weight="bold" /></StarBorder>
      </div>
      <div className="cta-frame" aria-hidden="true" />
    </section>
  );
}

function Footer({ onQuote }) {
  return (
    <footer className="footer" id="contact">
      <div className="footer-shell wrap">
        <div className="footer-top">
          <div className="footer-contact">
            <Brand footer />
            <p className="eyebrow">Ready to level up your event?</p>
            <a className="footer-email" href="mailto:sales@nextlevelgamingevents.com">sales@nextlevelgamingevents.com <ArrowUpRight size={19} /></a>
            <div className="footer-action-row">
              <StarBorder className="button button--primary" type="button" onClick={onQuote}>Get a quote <ArrowRight size={15} /></StarBorder>
              <span><i /> Let’s make it a night to remember</span>
            </div>
          </div>
          <div className="footer-navs">
            <div><p>Events</p><a href="#division">Gaming events</a><a href="#experiences">Movie nights</a><a href="#experiences">Trivia nights</a></div>
            <div><p>Experience</p><a href="#experiences">360 booth</a><a href="#experiences">Virtual reality</a><a href="#experiences">Just dance</a><a href="#experiences">Silent disco</a><a href="#experiences">Sim racing</a></div>
            <div><p>Company</p><a href="#about">About</a><a href="https://www.nextlevelgamingevents.com/art" target="_blank" rel="noreferrer">Novelties</a><a href="#contact">FAQ</a><a href="mailto:sales@nextlevelgamingevents.com">Contact</a></div>
          </div>
        </div>
        <div className="footer-wordmark" aria-label="Next Level">NEXT<span>LEVEL</span></div>
        <div className="footer-bottom"><span className="footer-symbol">///</span><span>Next Level Gaming Events</span><span className="footer-line" /><span>© {new Date().getFullYear()} Next Level Gaming Events</span></div>
      </div>
    </footer>
  );
}

export default function App() {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const openQuote = () => setQuoteOpen(true);
  const closeQuote = () => setQuoteOpen(false);
  useReveal();

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header onQuote={openQuote} />
      <main id="main">
        <Hero onQuote={openQuote} />
        <div id="partners"><LogoMarquee /></div>
        <ExperienceSection />
        <DivisionSection />
        <TestimonialSection />
        <AboutSection />
        <ClosingCta onQuote={openQuote} />
      </main>
      <Footer onQuote={openQuote} />
      <QuoteDialog open={quoteOpen} onClose={closeQuote} />
    </>
  );
}
