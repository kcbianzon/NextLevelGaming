import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  GameController,
  List,
  Pause,
  Play,
  Star,
  X,
} from '@phosphor-icons/react';
import FadeContent from './components/FadeContent';

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
    title: 'Gaming events',
    description: 'A room full of screens, friendly competition, and enough games for everyone to find their next favorite.',
    detail: 'Multiplayer setups · Giant screens · Every skill level',
    image: '/images/gaming-event.jpg',
    imageAlt: 'Guests playing multiplayer games on large screens at a Next Level Gaming event',
  },
  {
    eyebrow: '02 / TAKE THE STAGE',
    title: 'Esports tournaments',
    description: 'Turn the games everyone loves into a shared moment, with big-screen matches and a crowd behind every play.',
    detail: 'Tournament production · Live play · Event crew',
    image: '/images/esports-event.jpeg',
    imageAlt: 'Esports tournament setup with competitors, lighting, and a large match screen',
  },
  {
    eyebrow: '03 / MAKE IT YOURS',
    title: 'Movie & social nights',
    description: 'Bring people together around a giant screen, a custom event, and all the small details that make it yours.',
    detail: 'Outdoor cinema · Trivia · Social games',
    image: '/images/interactive-event.jpg',
    imageAlt: 'A live audience gathered together for an immersive event',
  },
];

const testimonials = [
  'Amazing experience from setup to the event itself. Everything felt professional and engaging.',
  'The whole room got involved. The screens, games, and crew made it a night to remember.',
  'A brilliant addition to our event. Easy to plan, great energy, and something for everyone.',
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
  const [paused, setPaused] = useState(false);
  const repeatedPartners = [...partners, ...partners];

  return (
    <section className="partners" aria-labelledby="partners-title">
      <div className="partners-heading wrap">
        <p className="eyebrow" id="partners-title">Trusted collaborators</p>
        <button
          className="marquee-control"
          type="button"
          aria-label={paused ? 'Resume moving partner logos' : 'Pause moving partner logos'}
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? <Play size={13} weight="fill" /> : <Pause size={13} weight="fill" />}
          <span>{paused ? 'Play' : 'Pause'}</span>
        </button>
      </div>
      <div className={`marquee${paused ? ' marquee--paused' : ''}`}>
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
          <a href="#experiences" onClick={closeMenu}>Events</a>
          <a href="#experiences" onClick={closeMenu}>Experiences</a>
          <a href="#novelties" onClick={closeMenu}>Novelties</a>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </nav>
        <div className="header-actions">
          <span className="booking-status"><i />Booking open</span>
          <button className="button button--primary button--small" onClick={onQuote} type="button">
            Get a quote <ArrowUpRight size={14} weight="bold" />
          </button>
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
            <button className="button button--primary form-submit" type="submit">Build my event <ArrowUpRight size={16} weight="bold" /></button>
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
        <div className="hero-copy">
          <p className="hero-kicker"><span className="kicker-line" />Gaming, entertainment &amp; interactive events</p>
          <h1 id="hero-title">Take your event<br />to the <span>next level.</span></h1>
          <p className="hero-description">Big-screen gaming and unforgettable event experiences, built around the people in the room.</p>
          <div className="hero-actions">
            <button className="button button--primary" onClick={onQuote} type="button">Plan your event <ArrowUpRight size={16} weight="bold" /></button>
            <a className="button button--outline" href="#experiences">Explore experiences <ArrowRight size={15} /></a>
          </div>
        </div>
        <a className="hero-scroll" href="#partners" aria-label="Scroll to trusted collaborators"><span>SCROLL TO EXPLORE</span><ArrowDown size={14} /></a>
        <span className="hero-index" aria-hidden="true">01 <i /> 06</span>
      </div>
    </section>
  );
}

