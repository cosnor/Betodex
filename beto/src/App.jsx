import React, { useState, useCallback, useEffect } from "react";
import {
  Sparkles, Lock, Star, Search, X, Trophy, Heart, Volume2, VolumeX,
  Layers, Palmtree, Users, Home as HomeIcon, GraduationCap, Cake, Plane,
  PawPrint, Gem, ArrowLeft, Share2, Hash, RefreshCcw,
} from "lucide-react";


const RARITIES = {
  "Común": { stars: 1, weight: 45, color: "#9C8BB4", glow: "0 0 0 rgba(0,0,0,0)" },
  "Poco Común": { stars: 2, weight: 27, color: "#9D6FE0", glow: "0 0 20px rgba(157,111,224,0.4)" },
  "Raro": { stars: 3, weight: 15, color: "#7B2FF7", glow: "0 0 26px rgba(123,47,247,0.5)" },
  "Épico": { stars: 4, weight: 9, color: "#B537F2", glow: "0 0 32px rgba(181,55,242,0.6)" },
  "Legendario": { stars: 5, weight: 3.3, color: "#FFC300", glow: "0 0 46px rgba(255,195,0,0.75)", special: true },
  "Rara Secreta": { stars: 6, weight: 0.7, color: "#FF2E9E", glow: "0 0 60px rgba(255,46,158,0.85)", special: true },
};

const COLLECTIONS = [
  // { id: "vacations", name: "Vacaciones", icon: Palmtree, color: "#B24BF3", dark: "#3A1052" },
  // { id: "family", name: "Familia", icon: HomeIcon, color: "#8E4FD1", dark: "#2E1350" },
  { id: "friends", name: "Amigos", icon: Users, color: "#5E3AA8", dark: "#231045" },
  { id: "university", name: "Universidad", icon: GraduationCap, color: "#6A3FC7", dark: "#26124A" },
  // { id: "birthdays", name: "Cumpleaños", icon: Cake, color: "#C13FCB", dark: "#3A1140" },
  { id: "travel", name: "Viajes", icon: Plane, color: "#6E5BD6", dark: "#251A4A" },
  { id: "beto", name: "Alberto", icon: PawPrint, color: "#9457A8", dark: "#2E1338" },
  { id: "pareja", name: "Pareja", icon: Gem, color: "#7A2CE0", dark: "#200A3D" },
];

const ACHIEVEMENTS_LIST = [
  { key: "firstPack", title: "Primer Sobre", desc: "Abre tu primer sobre de cartas." },
  { key: "firstLegendary", title: "Toque de Suerte", desc: "Consigue tu primera carta Legendaria o Rara Secreta." },
  { key: "fifty", title: "Coleccionista", desc: `Reúne ${Math.min(25, 40)} cartas distintas.` },
  { key: "complete", title: "Maestro del Betodex", desc: "Completa el álbum entero." },
  ...COLLECTIONS.map((c) => ({ key: `col-${c.id}`, title: `Colección: ${c.name}`, desc: `Completa todas las cartas de ${c.name}.` })),
];

const TITLES = {
  friends: [
    ["Cumpleaños de Claudia", "Patolandia", "Junio 2026", "No duraron ni treinta minutos", "Común"],
    ["Familia feliz en la playa", "Pradomar", "Mayo 2026", "Playa para sobrevivir a final de semestre", "Poco Común"],
    ["Beto y Brayan", "Pradomar", "Mayo 2026", "Foto exclusiva de dos individuos que no se toman fotos.", "Raro"],
    ["Sol Solecito", "Uninorte", "Fecha Desconocida", "¿Quién es el sol? ¿Qué es el sol? ¿Por qué es el sol?", "Poco Común"],
    ["Felicidad nonchalant", "Uninorte", "Fecha desconocida", "Una foto medio feliz y medio nonchalant", "Común"],
    ["IA con el legendario", "Uninorte", "Junio 2026", "El legendario y la IA, y Palencia.", "Rara Secreta"],
  ],
  university: [
    ["Frisbyyyyyyyyy", "Uninorte", "Fecha Desconocida", "Porque nadie lo hace como Frisby.", "Legendario"],
    ["Manes se enteran que hay un sol", "Uninorte", "Fecha desconocida", "Tienen solo como dos fotos donde están todos y una fue porque vieron un sol y decidieron que era el momento.", "Poco Común"],
    ["Alberto comiendo", "Uninorte", "Fecha desconocida", "Alberto comiendo porque Alberto es perfecto y hermoso.", "Común"],
    ["Alberto carreador", "Uninorte", "Fecha desconocida", "Alberto y dos alejandros. ¿Qué podría salir mal?", "Poco Común"],
    ["Pajareando", "Ciénaga", "2025", "Ver pelícanos culiando nunca fue tan divertido.", "Raro"],
    ["Pájaros sobrados", "Uninorte", "2025", "Mucha aura en una foto.", "Épico"],
    
  ],
  travel: [
    ["Dos estatuas más", "Quintas de San Pedro", "Marzo 2025", "Duramos como media hora para tomar esta foto.", "Legendaria"],
    ["Albeto en Pueblito Paisa", "Pueblito Paisa", "Enero 2026", "Tan bonito se ve.", "Común"],
    ["Albeto en Explora", "Parque Explora", "Enero 2026", "No se quería tomar la foto", "Común"],
    ["Albeto en metrocable", "Medellín", "Enero 2026", "El no estaba cagado.", "Épica"],
    ["Caminata en el Arví", "Parque Arví", "Enero 2026", "Caminamos y ya", "Raro"],
  ],
  beto: [
    ["Alberto caído", "Patolandia", "Junio 2026", "Se cayó.", "Común"],
    ["Alberto en Patolandia", "Patolandia", "Junio 2026", "Estaba en Patolandia.", "Común"],
    ["Alberto con Beanie", "Donde sus amiguitos", "Fecha desconocida", "Al parecer no estaba muy contento", "Común"],
    ["Alberto Mimido", "Sofá", "Fecha desconocida", "Tan bonito se ve durmiendo.", "Raro"],
    ["Alberto y compañía", "Cuarto de alberto", "Fecha desconocida", "Alberto no volverá a meter viejas a un cuarto, lo digo por Valencia", "Común"],
    ["Alberto valdupareando", "Restaurantico", "Fecha desconocida", "Foto de familia feliz", "Poco Común"],
    ["Mejores amiguitos", "Restaurantico", "Fecha desconocida", "Única foto de Valencia y Alberto.", "Legendario"],
    ["Alberto regalito", "Sofá", "Fecha desconocida", "Un albertico regalito", "Épico"],
    ["Alberto emo", "Espejo", "Fecha desconocida", "No quiero ver más esta foto", "Poco Común"],
    ["Alberto en Rusia", "Rusia", "Fecha desconocida", "Tomada por el fotógrafo de los mil nombres", "Rara Secreta"],

  ],
  pareja: [
    ["Alberto Simp", "Uninorte", "Noviembre 2025", "Alberto arrodillado por su ama.", "Común"],
    ["Albeto y Cami chiquitos", "Casa de Cami", "2023", "Foto de familia feliz", "Legendario"],
    ["Abracito IEEE", "Uninorte", "Noviembre 2025", "Esa mano.", "Raro"],
    ["Cami y Albeto", "Uninorte", "2026", "Alberto emputao.", "Épico"],
    ["Alberto y Cami en Manaure", "Manaure", "2026", "Foto favorita para mostrar a la familia", "Épico"],
    ["Alberto y Cami en Halloween", "Casa de Angélica", "Octubre 2025", "Alberto de vaquerito se ve muy wonito", "Común"]
  ],
};

