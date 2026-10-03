import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  Accessibility, ChevronLeft, ChevronRight, Clock, Facebook, Instagram, Laptop, Leaf, MapPin,
  Menu as MenuIcon, MessageCircle, Moon, Music, Phone, Search, ShoppingBag, Star, Sun, X,
} from "lucide-react";
import hero from "@/assets/hero.jpg";
import chai from "@/assets/chai.jpg";
import pizza from "@/assets/pizza.jpg";
import shakes from "@/assets/shakes.jpg";
import music from "@/assets/music.jpg";
import laptop from "@/assets/laptop.jpg";
import { CAFE, COMBOS, HOURS, MENU, REVIEWS, SPECIALTIES, isOpenNow, jaipurNow } from "@/lib/cafe-data";

const TITLE = "The Chill Deck Rooftop Cafe — Pure Veg Rooftop Cafe in Raja Park, Jaipur";
const DESC =
  "Rooftop vibes & 100% vegetarian delights in Raja Park, Jaipur. Chai, shakes, pizzas, live acoustic nights. Rated 4.9. Open till 1 AM.";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: CAFE.name,
  description: CAFE.concept,
  servesCuisine: ["Vegetarian", "Continental", "Fast Food", "Chinese", "North Indian", "Beverages", "Desserts"],
  priceRange: "₹200–₹400",
  telephone: "+916375409049",
  address: {
    "@type": "PostalAddress",
    streetAddress: "402/3, Gali Number 2, Near Axis Bank, Rooftop, Raja Park",
    addressLocality: "Jaipur",
    addressRegion: "Rajasthan",
    postalCode: "302004",
    addressCountry: "IN",
  },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", bestRating: "5" },
  acceptsReservations: CAFE.reserve,
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday"], opens: "11:00", closes: "24:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Thursday", "Friday", "Saturday", "Sunday"], opens: "11:00", closes: "01:00" },
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "restaurant" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(JSON_LD) }],
  }),
  component: Index,
});

const NAV = [
  ["About", "about"], ["Menu", "menu"], ["Experience", "experience"], ["Reviews", "reviews"], ["Visit", "visit"],
] as const;

const GALLERY = [
  { src: hero, alt: "Rooftop deck lit with string lights at night overlooking Jaipur" },
  { src: chai, alt: "Kulhad masala chai and cappuccino at sunset" },
  { src: pizza, alt: "Vegetarian pizza and cheese garlic bread" },
  { src: music, alt: "Acoustic live music night on the rooftop" },
  { src: shakes, alt: "Oreo thick shake and virgin mint mojito" },
  { src: laptop, alt: "Laptop-friendly table with coffee at golden hour" },
];

/* ---------- helpers ---------- */

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function CountUp({ to, decimals = 0, prefix = "", suffix = "" }: { to: number; decimals?: number; prefix?: string; suffix?: string }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min((t - start) / 1400, 1);
        setV(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{prefix}{v.toFixed(decimals)}{suffix}</span>;
}

function Section({ id, eyebrow, title, children, className = "" }: { id: string; eyebrow: string; title: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`mx-auto max-w-6xl px-5 py-20 md:py-28 ${className}`}>
      <p className="reveal text-xs font-medium uppercase tracking-[0.3em] text-primary">{eyebrow}</p>
      <h2 className="reveal mt-3 text-4xl leading-tight md:text-5xl">{title}</h2>
      <div className="mt-10">{children}</div>
    </section>
  );
}

const btnPrimary = "inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:glow hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
const btnGhost = "inline-flex items-center justify-center gap-2 rounded-xl border border-foreground/30 px-6 py-3 font-medium text-foreground transition hover:border-primary hover:text-primary";

/* ---------- page ---------- */