function ExperienceSection() {
  const [active, setActive] = useState(0);
  const experience = experiences[active];
  const setIndex = (index) => setActive((index + experiences.length) % experiences.length);
  const previous = () => setIndex(active - 1);
  const next = () => setIndex(active + 1);

  return (
    <section className="experiences section-pad" id="experiences" aria-labelledby="experiences-title">
      <div className="wrap">
        <div className="section-topline" data-reveal>
          <p className="eyebrow">Your event. Your rules.</p>
          <span className="section-counter">01 — 03</span>
        </div>
        <div className="section-heading-row" data-reveal>
          <h2 className="section-title" id="experiences-title">Choose your<br className="mobile-break" /> <span>experience.</span></h2>
          <p className="section-intro">Bring the room together with the kind of event people talk about on the way home.</p>
        </div>
        <div className="experience-stage" data-reveal>
          <div className="experience-image-wrap">
            <img key={experience.image} className="experience-image" src={experience.image} alt={experience.imageAlt} />
            <div className="image-shade" />
            <p className="image-label"><span />Real events, real reactions</p>
            <p className="image-number">N° 0{active + 1}</p>
          </div>
          <div className="experience-copy" aria-live="polite">
            <p className="eyebrow experience-eyebrow">{experience.eyebrow}</p>
            <h3>{experience.title}</h3>
            <p className="experience-description">{experience.description}</p>
            <p className="experience-detail">{experience.detail}</p>
            <a className="text-link" href="#contact">Explore this experience <ArrowUpRight size={16} /></a>
            <div className="slider-controls">
              <div className="slider-dots" role="group" aria-label="Choose an event experience">
                {experiences.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    aria-label={`Show ${item.title}`}
                    aria-current={active === index ? 'true' : undefined}
                    className={`slider-dot${active === index ? ' slider-dot--active' : ''}`}
                    onClick={() => setIndex(index)}
                  />
                ))}
              </div>
              <div className="slider-arrows">
                <button type="button" onClick={previous} aria-label="Previous experience"><ArrowLeft size={17} /></button>
                <button type="button" onClick={next} aria-label="Next experience"><ArrowRight size={17} /></button>
              </div>
            </div>
          </div>
        </div>
        <div className="experience-tab-list" role="tablist" aria-label="Event experiences">
          {experiences.map((item, index) => (
            <button
              key={item.title}
              type="button"
              role="tab"
              aria-selected={active === index}
              className={`experience-tab${active === index ? ' experience-tab--active' : ''}`}
              onClick={() => setIndex(index)}
            >
              <span>0{index + 1}</span>{item.title}<ArrowUpRight size={15} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function DivisionSection() {
  return (
    <section className="division section-pad" id="novelties" aria-labelledby="division-title">
      <div className="wrap division-grid">
        <FadeContent blur={false} duration={0.8} delay={0.08}>
          <div className="division-image-frame">
            <img src="/images/esports-event.jpeg" alt="Players and spectators gathered around a tournament screen" loading="lazy" />
            <span className="photo-caption">THE GAMING DIVISION <i /> BUILT FOR THE WHOLE ROOM</span>
          </div>
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
  const [paused, setPaused] = useState(false);
  const cards = useMemo(() => [...testimonials, ...testimonials], []);

  return (
    <section className="testimonials section-pad" aria-labelledby="testimonials-title">
      <div className="wrap testimonial-heading" data-reveal>
        <p className="eyebrow">Good nights get talked about</p>
        <h2 className="section-title" id="testimonials-title">What our clients <span>say.</span></h2>
        <p className="section-intro">Feedback from event organizers who trusted us with their crowd.</p>
      </div>
      <div className={`testimonial-marquee${paused ? ' testimonial-marquee--paused' : ''}`}>
        <div className="testimonial-track">
          {cards.map((quote, index) => (
            <article className="testimonial-card" key={`${index}-${quote}`} aria-hidden={index >= testimonials.length}>
              <div className="testimonial-stars" aria-label="Five stars">{Array.from({ length: 5 }, (_, star) => <Star key={star} size={16} weight="fill" />)}</div>
              <blockquote>“{quote}”</blockquote>
              <span className="testimonial-mark"><GameController size={21} weight="duotone" /></span>
            </article>
          ))}
        </div>
      </div>
      <div className="wrap testimonial-controls">
        <span>GOOD TIMES, ON REPEAT</span>
        <button className="marquee-control" type="button" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
          {paused ? <Play size={13} weight="fill" /> : <Pause size={13} weight="fill" />}
          <span>{paused ? 'Play stories' : 'Pause stories'}</span>
        </button>
      </div>
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
          <a className="button button--outline" href="https://www.nextlevelgamingevents.com/" target="_blank" rel="noreferrer">Get to know us <ArrowUpRight size={15} /></a>
        </div>
        <FadeContent blur={false} duration={0.9} delay={0.12}>
          <figure className="about-image-frame">
            <img src="/images/interactive-event.jpg" alt="A crowd sharing a lively event moment" loading="lazy" />
            <figcaption><span>10+</span> YEARS MAKING MOMENTS</figcaption>
          </figure>
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
        <p className="eyebrow">The next great event starts here</p>
        <h2 id="cta-title">Ready to level up<br />your <span>event?</span></h2>
        <button className="button button--primary" onClick={onQuote} type="button">Build your event <ArrowUpRight size={17} weight="bold" /></button>
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
              <button className="button button--primary" type="button" onClick={onQuote}>Get a quote <ArrowRight size={15} /></button>
              <span><i /> Let’s make it a night to remember</span>
            </div>
          </div>
          <div className="footer-navs">
            <div><p>Events</p><a href="#experiences">Gaming events</a><a href="#experiences">Esports</a><a href="#experiences">Movie nights</a></div>
            <div><p>Experiences</p><a href="#experiences">Virtual reality</a><a href="#experiences">Social games</a><a href="#novelties">Novelties</a></div>
            <div><p>Company</p><a href="#about">About</a><a href="https://www.nextlevelgamingevents.com/" target="_blank" rel="noreferrer">Our story</a><a href="mailto:sales@nextlevelgamingevents.com">Contact</a></div>
          </div>
        </div>
        <div className="footer-wordmark" aria-label="Next Level">NEXT<span>LEVEL</span></div>
        <div className="footer-bottom"><span className="footer-symbol">///</span><span>Next Level Gaming Events</span><span className="footer-line" /><span>© {new Date().getFullYear()} Next Level Gaming Events</span><a href="#home">Back to top <ArrowUpRight size={12} /></a></div>
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