const CARD_POOL = Object.entries(TITLES).flatMap(([colId, list], ci) =>
  list.map(([title, location, date, description, rarity], i) => ({
    id: `${colId}-${i + 1}`,
    number: ci * 5 + i + 1,
    title, location, date, description, rarity,
    collection: colId,
  }))
);
const TOTAL_CARDS = CARD_POOL.length;

const CUBE_COLORS = ["#FFC300", "#FF2E9E", "#B537F2", "#7B2FF7", "#9D4EDD", "#5A189A", "#E0AAFF", "#C77DFF", "#3B1360"];

const STORAGE_KEY = "betodexState";

function loadSavedState() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveState(state) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

/* ------------------------------------------------------------------ */
/*  FOTOS REALES — cómo vincularlas                                     */
/* ------------------------------------------------------------------ */
/*
  Esta app corre como un solo archivo, sin carpeta ni backend, así que no
  puede "leer" una carpeta del computador directamente. Hay dos formas de
  poner fotos reales de Alberto:

  1) MÁS FÁCIL — pega la URL de cada foto aquí abajo, usando el mismo "id"
     que tiene la carta (lo ves en TITLES: colección + posición, ej. la
     3ra foto de "family" es "family-3"). Puedes subir tus fotos a Google
     Drive, Imgur, GitHub, etc. y usar el link público, o usar una imagen
     en base64 si prefieres tenerlo todo en un solo archivo.

       const IMAGES = {
         "vacations-1": "https://tu-link.com/cartagena-sunset.jpg",
         "family-2":    "https://tu-link.com/nuevo-bebe.jpg",
       };

  2) SI CORRES ESTO COMO PROYECTO REAL (Vite/React fuera de Claude) —
     crea una carpeta /public/photos, pon ahí tus imágenes, y simplemente
     usa la ruta "/photos/nombre-de-archivo.jpg" como valor en IMAGES.

  Si una carta no tiene imagen en este mapa (o el link no carga), la app
  muestra automáticamente el ícono + degradado de reemplazo — nunca se
  rompe la vista.
*/
const IMAGES = {
    "beto-1": "/foticos/beto/beto-01.jpeg",
    "beto-2": "/foticos/beto/beto-02.jpeg",
    "beto-3": "/foticos/beto/beto-03.jpeg",
    "beto-4": "/foticos/beto/beto-04.jpeg",
    "beto-5": "/foticos/beto/beto-05.jpeg",
    "beto-6": "/foticos/beto/beto-06.jpeg",
    "beto-7": "/foticos/beto/beto-07.jpeg",
    "beto-8": "/foticos/beto/beto-08.jpeg",
    "beto-9": "/foticos/beto/beto-09.jpeg",
    "beto-10": "/foticos/beto/beto-10.jpeg",
    "friends-1": "/foticos/friends/friends-01.jpeg",
    "friends-2": "/foticos/friends/friends-02.jpeg",
    "friends-3": "/foticos/friends/friends-03.jpeg",
    "friends-4": "/foticos/friends/friends-04.jpeg",
    "friends-5": "/foticos/friends/friends-05.jpeg",
    "friends-6": "/foticos/friends/friends-06.jpeg",
    "university-1": "/foticos/university/university-01.jpeg",
    "university-2": "/foticos/university/university-02.jpeg",
    "university-3": "/foticos/university/university-03.jpeg",
    "university-4": "/foticos/university/university-04.jpeg",
    "university-5": "/foticos/university/university-05.jpeg",
    "university-6": "/foticos/university/university-06.jpeg",
    "pareja-1": "/foticos/pareja/pareja-01.jpeg",
    "pareja-2": "/foticos/pareja/pareja-02.jpeg",
    "pareja-3": "/foticos/pareja/pareja-03.jpeg",
    "pareja-4": "/foticos/pareja/pareja-04.jpeg",
    "pareja-5": "/foticos/pareja/pareja-05.jpeg",
    "pareja-6": "/foticos/pareja/pareja-06.jpg",
    "travel-1": "/foticos/travel/travel-01.jpeg",
    "travel-2": "/foticos/travel/travel-02.jpeg",
    "travel-3": "/foticos/travel/travel-03.jpeg",
    "travel-4": "/foticos/travel/travel-04.jpeg",
    "travel-5": "/foticos/travel/travel-05.jpeg",

};

const FUN_FACTS = [
  "Alberto gasta su dinero de forma completamente responsable en cubos.",
  "El morado es el color favorito de Alberto.",
  "El pokemon favorito de Alberto es Ninetales.",
  "Alberto es un pro máster en origami.",
  "Alberto usa Tidal, ¿quién usa Tidal?",
  "El jugador de fútbol favorito de Alberto es Neymar.",
  "Alberto alza el dedo para decir un dato random. Siempre dice datos random.",
  "Alberto estaba viciado al LOL y quiere recaer.",
  "Alberto es el hijo perdido de Eduardo Zurek.",
  "Alberto siempre dice que le va a ir mal y luego saca 4.9.",
  "Alberto fue la única persona que entendió PC2 con Zurek."
];

function weightedRarityRoll() {
  const total = Object.values(RARITIES).reduce((s, r) => s + r.weight, 0);
  let roll = Math.random() * total;
  for (const [name, r] of Object.entries(RARITIES)) {
    if (roll < r.weight) return name;
    roll -= r.weight;
  }
  return "Común";
}

function drawFiveCards() {
  return Array.from({ length: 5 }, () => {
    const rarity = weightedRarityRoll();
    const options = CARD_POOL.filter((c) => c.rarity === rarity);
    const pool = options.length ? options : CARD_POOL;
    return { ...pool[Math.floor(Math.random() * pool.length)], drawId: Math.random().toString(36).slice(2) };
  });
}

/* ------------------------------------------------------------------ */
/*  SMALL UI PRIMITIVES                                                 */
/* ------------------------------------------------------------------ */

function CubeMark({ size = 22 }) {
  return (
    <div className="cube-mark" style={{ width: size, height: size }}>
      {CUBE_COLORS.map((c, i) => (
        <span key={i} style={{ background: c }} />
      ))}
    </div>
  );
}

function Stars({ n, color }) {
  return (
    <span className="stat-pill stars-pill" style={{ borderColor: color, color }}>
      <Star size={11} fill={color} stroke="none" /> {n}
    </span>
  );
}

function CardPhoto({ card, collection, Icon, size, special }) {
  const [imgError, setImgError] = useState(false);
  const src = IMAGES[card.id];
  const showImage = src && !imgError;
  return (
    <div className="beto-photo" style={{ background: `radial-gradient(circle at 30% 20%, ${collection?.color}, ${collection?.dark} 75%)` }}>
      {showImage ? (
        <img src={src} alt={card.title} className="beto-photo-img" onError={() => setImgError(true)} />
      ) : (
        <Icon className="beto-photo-icon" size={size === "sm" ? 30 : 46} />
      )}
      {special && <div className="foil-sweep" />}
      <div className="dot-overlay" />
    </div>
  );
}