function Index() {
  useReveal();
  const [open, setOpen] = useState<boolean | null>(null);
  useEffect(() => {
    const update = () => setOpen(isOpenNow());
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <main>
        <Hero open={open} />
        <About />
        <MenuSection />
        <Experience />
        <Gallery />
        <Reviews />
        <Visit open={open} />
      </main>
      <Footer />
      <div className="fixed bottom-5 right-4 z-40 flex flex-col gap-3 md:hidden">
        <a href={CAFE.whatsapp} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className="grid h-14 w-14 place-items-center rounded-full bg-secondary text-secondary-foreground glow">
          <MessageCircle />
        </a>
        <a href={CAFE.tel} aria-label="Call the cafe" className="grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground glow">
          <Phone />
        </a>
      </div>
    </div>
  );
}

function Wordmark() {
  return (
    <a href="#top" className="flex items-center gap-2">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-primary/50 text-primary glow">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M12 2v3M8 5h8l-1 3H9zM9 8c-1.5 1.5-2 3.5-2 6 0 3 2 6 5 6s5-3 5-6c0-2.5-.5-4.5-2-6" />
          <path d="M12 12v4" />
        </svg>
      </span>
      <span className="font-display text-xl leading-none">The Chill Deck</span>
    </a>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all ${scrolled || menu ? "glass border-b border-border" : ""}`}>
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4" aria-label="Main">
        <Wordmark />
        <ul className="hidden items-center gap-8 md:flex">
          {NAV.map(([l, id]) => (
            <li key={id}><a href={`#${id}`} className="text-sm text-foreground/80 transition hover:text-primary">{l}</a></li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <a href={CAFE.reserve} target="_blank" rel="noreferrer" className={`${btnPrimary} hidden !px-5 !py-2 text-sm sm:inline-flex`}>Book a Table</a>
          <button className="grid h-10 w-10 place-items-center rounded-lg border border-border md:hidden" aria-label={menu ? "Close menu" : "Open menu"} aria-expanded={menu} onClick={() => setMenu(!menu)}>
            {menu ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </nav>
      {menu && (
        <ul className="flex flex-col gap-1 px-5 pb-6 md:hidden">
          {NAV.map(([l, id]) => (
            <li key={id}><a href={`#${id}`} onClick={() => setMenu(false)} className="block rounded-lg px-3 py-3 text-lg hover:bg-muted">{l}</a></li>
          ))}
          <li className="pt-2"><a href={CAFE.reserve} target="_blank" rel="noreferrer" className={`${btnPrimary} w-full`}>Book a Table</a></li>
        </ul>
      )}
    </header>
  );
}

function OpenBadge({ open }: { open: boolean | null }) {
  if (open === null) return null;
  return (
    <span className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-xs font-medium ${open ? "border-success/50 text-success" : "border-destructive/50 text-destructive"}`}>
      <span className={`h-2 w-2 rounded-full ${open ? "animate-pulse bg-success" : "bg-destructive"}`} />
      {open ? "Open now" : "Closed now"}
    </span>
  );
}

function Hero({ open }: { open: boolean | null }) {
  const badges = ["⭐ 4.9 Rated", "🌱 100% Pure Veg", "🎶 Live Music", "🕐 Open till 1 AM"];
  return (
    <section id="top" className="relative flex min-h-[100svh] items-end overflow-hidden">
      <img src={hero} alt="The Chill Deck rooftop at night with string lights and Jaipur skyline" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 hero-overlay" />
      <div className="absolute inset-x-0 top-20 h-4 string-lights" aria-hidden />
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-32 md:pb-28">
        <OpenBadge open={open} />
        <h1 className="mt-5 max-w-3xl text-5xl leading-[1.05] md:text-7xl">
          Rooftop Vibes & <em className="text-primary">Vegetarian Delights</em> in Raja Park
        </h1>
        <p className="mt-5 max-w-xl text-lg text-foreground/85">Sip, snack and unwind under the open sky.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href="#menu" className={btnPrimary}>View Menu</a>
          <a href={CAFE.reserve} target="_blank" rel="noreferrer" className={btnGhost}>Book a Table</a>
        </div>
        <ul className="mt-10 flex flex-wrap gap-2">
          {badges.map((b) => (
            <li key={b} className="glass rounded-lg border border-border px-4 py-2 text-sm">{b}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function About() {
  return (
    <Section id="about" eyebrow="About us" title={<>A rooftop for every <em className="text-primary">kind of evening</em></>}>
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div className="reveal grid grid-cols-2 gap-4">
          <img src={chai} alt="Masala chai and cappuccino at sunset" loading="lazy" width={1024} height={1024} className="aspect-[3/4] w-full rounded-2xl object-cover" />
          <img src={laptop} alt="Laptop-friendly seating with coffee" loading="lazy" width={1024} height={1024} className="mt-10 aspect-[3/4] w-full rounded-2xl object-cover" />
        </div>
        <div className="reveal space-y-5 text-foreground/85">
          <p className="text-lg">{CAFE.concept}</p>
          <p>Our kitchen is 100% pure vegetarian — from ghar wali chai and hand-beaten desi coffee to cheesy pizzas, sizzlers and North Indian classics.</p>
          <p>Bring your laptop for a quiet afternoon, plan a date under warm ambient lights, or gather your friends for an acoustic night. Average cost: {CAFE.cost}.</p>
          <dl className="grid grid-cols-3 gap-4 pt-6">
            {[
              [<CountUp key="r" to={4.9} decimals={1} suffix="★" />, "Rating"],
              [<CountUp key="c" to={200} prefix="₹" suffix="+" />, "Per person"],
              [<CountUp key="m" to={100} suffix="+" />, "Menu items"],
            ].map(([n, l], i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-4 text-center">
                <dt className="sr-only">{l as string}</dt>
                <dd className="font-display text-3xl text-primary md:text-4xl">{n}</dd>
                <p className="mt-1 text-xs text-muted-foreground">{l as string}</p>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}

function MenuSection() {
  const [tab, setTab] = useState(MENU[0]!.id);
  const [q, setQ] = useState("");
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const query = q.trim().toLowerCase();

  const groups = useMemo(() => {
    const source = query ? MENU.flatMap((t) => t.groups.map((g) => ({ ...g, title: `${t.label} · ${g.title}` }))) : MENU.find((t) => t.id === tab)!.groups;
    return source.map((g) => ({ ...g, items: g.items.filter((i) => i.toLowerCase().includes(query)) })).filter((g) => g.items.length);
  }, [tab, query]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const n = (i + (e.key === "ArrowRight" ? 1 : -1) + MENU.length) % MENU.length;
    setTab(MENU[n]!.id);
    tabsRef.current[n]?.focus();
  };

  return (
    <Section id="menu" eyebrow="The menu" title={<>Everything here is <em className="text-primary">pure veg</em></>}>
      <div className="reveal relative mb-6 max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} aria-hidden />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the menu — try “paneer”" aria-label="Search the menu" className="w-full rounded-xl border border-input bg-card py-3 pl-11 pr-4 outline-none placeholder:text-muted-foreground focus:border-primary" />
      </div>
      {!query && (
        <div
          role="tablist"
          aria-label="Menu categories"
          className="grid grid-cols-2 gap-2 pb-2 sm:grid-cols-4 lg:flex lg:flex-nowrap lg:items-center lg:gap-1.5 xl:gap-2"
        >
          {MENU.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => {
                tabsRef.current[i] = el;
              }}
              role="tab"
              aria-selected={tab === t.id}
              tabIndex={tab === t.id ? 0 : -1}
              onKeyDown={(e) => onKey(e, i)}
              onClick={() => setTab(t.id)}
              className={`rounded-lg border px-2.5 py-2 text-center text-xs font-medium transition sm:text-sm lg:shrink-0 lg:whitespace-nowrap lg:px-2.5 lg:py-2 lg:text-xs xl:px-3.5 xl:text-sm ${
                tab === t.id
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card/60 text-foreground/80 hover:border-primary/60 hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
      <div key={tab + query} role="tabpanel" className="mt-8 grid gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500 md:grid-cols-2">
        {groups.length === 0 && <p className="text-muted-foreground">No items match “{q}”.</p>}
        {groups.map((g) => (
          <div key={g.title} className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-2xl">{g.title}</h3>
            <ul className="mt-4 divide-y divide-border">
              {g.items.map((item) => {
                const special = SPECIALTIES.some((s) => item.startsWith(s));
                return (
                  <li key={item} className="flex items-center justify-between gap-3 py-3">
                    <span className="flex min-w-0 items-center gap-3">
                      <Leaf size={16} className="shrink-0 text-success" aria-label="Vegetarian" />
                      <span className="truncate">{item}</span>
                    </span>
                    {special && <span className="shrink-0 rounded-md bg-primary/15 px-2.5 py-1 text-[11px] font-medium text-primary">Cafe Specialty</span>}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-muted-foreground">Prices available at the cafe / on Swiggy.</p>

      <h3 className="reveal mt-16 text-3xl">Combos</h3>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {COMBOS.map((c) => (
          <div key={c.name} className="reveal lift rounded-2xl border border-primary/30 bg-accent p-6">
            <p className="text-xs uppercase tracking-widest text-primary">{c.name}</p>
            <p className="mt-3 font-display text-xl leading-snug">{c.items}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Experience() {
  const tiles = [
    [Sun, "Open-Air Rooftop Seating", "Sunset to starlight on an open deck under warm ambient lights."],
    [Music, "Live Music & Acoustic Nights", "Unplugged evenings that make conversations linger."],
    [Laptop, "Work-Friendly Spot", "Laptop-friendly seating for focused afternoons."],
    [Moon, "Late-Night Dining", "Open till 1 AM, Thursday to Sunday."],
    [ShoppingBag, "Dine-in / Takeaway / Delivery", "Plus curbside pickup and online delivery."],
    [Accessibility, "Wheelchair Accessible", "Accessible entrance, seating, parking and restroom."],
  ] as const;
  return (
    <div className="border-y border-border bg-card/40">
      <Section id="experience" eyebrow="Experience" title={<>More than a cafe — <em className="text-primary">a mood</em></>}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map(([Icon, t, d]) => (
            <div key={t} className="reveal lift rounded-2xl border border-border bg-card p-6">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary"><Icon size={22} /></span>
              <h3 className="mt-5 text-xl">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
        <div className="reveal mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-secondary/40 px-6 py-5">
          <span className="text-xs uppercase tracking-widest text-secondary">Perfect for</span>
          <span className="font-display text-xl">Solo Work Sessions · Date Nights · Friend Groups · Birthday Hangouts</span>
        </div>
      </Section>
    </div>
  );
}

function Gallery() {
  const [idx, setIdx] = useState<number | null>(null);
  useEffect(() => {
    if (idx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIdx(null);
      if (e.key === "ArrowRight") setIdx((i) => (i! + 1) % GALLERY.length);
      if (e.key === "ArrowLeft") setIdx((i) => (i! - 1 + GALLERY.length) % GALLERY.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx]);
  return (
    <Section id="gallery" eyebrow="Gallery" title="Moments on the deck">
      <div className="columns-2 gap-4 md:columns-3">
        {GALLERY.map((g, i) => (
          <button key={i} onClick={() => setIdx(i)} className="reveal mb-4 block w-full overflow-hidden rounded-2xl" aria-label={`Open image: ${g.alt}`}>
            <img src={g.src} alt={g.alt} loading="lazy" className={`w-full object-cover transition duration-500 hover:scale-105 ${i % 3 === 0 ? "aspect-[3/4]" : "aspect-square"}`} />
          </button>
        ))}
      </div>
      {idx !== null && (
        <div role="dialog" aria-modal="true" aria-label="Image viewer" className="fixed inset-0 z-[60] grid place-items-center bg-background/95 p-4" onClick={() => setIdx(null)}>
          <img src={GALLERY[idx]!.src} alt={GALLERY[idx]!.alt} className="max-h-[85vh] max-w-full rounded-2xl" onClick={(e) => e.stopPropagation()} />
          <button className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-border" aria-label="Close" autoFocus onClick={() => setIdx(null)}><X /></button>
          <button className="absolute left-3 top-1/2 grid h-11 w-11 place-items-center rounded-full border border-border" aria-label="Previous" onClick={(e) => { e.stopPropagation(); setIdx((idx - 1 + GALLERY.length) % GALLERY.length); }}><ChevronLeft /></button>
          <button className="absolute right-3 top-1/2 grid h-11 w-11 place-items-center rounded-full border border-border" aria-label="Next" onClick={(e) => { e.stopPropagation(); setIdx((idx + 1) % GALLERY.length); }}><ChevronRight /></button>
        </div>
      )}
    </Section>
  );
}

function Reviews() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % REVIEWS.length), 6000);
    return () => clearInterval(id);
  }, []);
  const r = REVIEWS[i]!;
  return (
    <div className="border-y border-border bg-card/40">
      <Section id="reviews" eyebrow="Reviews" title={<><span className="text-primary">4.9 ★</span> and counting</>}>
        <p className="-mt-6 mb-8 text-sm text-muted-foreground">Sample reviews for demo purposes.</p>
        <div className="reveal mx-auto max-w-3xl rounded-3xl border border-border bg-card p-8 md:p-12" aria-live="polite">
          <div className="flex gap-1 text-primary">{Array.from({ length: 5 }).map((_, k) => <Star key={k} size={18} fill="currentColor" />)}</div>
          <blockquote key={i} className="mt-5 font-display text-2xl leading-snug animate-in fade-in duration-500 md:text-3xl">“{r.text}”</blockquote>
          <p className="mt-5 text-sm text-muted-foreground">— {r.who}</p>
          <div className="mt-8 flex items-center justify-between gap-4">
            <div className="flex gap-2">
              {REVIEWS.map((_, k) => (
                <button key={k} onClick={() => setI(k)} aria-label={`Show review ${k + 1}`} className={`h-2 rounded-full transition-all ${k === i ? "w-8 bg-primary" : "w-2 bg-foreground/30"}`} />
              ))}
            </div>
            <div className="flex gap-2">
              <button aria-label="Previous review" onClick={() => setI((i - 1 + REVIEWS.length) % REVIEWS.length)} className="grid h-10 w-10 place-items-center rounded-full border border-border hover:border-primary"><ChevronLeft size={18} /></button>
              <button aria-label="Next review" onClick={() => setI((i + 1) % REVIEWS.length)} className="grid h-10 w-10 place-items-center rounded-full border border-border hover:border-primary"><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <a href={CAFE.reserve} target="_blank" rel="noreferrer" className="text-primary underline-offset-4 hover:underline">Read more reviews on Swiggy →</a>
        </div>
      </Section>
    </div>
  );
}

function Visit({ open }: { open: boolean | null }) {
  const [today, setToday] = useState<number | null>(null);
  useEffect(() => setToday(jaipurNow().day), []);
  return (
    <Section id="visit" eyebrow="Visit us" title={<>Find us on the <em className="text-primary">rooftop</em></>}>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="reveal space-y-6">
          <p className="flex gap-3"><MapPin className="mt-1 shrink-0 text-primary" size={20} /> {CAFE.address}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href={CAFE.tel} className={btnPrimary}><Phone size={18} /> {CAFE.phone}</a>
            <a href={CAFE.whatsapp} target="_blank" rel="noreferrer" className={btnGhost}><MessageCircle size={18} /> WhatsApp</a>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center justify-between"><h3 className="flex items-center gap-2 text-xl"><Clock size={18} className="text-primary" /> Hours</h3><OpenBadge open={open} /></div>
            <table className="w-full text-sm">
              <tbody>
                {[1, 2, 3, 4, 5, 6, 0].map((d) => (
                  <tr key={d} className={d === today ? "font-medium text-primary" : "text-foreground/80"}>
                    <td className="py-1.5">{HOURS[d]!.day}{d === today && " · Today"}</td>
                    <td className="py-1.5 text-right">{HOURS[d]!.label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground"><span className="text-foreground">Payments:</span> UPI, cards & cash. <span className="text-foreground">Accessibility:</span> wheelchair-accessible entrance, seating, parking and restroom.</p>
        </div>
        <div className="reveal flex flex-col gap-4">
          <iframe title="Map to The Chill Deck Rooftop Cafe" src={CAFE.mapEmbed} loading="lazy" className="h-80 w-full flex-1 rounded-2xl border border-border lg:h-auto" referrerPolicy="no-referrer-when-downgrade" />
          <a href={CAFE.maps} target="_blank" rel="noreferrer" className={btnGhost}>Get Directions</a>
        </div>
      </div>
      <ReservationForm />
    </Section>
  );
}

function F({ name, label, errors, children }: { name: string; label: string; errors: Record<string, string>; children: ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block text-muted-foreground">{label}</span>
      {children}
      {errors[name] && <span className="mt-1 block text-xs text-destructive">{errors[name]}</span>}
    </label>
  );
}

function ReservationForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<string | null>(null);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as { name: string; phone: string; date: string; time: string; guests: string };
    const err: Partial<Record<"name" | "phone" | "date" | "time" | "guests", string>> = {};
    if (f.name.trim().length < 2) err.name = "Please enter your name.";
    if (!/^[6-9]\d{9}$/.test(f.phone.replace(/\D/g, "").slice(-10))) err.phone = "Enter a valid 10-digit mobile number.";
    if (!f.date) err.date = "Pick a date.";
    else if (new Date(f.date) < new Date(new Date().toDateString())) err.date = "Date can't be in the past.";
    if (!f.time) err.time = "Pick a time.";
    const g = Number(f.guests);
    if (!g || g < 1 || g > 30) err.guests = "Guests must be 1–30.";
    setErrors(err as Record<string, string>);
    if (Object.keys(err).length) return;
    setDone(f.name.split(" ")[0] ?? f.name);
    e.currentTarget.reset();
  };
  const field = "w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:border-primary";
  return (
    <div className="reveal mt-14 rounded-3xl border border-border bg-card p-6 md:p-10">
      <h3 className="text-3xl">Reservation inquiry</h3>
      <p className="mt-2 text-sm text-muted-foreground">Demo form — for instant bookings use <a href={CAFE.reserve} target="_blank" rel="noreferrer" className="text-primary hover:underline">Swiggy Dineout</a>.</p>
      {done ? (
        <div className="mt-8 rounded-2xl border border-success/40 p-6" role="status">
          <p className="font-display text-2xl">Thank you, {done}! 🌙</p>
          <p className="mt-2 text-muted-foreground">Your table request is noted. We'll call you shortly to confirm. See you on the deck!</p>
          <button onClick={() => setDone(null)} className="mt-4 text-sm text-primary hover:underline">Make another request</button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <F errors={errors} name="name" label="Name"><input name="name" className={field} autoComplete="name" /></F>
          <F errors={errors} name="phone" label="Phone"><input name="phone" type="tel" className={field} autoComplete="tel" /></F>
          <F errors={errors} name="guests" label="Number of guests"><input name="guests" type="number" min={1} max={30} defaultValue={2} className={field} /></F>
          <F errors={errors} name="date" label="Date"><input name="date" type="date" className={field} /></F>
          <F errors={errors} name="time" label="Time"><input name="time" type="time" className={field} /></F>
          <F errors={errors} name="note" label="Special request (optional)"><input name="note" className={field} placeholder="Birthday, window seat…" /></F>
          <div className="sm:col-span-2 lg:col-span-3"><button type="submit" className={btnPrimary}>Send request</button></div>
        </form>
      )}
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border pb-28 pt-14 md:pb-14">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-4">
        <div className="md:col-span-2">
          <Wordmark />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">Rooftop vibes & pure-veg delights under the open sky in Raja Park, Jaipur.</p>
          <div className="mt-5 flex gap-3">
            <a href="#" aria-label="Instagram (placeholder)" className="grid h-10 w-10 place-items-center rounded-full border border-border hover:border-primary hover:text-primary"><Instagram size={18} /></a>
            <a href="#" aria-label="Facebook (placeholder)" className="grid h-10 w-10 place-items-center rounded-full border border-border hover:border-primary hover:text-primary"><Facebook size={18} /></a>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          {NAV.map(([l, id]) => <li key={id}><a href={`#${id}`} className="text-foreground/80 hover:text-primary">{l}</a></li>)}
        </ul>
        <div className="space-y-2 text-sm text-foreground/80">
          <p>Mon–Wed · 11 AM – 12 AM</p>
          <p>Thu–Sun · 11 AM – 1 AM</p>
          <a href={CAFE.tel} className="block text-primary">{CAFE.phone}</a>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl px-5 text-xs text-muted-foreground">© 2026 The Chill Deck Rooftop Cafe. Demo website.</p>
    </footer>
  );
}