function CardFace({ card, size = "md", locked = false, onClick, dim }) {
  const collection = COLLECTIONS.find((c) => c.id === card.collection);
  const rarity = RARITIES[card.rarity];
  const Icon = collection?.icon || Gem;
  if (locked) {
    return (
      <div className={`beto-card locked size-${size}`} onClick={onClick}>
        <div className="locked-inner">
          <Lock size={size === "sm" ? 16 : 24} />
        </div>
      </div>
    );
  }
  return (
    <div
      className={`beto-card size-${size} ${rarity.special ? "special" : ""}`}
      onClick={onClick}
      style={{ "--rarity-glow": rarity.glow, "--rarity-color": rarity.color, opacity: dim ? 0.55 : 1 }}
    >
      <div className="beto-title-bar" style={{ background: collection?.color }}>
        <span className="beto-title-text">{card.title}</span>
        <div className="beto-badge"><Icon size={size === "sm" ? 12 : 15} /></div>
      </div>
      <CardPhoto card={card} collection={collection} Icon={Icon} size={size} special={rarity.special} />
      <div className="beto-stat-bar">
        <Stars n={rarity.stars} color={rarity.color} />
        <span className="stat-pill num-pill"><Hash size={10} />{String(card.number).padStart(3, "0")}</span>
      </div>
      {size === "lg" && (
        <div className="beto-meta">
          <span>{card.location}</span>
          <span>{card.date}</span>
        </div>
      )}
    </div>
  );
}

function ProgressBar({ pct }) {
  return (
    <div className="progress-track">
      <div className="progress-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  HOME                                                                */
/* ------------------------------------------------------------------ */

function Home({ owned, packsOpened, onOpenPack, onViewAlbum, onViewAchievements, unlockedCount }) {
  const collectedCount = Object.keys(owned).length;
  const pct = Math.round((collectedCount / TOTAL_CARDS) * 100);
  const [factIndex, setFactIndex] = useState(() => Math.floor(Math.random() * FUN_FACTS.length));
  const [spin, setSpin] = useState(false);

  const reroll = () => {
    setSpin(true);
    setFactIndex((i) => {
      let next = Math.floor(Math.random() * FUN_FACTS.length);
      while (next === i && FUN_FACTS.length > 1) next = Math.floor(Math.random() * FUN_FACTS.length);
      return next;
    });
    setTimeout(() => setSpin(false), 500);
  };

  return (
    <div className="page home-page">
      <div className="particles">
        {Array.from({ length: 16 }).map((_, i) => (
          <span key={i} className="particle" style={{
            left: `${(i * 41) % 100}%`,
            background: CUBE_COLORS[i % CUBE_COLORS.length],
            animationDelay: `${(i * 0.55) % 8}s`,
            animationDuration: `${8 + (i % 5)}s`,
          }} />
        ))}
      </div>

      {/* HERO — logo + title are the star of the show */}
      <div className="hero">
        <div className="hero-glow" />
        <div className="hero-cube"><CubeMark size={64} /></div>
        <h1 className="hero-title">BETODEX</h1>
        <p className="album-sub">La colección de cartas oficial de Alberto</p>
      </div>

      <div className="fun-fact-card">
        <div className="fun-fact-label">🎲 DATO CURIOSO DE ALBERTO</div>
        <p className="fun-fact-text">{FUN_FACTS[factIndex]}</p>
        <button className={`fact-reroll ${spin ? "spinning" : ""}`} onClick={reroll} title="Otro dato">↻ Otro dato</button>
      </div>

      <div className="home-actions">
        <button className="btn-primary" onClick={onOpenPack}>
          <Sparkles size={18} /> ABRIR SOBRE
        </button>
        <button className="btn-secondary" onClick={onViewAlbum}>
          <Layers size={18} /> VER BETODEX
        </button>
      </div>

      <button className="achievements-entry" onClick={onViewAchievements}>
        <Trophy size={16} /> Ver logros <span className="achievements-entry-count">{unlockedCount}/{ACHIEVEMENTS_LIST.length}</span>
      </button>

      <div className="progress-panel">
        <div className="progress-header">
          <span>COLECCIÓN COMPLETA</span>
          <span className="progress-count">{collectedCount} / {TOTAL_CARDS}</span>
        </div>
        <ProgressBar pct={pct} />
        <div className="progress-footnote">{pct}% completado · {packsOpened} sobre{packsOpened === 1 ? "" : "s"} abierto{packsOpened === 1 ? "" : "s"}</div>
      </div>

      <details className="home-stats">
        <summary className="home-stats-title">POR RAREZA</summary>
        {Object.entries(RARITIES).map(([name, r]) => {
          const count = CARD_POOL.filter((c) => c.rarity === name && owned[c.id]).length;
          const of = CARD_POOL.filter((c) => c.rarity === name).length;
          return (
            <div className="stat-row" key={name}>
              <span className="stat-swatch" style={{ background: r.color }} />
              <span className="stat-name" style={{ color: r.color }}>{name}</span>
              <span className="stat-count">{count}/{of}</span>
            </div>
          );
        })}
      </details>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PACK OPENING — Rubik's Cube booster                                 */
/* ------------------------------------------------------------------ */

function PackOpening({ onFinish, isOwnedBefore }) {
  const [stage, setStage] = useState("sealed"); // sealed -> scrambling -> revealing -> done
  const [drawn] = useState(() => drawFiveCards());
  const [flipped, setFlipped] = useState([]);
  const [current, setCurrent] = useState(0);
  const [exiting, setExiting] = useState(false);

  const handleTear = () => {
    if (stage !== "sealed") return;
    setStage("scrambling");
    setTimeout(() => setStage("revealing"), 950);
  };

  const flipCurrent = () => {
    if (flipped.includes(current)) return;
    setFlipped((f) => [...f, current]);
  };

  const goNext = () => {
    if (current < 4) {
      setExiting(true);
      setTimeout(() => {
        setCurrent((c) => c + 1);
        setFlipped([current + 1]);
        setExiting(false);
      }, 400);
    } else {
      setStage("done");
    }
  };

  const isSpecial = RARITIES[drawn[current]?.rarity]?.special;

  return (
    <div className="page pack-page">
      {(stage === "sealed" || stage === "scrambling") && (
        <div className="pack-stage">
          <p className="pack-hint">{stage === "sealed" ? "Toca el cubo para abrirlo" : "¡Resolviendo el cubo!"}</p>
          <div className={`rubik-pack ${stage}`} onClick={handleTear}>
            <div className="rubik-grid">
              {CUBE_COLORS.map((c, i) => (
                <span
                  key={i}
                  className="rubik-tile"
                  style={{ background: c, animationDelay: `${i * 0.06}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {stage === "revealing" && (
        <div className="reveal-stage">
          {isSpecial && !flipped.includes(current) && <div className="legendary-veil" />}
          <div className="reveal-track-single">
            <div className={`flip-card-large ${flipped.includes(current) ? "is-flipped" : ""} ${exiting ? "exiting" : ""}`} onClick={flipped.includes(current) ? undefined : flipCurrent}>
              <div className="flip-face flip-back">
                <CubeMark size={50} />
              </div>
              <div className="flip-face flip-front">
                <CardFace card={drawn[current]} size="lg" />
                {isOwnedBefore(drawn[current].id) && <div className="dup-badge">¡Repetida!</div>}
              </div>
            </div>
          </div>
          <div className="reveal-progress-dots">
            {drawn.map((_, i) => (
              <span key={i} className={`dot ${i === current ? "current" : ""} ${flipped.includes(i) ? "revealed" : ""}`} />
            ))}
          </div>
          <div className="reveal-controls">
            <span className="reveal-count">{current + 1} / 5</span>
            {flipped.includes(current) ? (
              <button className="btn-primary" onClick={goNext}>{current < 4 ? "Siguiente Carta" : "Finalizar"}</button>
            ) : (
              <button className="btn-secondary" onClick={flipCurrent}>Revelar</button>
            )}
          </div>
        </div>
      )}

      {stage === "done" && (
        <div className="pack-summary">
          <h2>¡Sobre Completo!</h2>
          <div className="summary-grid">
            {drawn.map((card) => (
              <CardFace key={card.drawId} card={card} size="sm" />
            ))}
          </div>
          <button className="btn-primary" onClick={() => onFinish(drawn)}>Agregar al Betodex</button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ALBUM                                                               */
/* ------------------------------------------------------------------ */

function Album({ owned, favorites, onBack, onSelect, flyIds }) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = CARD_POOL.filter((c) => {
    if (filter !== "all" && c.collection !== filter) return false;
    if (query && !c.title.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="page album-page">
      <div className="album-header">
        <button className="btn-icon" onClick={onBack}><ArrowLeft size={18} /></button>
        <h2>EL BETODEX</h2>
        <div className="album-search">
          <Search size={15} />
          <input placeholder="Buscar cartas…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      <div className="filter-row">
        <button className={`chip ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>Todas</button>
        {COLLECTIONS.map((c) => {
          const owned_n = CARD_POOL.filter((x) => x.collection === c.id && owned[x.id]).length;
          const of = CARD_POOL.filter((x) => x.collection === c.id).length;
          return (
            <button key={c.id} className={`chip ${filter === c.id ? "active" : ""}`} onClick={() => setFilter(c.id)}>
              {c.name} <span className="chip-count">{owned_n}/{of}</span>
            </button>
          );
        })}
      </div>

      <div className="album-grid">
        {filtered.map((card) => {
          const isOwned = !!owned[card.id];
          return (
            <div key={card.id} className={flyIds.includes(card.id) ? "fly-in" : ""} style={{ position: "relative" }}>
              <CardFace card={card} size="md" locked={!isOwned} onClick={() => isOwned && onSelect(card)} />
              {isOwned && favorites[card.id] && <Heart className="fav-pin" size={13} fill="#FF2E9E" stroke="#FF2E9E" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PHOTO MODAL — Full screen photo viewer                             */
/* ------------------------------------------------------------------ */

function PhotoModal({ card, onClose }) {
  const [imgError, setImgError] = useState(false);
  if (!card) return null;
  const collection = COLLECTIONS.find((c) => c.id === card.collection);
  const Icon = collection?.icon || Gem;
  const src = IMAGES[card.id];
  const showImage = src && !imgError;
  return (
    <div className="photo-modal-backdrop" onClick={onClose}>
      <button className="btn-icon photo-modal-close" onClick={onClose}><X size={24} /></button>
      <div className="photo-modal-container">
        {showImage ? (
          <img src={src} alt={card.title} className="photo-modal-img" onError={() => setImgError(true)} />
        ) : (
          <div className="photo-modal-icon-container" style={{ background: `radial-gradient(circle at 30% 20%, ${collection?.color}, ${collection?.dark} 75%)` }}>
            <Icon size={80} color="rgba(255,255,255,0.9)" />
          </div>
        )}
      </div>
      <div className="photo-modal-info">
        <h2>{card.title}</h2>
        <p>{card.location} · {card.date}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  CARD MODAL                                                         */
/* ------------------------------------------------------------------ */

function CardModal({ card, ownedInfo, onClose, favorite, onToggleFavorite, onPhotoClick }) {
  const [imgError, setImgError] = useState(false);
  if (!card) return null;
  const rarity = RARITIES[card.rarity];
  const collection = COLLECTIONS.find((c) => c.id === card.collection);
  const Icon = collection?.icon || Gem;
  const src = IMAGES[card.id];
  const showImage = src && !imgError;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <button className="btn-icon modal-close" onClick={onClose}><X size={18} /></button>
        <div className="modal-photo" style={{ background: `radial-gradient(circle at 30% 20%, ${collection?.color}, ${collection?.dark} 75%)`, boxShadow: `var(--rarity-glow)`, cursor: showImage ? 'pointer' : 'default' }} onClick={() => showImage && onPhotoClick(card)}>
          {showImage ? (
            <img src={src} alt={card.title} className="beto-photo-img" onError={() => setImgError(true)} />
          ) : (
            <Icon size={60} />
          )}
          {rarity.special && <div className="foil-sweep" />}
          <div className="dot-overlay" />
        </div>
        <div className="modal-body">
          <div className="modal-title-row">
            <h3>{card.title}</h3>
            <button className="btn-icon" onClick={onToggleFavorite}>
              <Heart size={18} fill={favorite ? "#FF2E9E" : "none"} stroke={favorite ? "#FF2E9E" : "currentColor"} />
            </button>
          </div>
          <Stars n={rarity.stars} color={rarity.color} />
          <p className="modal-desc">"{card.description}"</p>
          <div className="modal-meta-grid">
            <div><span>Ubicación</span><b>{card.location}</b></div>
            <div><span>Fecha</span><b>{card.date}</b></div>
            <div><span>Colección</span><b>{collection?.name}</b></div>
            <div><span>N.º de Carta</span><b>#{String(card.number).padStart(3, "0")}</b></div>
            <div><span>Veces Obtenida</span><b>{ownedInfo?.count || 1}</b></div>
            <div><span>Desbloqueada</span><b>{ownedInfo?.unlockedOn || "—"}</b></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ACHIEVEMENTS VIEW                                                   */
/* ------------------------------------------------------------------ */

function Achievements({ unlocked, onBack }) {
  const unlockedCount = ACHIEVEMENTS_LIST.filter((a) => unlocked[a.key]).length;
  return (
    <div className="page achievements-page">
      <div className="album-header">
        <button className="btn-icon" onClick={onBack}><ArrowLeft size={18} /></button>
        <h2>LOGROS</h2>
        <span className="achievements-tally">{unlockedCount} / {ACHIEVEMENTS_LIST.length}</span>
      </div>
      <div className="achievements-grid">
        {ACHIEVEMENTS_LIST.map((a) => {
          const isUnlocked = !!unlocked[a.key];
          return (
            <div key={a.key} className={`achievement-card ${isUnlocked ? "unlocked" : "locked"}`}>
              <div className="achievement-icon">
                {isUnlocked ? <Trophy size={22} /> : <Lock size={18} />}
              </div>
              <div className="achievement-body">
                <div className="achievement-title">{a.title}</div>
                <div className="achievement-desc">{a.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ACHIEVEMENT TOAST                                                   */
/* ------------------------------------------------------------------ */

function Toasts({ toasts }) {
  return (
    <div className="toast-stack">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          <Trophy size={16} color="#FFC300" />
          <div>
            <div className="toast-title">{t.title}</div>
            <div className="toast-sub">{t.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ROOT APP                                                            */
/* ------------------------------------------------------------------ */

export default function App() {
  const savedState = loadSavedState();
  const [view, setView] = useState("home");
  const [owned, setOwned] = useState(savedState?.owned || {});
  const [favorites, setFavorites] = useState(savedState?.favorites || {});
  const [packsOpened, setPacksOpened] = useState(savedState?.packsOpened || 0);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [achievements, setAchievements] = useState(savedState?.achievements || {});
  const [flyIds, setFlyIds] = useState([]);
  const [soundOn, setSoundOn] = useState(savedState?.soundOn ?? true);

  const pushToast = useCallback((title, sub) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, title, sub }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600);
  }, []);

  const isOwnedBefore = useCallback((id) => !!owned[id], [owned]);

  const checkAchievements = useCallback((nextOwned, nextPacksOpened, drawn) => {
    const unlocked = { ...achievements };
    const maybe = (key, cond, sub) => {
      if (cond && !unlocked[key]) {
        unlocked[key] = true;
        pushToast("Logro Desbloqueado", sub);
      }
    };
    maybe("firstPack", nextPacksOpened === 1, "Primer Sobre Abierto");
    maybe("firstLegendary", drawn.some((c) => c.rarity === "Legendario" || c.rarity === "Rara Secreta"), "Primera Legendaria Obtenida");
    maybe("fifty", Object.keys(nextOwned).length >= Math.min(25, TOTAL_CARDS), `${Math.min(25, TOTAL_CARDS)} Cartas Coleccionadas`);
    maybe("complete", Object.keys(nextOwned).length === TOTAL_CARDS, "¡Betodex Completo!");
    COLLECTIONS.forEach((c) => {
      const cardsInCollection = CARD_POOL.filter((x) => x.collection === c.id);
      const ownedInCollection = cardsInCollection.filter((x) => nextOwned[x.id]);
      maybe(`col-${c.id}`, ownedInCollection.length === cardsInCollection.length, `Colección ${c.name} Completa`);
    });
    setAchievements(unlocked);
  }, [achievements, pushToast]);

  const handlePackFinish = (drawn) => {
    const next = { ...owned };
    const newlyUnlocked = [];
    const today = new Date().toLocaleDateString("es-CO", { month: "short", year: "numeric" });
    drawn.forEach((c) => {
      if (next[c.id]) {
        next[c.id] = { ...next[c.id], count: next[c.id].count + 1 };
        pushToast("¡Repetida!", `${c.title} · x${next[c.id].count} en tu colección`);
      } else {
        next[c.id] = { count: 1, unlockedOn: today };
        newlyUnlocked.push(c.id);
      }
    });
    const nextPacksOpened = packsOpened + 1;
    setOwned(next);
    setPacksOpened(nextPacksOpened);
    setFlyIds(newlyUnlocked);
    checkAchievements(next, nextPacksOpened, drawn);
    setView("album");
    setTimeout(() => setFlyIds([]), 1400);
  };

  const toggleFavorite = (id) => setFavorites((f) => ({ ...f, [id]: !f[id] }));

  const resetCollection = () => {
    setOwned({});
    setFavorites({});
    setPacksOpened(0);
    setAchievements({});
    setSoundOn(true);
    setView("home");
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    pushToast("Datos reiniciados", "Tu Betodex se ha vaciado");
  };

  useEffect(() => {
    saveState({ owned, favorites, packsOpened, achievements, soundOn });
  }, [owned, favorites, packsOpened, achievements, soundOn]);

  return (
    <div className="beto-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bungee&family=Baloo+2:wght@400;500;600;700;800&family=Chakra+Petch:wght@500;600;700&display=swap');

        .beto-root {
          --ink: #150822;
          --ink-2: #1F0E33;
          --grid: #2A1442;
          --violet: #7B2FF7;
          --violet-2: #9D4EDD;
          --lavender: #E0AAFF;
          --gold: #FFC300;
          --neon: #FF2E9E;
          position: relative;
          min-height: 100vh;
          width: 100%;
          background:
            radial-gradient(circle at 15% 0%, rgba(157,111,224,0.22), transparent 45%),
            radial-gradient(circle at 90% 15%, rgba(255,46,158,0.10), transparent 40%),
            radial-gradient(circle at 50% 100%, rgba(255,195,0,0.06), transparent 55%),
            repeating-radial-gradient(circle at 0 0, transparent 0, transparent 11px, rgba(255,255,255,0.025) 12px),
            var(--ink);
          background-size: auto, auto, auto, 22px 22px, auto;
          color: var(--lavender);
          font-family: 'Baloo 2', sans-serif;
          overflow-x: hidden;
        }
        .beto-root * { box-sizing: border-box; }
        .beto-root button { font-family: inherit; cursor: pointer; }

        .page { max-width: 980px; margin: 0 auto; padding: 30px 20px 60px; position: relative; }

        /* ---------- LOGO / CUBE MARK ---------- */
        .cube-mark { display: grid; grid-template-columns: repeat(3,1fr); grid-template-rows: repeat(3,1fr); gap: 2px; border: 2px solid #000; border-radius: 5px; padding: 2px; background: #000; }
        .cube-mark span { border-radius: 1px; }

        /* ---------- HOME ---------- */
        .home-page { text-align: center; }
        .particles { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
        .particle { position: absolute; bottom: -10px; width: 7px; height: 7px; border: 2px solid #000; border-radius: 2px; opacity: 0.55; animation: floatUp linear infinite; }
        @keyframes floatUp {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.35; }
          100% { transform: translateY(-100vh) rotate(180deg); opacity: 0; }
        }
        .hero { position: relative; z-index: 1; padding: 18px 0 10px; }
        .hero-glow {
          position: absolute; left: 50%; top: 10px; width: 320px; height: 320px; transform: translateX(-50%);
          background: radial-gradient(circle, rgba(255,195,0,0.28), rgba(123,47,247,0.22) 45%, transparent 72%);
          filter: blur(6px); z-index: -1; animation: heroPulse 4s ease-in-out infinite;
        }
        @keyframes heroPulse { 0%,100% { opacity: 0.7; transform: translateX(-50%) scale(1); } 50% { opacity: 1; transform: translateX(-50%) scale(1.08); } }
        .hero-cube { display: flex; justify-content: center; margin-bottom: 14px; animation: heroCubeSpin 7s ease-in-out infinite; }
        @keyframes heroCubeSpin { 0%,100% { transform: rotate(-6deg); } 50% { transform: rotate(6deg); } }
        .hero-title {
          font-family: 'Bungee', cursive; font-size: clamp(46px, 11vw, 84px); letter-spacing: 2px; margin: 0;
          color: var(--gold); -webkit-text-stroke: 3px #000; text-shadow: 6px 6px 0 #000; line-height: 1;
        }
        .album-sub { font-family: 'Chakra Petch', monospace; color: var(--lavender); opacity: 0.65; margin: 12px 0 0; font-size: 13px; letter-spacing: 0.5px; }

        .fun-fact-card {
          max-width: 460px; margin: 26px auto 26px; padding: 18px 22px; position: relative; z-index: 1;
          background: var(--violet); border: 3px solid #000; border-radius: 16px; box-shadow: 6px 6px 0 #000;
          transform: rotate(-1deg);
        }
        .fun-fact-label { font-family: 'Chakra Petch', monospace; font-size: 11px; letter-spacing: 1.5px; color: #1A0E2E; font-weight: 700; margin-bottom: 8px; }
        .fun-fact-text { color: #fff; font-size: 14.5px; font-weight: 600; line-height: 1.4; margin: 0 0 12px; }
        .fact-reroll {
          font-family: 'Chakra Petch', monospace; font-size: 11px; font-weight: 700; letter-spacing: 0.5px;
          background: #000; color: var(--gold); border: none; border-radius: 8px; padding: 6px 12px;
        }
        .fact-reroll.spinning { animation: rerollSpin 0.5s ease; }
        @keyframes rerollSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .progress-panel {
          max-width: 420px; margin: 0 auto 16px; padding: 16px 20px; position: relative; z-index: 1;
          background: var(--ink-2); border: 3px solid #000; border-radius: 16px; box-shadow: 5px 5px 0 #000;
        }
        .progress-header { display: flex; justify-content: space-between; font-family: 'Chakra Petch', monospace; font-size: 11px; letter-spacing: 1px; color: var(--lavender); opacity: 0.7; margin-bottom: 9px; }
        .progress-count { color: var(--gold); font-weight: 700; }
        .progress-track { height: 12px; border-radius: 8px; background: rgba(0,0,0,0.4); border: 2px solid #000; overflow: hidden; }
        .progress-fill { height: 100%; border-radius: 6px; transition: width 0.6s ease; background: repeating-linear-gradient(135deg, var(--violet), var(--violet) 8px, var(--violet-2) 8px, var(--violet-2) 16px); box-shadow: 0 0 14px rgba(157,111,224,0.7); }
        .progress-footnote { margin-top: 8px; font-family: 'Chakra Petch', monospace; font-size: 10.5px; color: var(--lavender); opacity: 0.45; }

        .home-actions { display: flex; gap: 14px; justify-content: center; margin-bottom: 16px; position: relative; z-index: 1; flex-wrap: wrap; }
        .achievements-entry {
          display: inline-flex; align-items: center; gap: 8px; margin: 0 auto 26px; position: relative; z-index: 1;
          background: var(--ink-2); border: 2.5px solid #000; border-radius: 20px; padding: 8px 16px;
          font-family: 'Chakra Petch', monospace; font-size: 12px; color: var(--gold); font-weight: 700;
        }
        .achievements-entry-count { color: var(--lavender); opacity: 0.6; margin-left: 2px; }
        .btn-primary, .btn-secondary {
          border-radius: 14px; padding: 14px 24px; font-family: 'Chakra Petch', monospace; font-weight: 700; font-size: 14px;
          letter-spacing: 1px; display: inline-flex; align-items: center; gap: 8px; transition: transform 0.15s ease;
          border: 3px solid #000; box-shadow: 5px 5px 0 #000;
        }
        .btn-primary { background: var(--gold); color: #1A0E2E; }
        .btn-primary:hover { transform: translate(-2px,-2px); box-shadow: 7px 7px 0 #000; }
        .btn-primary:active { transform: translate(2px,2px); box-shadow: 2px 2px 0 #000; }
        .btn-secondary { background: var(--violet-2); color: #fff; }
        .btn-secondary:hover { transform: translate(-2px,-2px); box-shadow: 7px 7px 0 #000; }
        .btn-secondary:active { transform: translate(2px,2px); box-shadow: 2px 2px 0 #000; }
        .btn-secondary.full-width { width: 100%; justify-content: center; margin-top: 18px; }
        .btn-icon { background: var(--ink-2); border: 2px solid #000; border-radius: 10px; padding: 8px; color: var(--lavender); display: inline-flex; box-shadow: 3px 3px 0 #000; }
        .btn-icon:hover { transform: translate(-1px,-1px); }

        .home-stats { max-width: 420px; margin: 0 auto; padding: 12px 18px; position: relative; z-index: 1; background: rgba(255,255,255,0.02); border: 2px dashed rgba(255,255,255,0.15); border-radius: 14px; }
        .home-stats-title { font-family: 'Chakra Petch', monospace; font-size: 10.5px; letter-spacing: 2px; opacity: 0.45; margin-bottom: 4px; text-align: left; cursor: pointer; list-style: none; }
        .home-stats-title::-webkit-details-marker { display: none; }
        .home-stats[open] .home-stats-title { margin-bottom: 8px; }
        .home-stats .stat-row { font-size: 12px; }

        /* ---------- ACHIEVEMENTS ---------- */
        .achievements-tally { font-family: 'Chakra Petch', monospace; font-size: 12px; color: var(--gold); font-weight: 700; }
        .achievements-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; }
        .achievement-card { display: flex; gap: 12px; align-items: flex-start; padding: 14px 16px; background: var(--ink-2); border: 3px solid #000; border-radius: 14px; box-shadow: 4px 4px 0 #000; }
        .achievement-card.locked { opacity: 0.5; border-style: dashed; box-shadow: none; }
        .achievement-icon { width: 36px; height: 36px; min-width: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #000; color: var(--lavender); }
        .achievement-card.unlocked .achievement-icon { color: var(--gold); box-shadow: 0 0 14px rgba(255,195,0,0.5); }
        .achievement-title { font-family: 'Chakra Petch', monospace; font-weight: 700; font-size: 13px; color: #fff; margin-bottom: 4px; }
        .achievement-desc { font-size: 12px; color: rgba(224,170,255,0.6); line-height: 1.3; }
        .stat-row { display: flex; align-items: center; gap: 10px; padding: 6px 0; font-size: 13px; border-bottom: 1px dashed rgba(255,255,255,0.1); }
        .stat-row:last-child { border-bottom: none; }
        .stat-swatch { width: 10px; height: 10px; border-radius: 2px; border: 1.5px solid #000; }
        .stat-name { flex: 1; text-align: left; font-weight: 700; }
        .stat-count { font-family: 'Chakra Petch', monospace; opacity: 0.6; }

        /* ---------- CARD ---------- */
        .beto-card { position: relative; cursor: pointer; transition: transform 0.2s ease; display: flex; flex-direction: column; border: 3px solid #000; border-radius: 14px; overflow: hidden; background: var(--ink-2); box-shadow: 5px 5px 0 #000; }
        .beto-card:hover { transform: translate(-2px,-2px); box-shadow: 7px 7px 0 #000; }
        .size-sm { width: 104px; }
        .size-md { width: 100%; }
        .size-lg { width: 210px; }
        .beto-title-bar { display: flex; align-items: center; justify-content: space-between; padding: 5px 8px; border-bottom: 3px solid #000; }
        .beto-title-text { font-family: 'Bungee', cursive; font-size: 9px; color: #fff; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-shadow: 1px 1px 0 #000; }
        .size-lg .beto-title-text { font-size: 11px; }
        .beto-badge { width: 20px; height: 20px; min-width: 20px; border-radius: 50%; background: #000; color: var(--gold); display: flex; align-items: center; justify-content: center; border: 1.5px solid var(--gold); }
        .beto-photo { position: relative; aspect-ratio: 3/4; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.9); overflow: hidden; }
        .beto-photo-icon { opacity: 0.95; filter: drop-shadow(2px 2px 0 rgba(0,0,0,0.4)); }
        .beto-photo-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .dot-overlay { position: absolute; inset: 0; background-image: radial-gradient(rgba(0,0,0,0.35) 1.4px, transparent 1.4px); background-size: 9px 9px; opacity: 0.5; pointer-events: none; }
        .foil-sweep { position: absolute; inset: -40% -60%; background: linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%); animation: sweep 2.4s ease-in-out infinite; z-index: 1; }
        @keyframes sweep { 0% { transform: translateX(-60%); } 100% { transform: translateX(60%); } }
        .beto-stat-bar { display: flex; align-items: center; justify-content: space-between; gap: 6px; padding: 6px 8px; background: #000; }
        .stat-pill { display: inline-flex; align-items: center; gap: 3px; font-family: 'Chakra Petch', monospace; font-size: 10px; font-weight: 700; border: 1.5px solid; border-radius: 8px; padding: 2px 6px; background: rgba(0,0,0,0.4); }
        .num-pill { color: var(--lavender); border-color: var(--lavender); opacity: 0.8; }
        .beto-meta { display: flex; justify-content: space-between; font-family: 'Chakra Petch', monospace; font-size: 9.5px; color: rgba(224,170,255,0.6); padding: 0 8px 8px; }
        .beto-card.special { box-shadow: 5px 5px 0 #000, var(--rarity-glow); }
        .beto-card.special:hover { box-shadow: 7px 7px 0 #000, var(--rarity-glow); }

        .beto-card.locked .locked-inner {
          aspect-ratio: 3/4; background: repeating-linear-gradient(135deg, #1F1030, #1F1030 8px, #170B26 8px, #170B26 16px);
          display: flex; align-items: center; justify-content: center; color: rgba(224,170,255,0.3);
        }
        .beto-card.locked { border-style: dashed; box-shadow: none; }
        .beto-card.locked:hover { transform: none; }

        .fly-in { animation: flyIn 0.9s cubic-bezier(.2,.8,.2,1); }
        @keyframes flyIn { 0% { transform: scale(0.4) translateY(-80px) rotate(-8deg); opacity: 0; } 60% { transform: scale(1.08) rotate(3deg); opacity: 1; } 100% { transform: scale(1) rotate(0); } }
        .fav-pin { position: absolute; top: -6px; right: -6px; }

        /* ---------- PACK / RUBIK CUBE ---------- */
        .pack-page { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 78vh; }
        .pack-stage { display: flex; flex-direction: column; align-items: center; gap: 24px; }
        .pack-hint { font-family: 'Chakra Petch', monospace; color: var(--lavender); opacity: 0.6; font-size: 13px; letter-spacing: 1px; }
        .rubik-pack { cursor: pointer; animation: floatCube 3.2s ease-in-out infinite; }
        @keyframes floatCube { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-14px) rotate(2deg); } }
        .rubik-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 5px; padding: 10px; background: #000; border-radius: 18px; border: 4px solid #000; box-shadow: 8px 8px 0 rgba(0,0,0,0.6); }
        .rubik-tile { width: 58px; height: 58px; border-radius: 6px; border: 2.5px solid #000; }
        .rubik-pack.scrambling .rubik-tile { animation: scrambleFlash 0.28s steps(1) infinite; }
        @keyframes scrambleFlash {
          0% { background: var(--gold) !important; }
          20% { background: var(--neon) !important; }
          40% { background: #B537F2 !important; }
          60% { background: var(--violet) !important; }
          80% { background: var(--violet-2) !important; }
          100% { background: var(--lavender) !important; }
        }
        .rubik-pack.scrambling { animation: shake 0.28s ease-in-out infinite; }
        @keyframes shake { 0%,100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }

        .legendary-veil { position: fixed; inset: 0; background: radial-gradient(circle at 50% 40%, rgba(255,195,0,0.22), rgba(0,0,0,0.8) 70%); z-index: 0; animation: fadeIn 0.5s ease; pointer-events: none; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .reveal-stage { position: relative; z-index: 1; width: 100%; display: flex; flex-direction: column; align-items: center; gap: 26px; }
        .reveal-track { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
        .reveal-slot { transition: all 0.4s ease; }
        .reveal-slot.inactive { opacity: 0.35; transform: scale(0.85); }
        .reveal-slot.active { opacity: 1; transform: scale(1.05); }

        .flip-card { position: relative; width: 150px; height: 224px; perspective: 1000px; cursor: pointer; }
        .flip-face { position: absolute; inset: 0; backface-visibility: hidden; border-radius: 14px; transition: transform 0.6s cubic-bezier(.4,.2,.2,1); display: flex; align-items: center; justify-content: center; border: 3px solid #000; }
        .flip-back { background: var(--ink-2); transform: rotateY(0deg); box-shadow: 5px 5px 0 #000; }
        .flip-front { transform: rotateY(-180deg); border: none; }
        .flip-card.is-flipped .flip-back { transform: rotateY(180deg); }
        .flip-card.is-flipped .flip-front { transform: rotateY(0deg); }
        .dup-badge { position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); background: #000; border: 1.5px solid var(--neon); color: var(--neon); font-family: 'Chakra Petch', monospace; font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 8px; white-space: nowrap; z-index: 2; }
        
        .reveal-track-single { display: flex; align-items: center; justify-content: center; flex: 1; min-height: 500px; }
        .flip-card-large { position: relative; width: 320px; height: 480px; perspective: 1000px; cursor: pointer; transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        .flip-card-large.exiting { opacity: 0; transform: translateX(400px) rotateY(90deg); }
        .flip-card-large .flip-face { border-radius: 18px; border: 4px solid #000; display: flex; align-items: center; justify-content: center; }
        .flip-card-large .flip-back { background: var(--ink-2); transform: rotateY(0deg); box-shadow: 10px 10px 0 #000; }
        .flip-card-large .flip-front { transform: rotateY(-180deg); border: none; }
        .flip-card-large.is-flipped .flip-back { transform: rotateY(180deg); }
        .flip-card-large.is-flipped .flip-front { transform: rotateY(0deg); }
        .flip-card-large .beto-card { width: 100%; height: 100%; display: flex; flex-direction: column; }
        .flip-card-large .beto-photo { aspect-ratio: auto; flex: 1; }
        .flip-card-large .beto-title-text { white-space: normal; overflow: visible; text-overflow: clip; font-size: 14px; line-height: 1.3; }
        
        .reveal-progress-dots { display: flex; gap: 10px; justify-content: center; }
        .reveal-progress-dots .dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(224,170,255,0.3); border: 2px solid rgba(224,170,255,0.4); transition: all 0.3s ease; }
        .reveal-progress-dots .dot.current { background: var(--gold); border-color: var(--gold); box-shadow: 0 0 12px rgba(255,195,0,0.6); }
        .reveal-progress-dots .dot.revealed { background: var(--violet); border-color: var(--violet); }
        
        .reveal-controls { display: flex; align-items: center; gap: 16px; }
        .reveal-count { font-family: 'Chakra Petch', monospace; font-size: 12px; color: var(--lavender); opacity: 0.6; }

        .pack-summary { text-align: center; position: relative; z-index: 1; }
        .pack-summary h2 { font-family: 'Bungee', cursive; margin-bottom: 20px; color: var(--gold); font-size: 22px; -webkit-text-stroke: 1.5px #000; }
        .summary-grid { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 28px; }

        /* ---------- ALBUM ---------- */
        .album-header { display: flex; align-items: center; gap: 16px; margin-bottom: 22px; flex-wrap: wrap; }
        .album-header h2 { font-family: 'Bungee', cursive; color: var(--gold); flex: 1; min-width: 140px; font-size: 20px; -webkit-text-stroke: 1px #000; }
        .album-search { display: flex; align-items: center; gap: 8px; background: var(--ink-2); border: 2.5px solid #000; border-radius: 10px; padding: 8px 12px; color: rgba(224,170,255,0.6); min-width: 200px; }
        .album-search input { background: none; border: none; outline: none; color: var(--lavender); font-family: 'Baloo 2'; font-size: 13px; width: 100%; }

        .filter-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
        .chip { background: var(--ink-2); border: 2.5px solid #000; border-radius: 20px; padding: 7px 14px; font-family: 'Chakra Petch', monospace; font-size: 11px; color: var(--lavender); opacity: 0.75; transition: all 0.15s ease; }
        .chip.active { background: var(--violet); color: #fff; opacity: 1; box-shadow: 3px 3px 0 #000; }
        .chip-count { opacity: 0.7; margin-left: 4px; }

        .album-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(122px, 1fr)); gap: 18px; }

        /* ---------- MODAL ---------- */
        .modal-backdrop { position: fixed; inset: 0; background: rgba(5,3,10,0.8); backdrop-filter: blur(6px); z-index: 50; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.2s ease; }
        .modal-panel { max-width: 420px; width: 100%; padding: 0; overflow: hidden; position: relative; max-height: 88vh; overflow-y: auto; background: var(--ink-2); border: 3px solid #000; border-radius: 18px; box-shadow: 8px 8px 0 #000; }
        .modal-close { position: absolute; top: 12px; right: 12px; z-index: 2; }
        .modal-photo { aspect-ratio: 16/9; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; border-bottom: 3px solid #000; }
        .modal-body { padding: 22px 24px 26px; }
        .modal-title-row { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
        .modal-title-row h3 { font-family: 'Bungee', cursive; font-size: 16px; color: #fff; }
        .modal-desc { color: rgba(224,170,255,0.75); font-style: italic; margin: 14px 0; font-size: 14px; }
        .modal-meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 18px; font-family: 'Chakra Petch', monospace; font-size: 12px; }
        .modal-meta-grid span { display: block; color: rgba(224,170,255,0.45); margin-bottom: 2px; }

        /* ---------- PHOTO MODAL ---------- */
        .photo-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.95); z-index: 60; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.2s ease; }
        .photo-modal-close { position: absolute; top: 20px; right: 20px; z-index: 61; background: rgba(0,0,0,0.5) !important; box-shadow: none !important; }
        .photo-modal-container { position: relative; width: 90vw; height: 90vh; display: flex; align-items: center; justify-content: center; }
        .photo-modal-img { max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 12px; }
        .photo-modal-icon-container { width: 300px; height: 300px; display: flex; align-items: center; justify-content: center; border-radius: 12px; box-shadow: 0 0 40px rgba(255,195,0,0.3); }
        .photo-modal-info { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); text-align: center; color: #fff; z-index: 61; max-width: 80%; }
        .photo-modal-info h2 { font-family: 'Bungee', cursive; font-size: 24px; margin-bottom: 8px; -webkit-text-stroke: 1px #000; }
        .photo-modal-info p { font-family: 'Chakra Petch', monospace; font-size: 12px; opacity: 0.8; }

        /* ---------- TOASTS ---------- */
        .toast-stack { position: fixed; top: 20px; right: 20px; display: flex; flex-direction: column; gap: 10px; z-index: 100; }
        .toast { display: flex; align-items: center; gap: 10px; padding: 12px 16px; animation: slideIn 0.3s ease; max-width: 260px; background: var(--ink-2); border: 2.5px solid #000; border-radius: 12px; box-shadow: 5px 5px 0 #000; }
        @keyframes slideIn { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .toast-title { font-family: 'Chakra Petch', monospace; font-size: 11px; font-weight: 700; color: var(--gold); }
        .toast-sub { font-size: 12px; color: rgba(224,170,255,0.85); }

        .top-bar { position: sticky; top: 0; z-index: 10; display: flex; justify-content: flex-end; gap: 8px; padding: 12px 20px 0; max-width: 980px; margin: 0 auto; }

        @media (max-width: 560px) {
          .size-lg { width: 42vw; }
          .flip-card { width: 42vw; height: 60vw; }
          .modal-meta-grid { grid-template-columns: 1fr; }
          .rubik-tile { width: 15vw; height: 15vw; }
        }
      `}</style>

      <div className="top-bar">
        <button className="btn-icon" onClick={() => setView("achievements")} title="Logros">
          <Trophy size={16} />
        </button>
        <button
          className="btn-icon"
          onClick={() => {
            if (window.confirm("¿Seguro que quieres reiniciar tu Betodex? Se perderán todos los datos guardados.")) {
              resetCollection();
            }
          }}
          title="Reiniciar colección"
        >
          <RefreshCcw size={16} />
        </button>
        <button className="btn-icon" onClick={() => setSoundOn((s) => !s)} title="Sonido">
          {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </div>

      <Toasts toasts={toasts} />

      {view === "home" && (
        <Home
          owned={owned}
          packsOpened={packsOpened}
          onOpenPack={() => setView("pack")}
          onViewAlbum={() => setView("album")}
          onViewAchievements={() => setView("achievements")}
          unlockedCount={Object.keys(achievements).length}
        />
      )}

      {view === "pack" && (
        <PackOpening onFinish={handlePackFinish} isOwnedBefore={isOwnedBefore} />
      )}

      {view === "album" && (
        <Album owned={owned} favorites={favorites} flyIds={flyIds} onBack={() => setView("home")} onSelect={(card) => setSelectedCard(card)} />
      )}

      {view === "achievements" && (
        <Achievements unlocked={achievements} onBack={() => setView("home")} />
      )}

      <CardModal
        card={selectedCard}
        ownedInfo={selectedCard ? owned[selectedCard.id] : null}
        favorite={selectedCard ? !!favorites[selectedCard.id] : false}
        onToggleFavorite={() => selectedCard && toggleFavorite(selectedCard.id)}
        onPhotoClick={(card) => setSelectedPhoto(card)}
        onClose={() => setSelectedCard(null)}
      />

      <PhotoModal
        card={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    </div>
  );
}
