import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GachaScreen } from "./components/GachaScreen";
import { WishHistory } from "./components/WishHistory";

// ─── Types ─────────────────────────────────────────────────────────────────────
type Screen = "main" | "gacha" | "history";
type MainPage = "home" | "characters" | "shop" | "inventory" | "map";

// ─── Nav config ────────────────────────────────────────────────────────────────
const NAV: { id: MainPage | "gacha"; label: string; icon: string }[] = [
  { id: "home", label: "Home", icon: "⬡" },
  { id: "gacha", label: "Wish", icon: "✦" },
  { id: "characters", label: "Characters", icon: "⚔" },
  { id: "shop", label: "Shop", icon: "◈" },
  { id: "inventory", label: "Inventory", icon: "◉" },
  { id: "map", label: "World Map", icon: "◎" },
];

// ─── Shared helpers ───────────────────────────────────────────────────────────
function OrnamentFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 border border-[#c8a951]/22 pointer-events-none" />
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#c8a951]/60" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#c8a951]/60" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#c8a951]/60" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#c8a951]/60" />
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4 md:mb-5">
      <div className="w-0.5 h-5 bg-[#c8a951] rounded-full" />
      <h2 className="text-[#c8a951] text-[10px] uppercase tracking-[0.25em]" style={{ fontFamily: "'Cinzel', serif" }}>{children}</h2>
      <div className="flex-1 h-px bg-gradient-to-r from-[#c8a951]/30 to-transparent" />
    </div>
  );
}

// ─── Pages ─────────────────────────────────────────────────────────────────────

function HomePage({ onWish }: { onWish: () => void }) {
  const resinCurrent = 128, resinMax = 160;
  return (
    <div className="h-full overflow-y-auto pb-4" style={{ scrollbarWidth: "none" }}>
      {/* Hero */}
      <div className="relative w-full h-44 md:h-52 mb-5 md:mb-6 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop&auto=format" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #080c18 0%, rgba(8,12,24,0.55) 50%, transparent 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #080c18 0%, transparent 50%)" }} />
        <div className="absolute bottom-0 left-0 p-4 md:p-5">
          <p className="text-[#8a9bc2] text-[10px] uppercase tracking-[0.3em] mb-1">Welcome back, Visitor</p>
          <h1 className="text-[#e8d5a3] text-2xl md:text-3xl" style={{ fontFamily: "'Cinzel Decorative', serif" }}>HolyRNG</h1>
          <p className="text-[#c8a951] text-[10px] mt-1">Adventure Rank 55  ·  Liyue Chapter V</p>
        </div>
        <button
          onClick={onWish}
          className="absolute right-4 md:right-5 bottom-4 md:bottom-5 px-3 md:px-4 py-1.5 md:py-2 border border-[#c8a951]/60 text-[#c8a951] text-xs uppercase tracking-wider hover:bg-[#c8a951]/15 transition-all"
          style={{ fontFamily: "'Cinzel', serif", background: "rgba(4,10,22,0.75)" }}
        >
          ✦ Wish Now
        </button>
      </div>

      {/* Status row */}
      <div className="grid grid-cols-3 gap-2 md:gap-3 mb-5 md:mb-6">
        <OrnamentFrame className="bg-[#0d1426] p-2 md:p-3">
          <p className="text-[#8a9bc2] text-[9px] md:text-[10px] uppercase tracking-wider mb-1.5 md:mb-2">Original Resin</p>
          <div className="flex justify-between mb-1 md:mb-1.5">
            <span className="text-[#e8d5a3] text-xs md:text-sm" style={{ fontFamily: "'Cinzel', serif" }}>{resinCurrent}</span>
            <span className="text-[#8a9bc2] text-[10px] md:text-xs">/{resinMax}</span>
          </div>
          <div className="h-1.5 bg-[#131d35] rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${(resinCurrent / resinMax) * 100}%` }} transition={{ duration: 1 }}
              className="h-full rounded-full" style={{ background: "linear-gradient(to right, #4fc3f7, #c8a951)" }} />
          </div>
          <p className="text-[#8a9bc2] text-[9px] mt-1">Full in 2h 40m</p>
        </OrnamentFrame>

        <OrnamentFrame className="bg-[#0d1426] p-2 md:p-3">
          <p className="text-[#8a9bc2] text-[9px] md:text-[10px] uppercase tracking-wider mb-1.5 md:mb-2">Daily Commissions</p>
          <div className="flex gap-1 md:gap-1.5 mb-1">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`flex-1 h-2 rounded-sm ${i <= 3 ? "bg-[#c8a951]" : "bg-[#131d35]"}`} />
            ))}
          </div>
          <p className="text-[#c8a951] text-[10px]">3 / 4 done</p>
        </OrnamentFrame>

        <OrnamentFrame className="bg-[#0d1426] p-2 md:p-3">
          <p className="text-[#8a9bc2] text-[9px] md:text-[10px] uppercase tracking-wider mb-1.5 md:mb-2">Spiral Abyss</p>
          <p className="text-[#e8d5a3] text-xs md:text-sm" style={{ fontFamily: "'Cinzel', serif" }}>Floor 12</p>
          <p className="text-amber-400 text-[10px]">★★★ ★★★ ★★★</p>
          <p className="text-[#c8a951] text-[10px] mt-0.5">9 ★ cleared</p>
        </OrnamentFrame>
      </div>

      {/* Current banners */}
      <SectionTitle>Current Banners</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-5 md:mb-6">
        {[
          { title: "Austro-Hungary Empire", char: "Character Banner 1", pity: 43, color: "#ff6b35", img: "/Franz Joseph I.jpg", end: "Jul 2" },
          { title: "German Empire", char: "Character Banner 2", pity: 12, color: "#ff6b35", img: "/willhelm-2.jpg", end: "Jul 2" },
        ].map(b => (
          <button key={b.title} onClick={onWish} className="w-full text-left">
            <OrnamentFrame className="overflow-hidden group cursor-pointer">
              <div className="relative h-32 md:h-28">
                <img src={b.img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.2))" }} />
                <div className="absolute bottom-0 left-0 p-3">
                  <p className="text-[#e8d5a3] text-xs" style={{ fontFamily: "'Cinzel', serif" }}>{b.char}</p>
                  <p className="text-[10px]" style={{ color: b.color }}>★★★★★  ·  Pity {b.pity}/90</p>
                </div>
                <div className="absolute top-2 right-2 px-2 py-0.5 border border-[#c8a951]/40 text-[#c8a951] text-[9px] uppercase" style={{ fontFamily: "'Cinzel', serif", background: "rgba(4,10,22,0.75)" }}>
                  Ends {b.end}
                </div>
              </div>
            </OrnamentFrame>
          </button>
        ))}
      </div>

      {/* Events */}
      <SectionTitle>Events</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
        {[
          { name: "Windblume Festival", desc: "Ends in 3 days", tag: "Limited" },
          { name: "Ley Line Overflow", desc: "Double rewards active", tag: "Active" },
          { name: "Spiral Abyss Reset", desc: "New floor blessing", tag: "Weekly" },
          { name: "Version 4.5 Update", desc: "New character storyline", tag: "Story" },
        ].map((ev, i) => (
          <OrnamentFrame key={i} className="bg-[#0d1426] p-3 cursor-pointer hover:border-[#c8a951]/50 transition-colors">
            <div className="flex justify-between items-start mb-1">
              <p className="text-[#e8d5a3] text-xs" style={{ fontFamily: "'Cinzel', serif" }}>{ev.name}</p>
              <span className="text-[9px] text-[#c8a951] border border-[#c8a951]/30 px-1.5 py-0.5 ml-2 flex-shrink-0">{ev.tag}</span>
            </div>
            <p className="text-[#8a9bc2] text-[10px]">{ev.desc}</p>
          </OrnamentFrame>
        ))}
      </div>
    </div>
  );
}

function CharactersPage() {
  const chars = [
    { name: "Kaiser Franz I", element: "Pyro", weapon: "Sword", rarity: 5, lv: 90, c: 1, color: "#ff6b35", img: "https://images.unsplash.com/photo-1641575616810-fbfac0af1c58?w=200&h=280&fit=crop&auto=format" },
    { name: "Kaiser Wilhelm II", element: "Electro", weapon: "Catalyst", rarity: 5, lv: 90, c: 0, color: "#c77dff", img: "https://images.unsplash.com/photo-1779589897308-3d0c71acefdc?w=200&h=280&fit=crop&auto=format" },
    { name: "Tsar Nicholas II", element: "Cryo", weapon: "Bow", rarity: 5, lv: 80, c: 0, color: "#a8d8ea", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=280&fit=crop&auto=format" },
    { name: "David Lloyd George", element: "Hydro", weapon: "Sword", rarity: 4, lv: 80, c: 6, color: "#4fc3f7", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=280&fit=crop&auto=format" },
    { name: "Woodrow Wilson", element: "Geo", weapon: "Claymore", rarity: 4, lv: 80, c: 4, color: "#d4a017", img: "https://images.unsplash.com/photo-1522556189639-b150ed9c4330?w=200&h=280&fit=crop&auto=format" },
    { name: "Emperor Taisho", element: "Anemo", weapon: "Catalyst", rarity: 4, lv: 70, c: 2, color: "#7fd9b3", img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=280&fit=crop&auto=format" },
  ];

  const [selected, setSelected] = useState(chars[0]);
  const [showDetail, setShowDetail] = useState(false);

  const handleSelect = (c: typeof chars[0]) => {
    setSelected(c);
    setShowDetail(true);
  };

  return (
    <div className="h-full overflow-hidden">
      {/* Desktop layout */}
      <div className="hidden md:flex h-full gap-5 overflow-hidden">
        {/* Roster */}
        <div className="w-64 flex-shrink-0 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <SectionTitle>Characters</SectionTitle>
          <div className="flex flex-col gap-2">
            {chars.map(c => (
              <button key={c.name} onClick={() => setSelected(c)}
                className={`flex items-center gap-3 p-2 border text-left transition-all ${selected.name === c.name ? "bg-[#131d35] border-[#c8a951]/55" : "bg-[#0d1426] border-[#c8a951]/12 hover:border-[#c8a951]/30"}`}>
                <div className="w-10 h-10 overflow-hidden flex-shrink-0" style={{ border: `1px solid ${c.color}40` }}>
                  <img src={c.img} alt={c.name} className="w-full h-full object-cover object-top" />
                </div>
                <div className="min-w-0">
                  <p className="text-[#e8d5a3] text-xs truncate" style={{ fontFamily: "'Cinzel', serif" }}>{c.name}</p>
                  <p className="text-[10px]" style={{ color: c.color }}>{c.element} · Lv.{c.lv}</p>
                  <p className="text-amber-400 text-[10px]">{"★".repeat(c.rarity)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
        {/* Detail */}
        <CharacterDetail selected={selected} />
      </div>

      {/* Mobile layout */}
      <div className="flex md:hidden h-full flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {!showDetail ? (
            <motion.div key="roster" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
              <SectionTitle>Characters</SectionTitle>
              <div className="grid grid-cols-2 gap-2">
                {chars.map(c => (
                  <button key={c.name} onClick={() => handleSelect(c)}
                    className="relative overflow-hidden rounded-sm" style={{ border: `1px solid ${c.color}40`, background: "#0d1426" }}>
                    <div className="h-36 w-full overflow-hidden">
                      <img src={c.img} alt={c.name} className="w-full h-full object-cover object-top" />
                    </div>
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)" }} />
                    <div className="absolute bottom-0 left-0 p-2 text-left">
                      <p className="text-amber-400 text-[10px]">{"★".repeat(c.rarity)}</p>
                      <p className="text-[#e8d5a3] text-xs leading-tight" style={{ fontFamily: "'Cinzel', serif" }}>{c.name}</p>
                      <p className="text-[10px]" style={{ color: c.color }}>{c.element}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
              <button onClick={() => setShowDetail(false)} className="flex items-center gap-2 text-[#c8a951] text-xs mb-4 hover:opacity-75 transition-opacity">
                <span>←</span> <span style={{ fontFamily: "'Cinzel', serif" }}>Back to Roster</span>
              </button>
              <CharacterDetail selected={selected} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CharacterDetail({ selected }: { selected: { name: string; element: string; weapon: string; rarity: number; lv: number; c: number; color: string; img: string } }) {
  return (
    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <AnimatePresence mode="wait">
        <motion.div key={selected.name} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
          <OrnamentFrame className="bg-[#0d1426] mb-4 overflow-hidden">
            <div className="relative h-44 md:h-52">
              <img src={selected.img} alt={selected.name} className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0d1426 0%, transparent 60%)" }} />
              <div className="absolute bottom-4 right-4 text-right">
                <p className="text-[10px] mb-0.5" style={{ color: selected.color }}>{"★".repeat(selected.rarity)}</p>
                <p className="text-[#e8d5a3] text-xl md:text-2xl" style={{ fontFamily: "'Cinzel', serif" }}>{selected.name}</p>
                <p className="text-[#8a9bc2] text-xs mt-0.5">{selected.element} · {selected.weapon}</p>
                <div className="flex justify-end gap-2 mt-2">
                  <span className="px-2 py-0.5 border border-[#c8a951]/30 text-[#c8a951] text-[10px]">Lv.{selected.lv}</span>
                  <span className="px-2 py-0.5 border border-[#c8a951]/30 text-[#c8a951] text-[10px]">C{selected.c}</span>
                </div>
              </div>
            </div>
          </OrnamentFrame>
          <SectionTitle>Combat Stats</SectionTitle>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: "HP", value: "31,256", c: "#7dc4a0" },
              { label: "ATK", value: "2,847", c: "#e07b54" },
              { label: "DEF", value: "876", c: "#5b9bd5" },
              { label: "Crit Rate", value: "72.4%", c: "#e5c76b" },
              { label: "Crit DMG", value: "234.6%", c: "#e5c76b" },
              { label: "EM", value: "183", c: "#c77dff" },
            ].map(s => (
              <OrnamentFrame key={s.label} className="bg-[#080c18] p-2 md:p-3 text-center">
                <p className="text-[#8a9bc2] text-[9px] uppercase tracking-wider">{s.label}</p>
                <p className="text-xs md:text-sm mt-0.5" style={{ fontFamily: "'Cinzel', serif", color: s.c }}>{s.value}</p>
              </OrnamentFrame>
            ))}
          </div>
          <SectionTitle>Talents</SectionTitle>
          <div className="flex flex-col gap-2">
            {[
              { name: "Normal Attack", lv: 10, desc: "Performs up to 6 consecutive strikes." },
              { name: "Elemental Skill", lv: 13, desc: `Channels ${selected.element} energy, dealing massive elemental DMG.` },
              { name: "Elemental Burst", lv: 13, desc: "Unleashes a devastating elemental storm, dealing AoE DMG." },
            ].map(t => (
              <OrnamentFrame key={t.name} className="bg-[#0d1426] p-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-[#131d35] border border-[#c8a951]/25 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#c8a951] text-xs" style={{ fontFamily: "'Cinzel', serif" }}>{t.lv}</span>
                </div>
                <div>
                  <p className="text-[#e8d5a3] text-xs" style={{ fontFamily: "'Cinzel', serif" }}>{t.name}</p>
                  <p className="text-[#8a9bc2] text-[10px]">{t.desc}</p>
                </div>
              </OrnamentFrame>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ShopPage() {
  const items = [
    { name: "Intertwined Fate", desc: "Used for Event Banner Wishes.", price: "160 💎", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=120&h=120&fit=crop", tag: "Popular" },
    { name: "Acquaint Fate", desc: "Used for Standard Wishes.", price: "160 💎", img: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=120&h=120&fit=crop" },
    { name: "Blessing of Welkin", desc: "300 Crystals + 90 daily Primogems for 30 days.", price: "$4.99", img: "https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?w=120&h=120&fit=crop", tag: "Best Value" },
    { name: "Featured Character of:", desc: "Pick any 4★ Liyue character.", price: "34 ✦", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&h=120&fit=crop" },
    { name: "Fragile Resin ×1", desc: "Replenish 60 Original Resin.", price: "5 ◈", img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=120&h=120&fit=crop" },
    { name: "Mora ×160,000", desc: "Currency of Teyvat.", price: "160 ◈", img: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=120&h=120&fit=crop" },
  ];
  return (
    <div className="h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <SectionTitle>Crystal Shop</SectionTitle>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 mb-8">
        {items.map((item, i) => (
          <OrnamentFrame key={i} className="bg-[#0d1426] p-3 md:p-4 relative group cursor-pointer hover:border-[#c8a951]/50 transition-all">
            {item.tag && <div className="absolute top-2 right-2 bg-[#c8a951] text-[#080c18] text-[9px] px-1.5 py-0.5 uppercase">{item.tag}</div>}
            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 md:mb-3 overflow-hidden bg-[#131d35]">
              <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <p className="text-[#e8d5a3] text-xs text-center mb-1" style={{ fontFamily: "'Cinzel', serif" }}>{item.name}</p>
            <p className="text-[#8a9bc2] text-[10px] text-center mb-3">{item.desc}</p>
            <button className="w-full py-1.5 border border-[#c8a951]/40 hover:bg-[#c8a951]/20 text-[#c8a951] text-xs uppercase tracking-wider transition-all"
              style={{ background: "rgba(200,169,81,0.08)" }}>
              {item.price}
            </button>
          </OrnamentFrame>
        ))}
      </div>

      <SectionTitle>Genesis Crystal Top-Up</SectionTitle>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
        {[
          { amount: "60", price: "$0.99" }, { amount: "300+30", price: "$4.99" },
          { amount: "980+110", price: "$14.99", hi: true }, { amount: "1980+260", price: "$29.99" },
          { amount: "3280+600", price: "$49.99" }, { amount: "6480+1600", price: "$99.99" },
        ].map(p => (
          <OrnamentFrame key={p.price} className={`p-3 text-center cursor-pointer transition-all ${p.hi ? "bg-gradient-to-b from-[#c8a951]/15 to-[#0d1426]" : "bg-[#0d1426] hover:border-[#c8a951]/40"}`}>
            <span className="text-xl">💎</span>
            <p className="text-[#e8d5a3] text-sm mt-1" style={{ fontFamily: "'Cinzel', serif" }}>{p.amount}</p>
            <div className={`mt-2 py-1 text-xs ${p.hi ? "bg-[#c8a951] text-[#080c18]" : "text-[#8a9bc2] border border-[#c8a951]/20"}`}>{p.price}</div>
          </OrnamentFrame>
        ))}
      </div>
    </div>
  );
}

function InventoryPage() {
  const [tab, setTab] = useState("weapon");
  const items = [
    { name: "Quick-Manuver", type: "weapon", rarity: 5, qty: 1, lv: 90, img: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=80&h=80&fit=crop" },
    { name: "Contingency pivot", type: "weapon", rarity: 5, qty: 1, lv: 80, img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=80&h=80&fit=crop" },
    { name: "Tidal Whisper", type: "weapon", rarity: 4, qty: 1, lv: 70, img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=80&h=80&fit=crop" },
    { name: "Twilight Recurve", type: "weapon", rarity: 4, qty: 1, lv: 60, img: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=80&h=80&fit=crop" },
    { name: "Primogem", type: "material", rarity: 3, qty: 4280, img: "https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?w=80&h=80&fit=crop" },
    { name: "Mora", type: "material", rarity: 1, qty: 8450230, img: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=80&h=80&fit=crop" },
    { name: "Hero's Wit", type: "material", rarity: 4, qty: 347, img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=80&h=80&fit=crop" },
    { name: "Crimson Witch Set", type: "artifact", rarity: 5, qty: 1, lv: 20, img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=80&h=80&fit=crop" },
  ];
  const RARITY_BORDER_COLORS = { 5: "#e5c76b", 4: "#c580d9", 3: "#5b9bd5", 2: "#7dc4a0", 1: "#8a9bc2" };
  const tabs = ["weapon", "artifact", "material"];
  const filtered = items.filter(i => i.type === tab);

  return (
    <div className="h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <div className="flex gap-2 mb-5 flex-wrap">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 md:px-4 py-1.5 border text-[10px] uppercase tracking-wider transition-all ${tab === t ? "bg-[#c8a951] text-[#080c18] border-[#c8a951]" : "bg-[#0d1426] text-[#8a9bc2] border-[#c8a951]/20 hover:border-[#c8a951]/40"}`}
            style={{ fontFamily: "'Cinzel', serif" }}>
            {t}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 md:gap-3">
        {filtered.map((item, i) => (
          <motion.div key={item.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
            className="relative p-2 cursor-pointer hover:scale-105 transition-all"
            style={{ border: `1px solid ${(RARITY_BORDER_COLORS as Record<number, string>)[item.rarity]}40`, background: "#0d1426" }}>
            <div className="w-full aspect-square overflow-hidden mb-1.5 bg-[#080c18]">
              <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
            </div>
            {item.qty > 1 && (
              <span className="absolute top-1.5 right-1.5 bg-[#080c18]/80 text-[#c8a951] text-[9px] px-1">×{item.qty.toLocaleString()}</span>
            )}
            {item.lv && (
              <span className="absolute bottom-7 right-1.5 bg-[#080c18]/80 text-[#8a9bc2] text-[9px] px-1">+{item.lv}</span>
            )}
            <p className="text-[9px] text-[10px] leading-tight truncate" style={{ color: (RARITY_BORDER_COLORS as Record<number, string>)[item.rarity] }}>
              {"★".repeat(item.rarity)}
            </p>
            <p className="text-[#e8d5a3] text-[9px] truncate">{item.name}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function MapPage() {
  const [region, setRegion] = useState("Liyue");
  const regions = [
    { name: "Mondstadt", pct: 94, color: "#4fc3f7", icon: "🌸" },
    { name: "Liyue", pct: 87, color: "#c8a951", icon: "⛰" },
    { name: "Inazuma", pct: 73, color: "#c77dff", icon: "⚡" },
    { name: "Sumeru", pct: 41, color: "#7dc4a0", icon: "🌿" },
    { name: "Fontaine", pct: 12, color: "#5b9bd5", icon: "💧" },
  ];

  return (
    <div className="h-full flex flex-col md:flex-row gap-4 md:gap-5 overflow-hidden">
      {/* Map */}
      <div className="flex-1 relative overflow-hidden min-h-48" style={{ border: "1px solid rgba(200,169,81,0.2)" }}>
        <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&h=600&fit=crop" alt="World Map" className="w-full h-full object-cover opacity-55" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(8,12,24,0.7) 0%, rgba(8,12,24,0.3) 50%, transparent 100%)" }} />
        {[
          { x: "24%", y: "28%", label: "Mondstadt" }, { x: "55%", y: "54%", label: "Liyue" },
          { x: "74%", y: "34%", label: "Inazuma" }, { x: "60%", y: "73%", label: "Sumeru" },
          { x: "34%", y: "64%", label: "Fontaine" },
        ].map(m => (
          <button key={m.label} onClick={() => setRegion(m.label)}
            className="absolute group -translate-x-1/2 -translate-y-1/2" style={{ left: m.x, top: m.y }}>
            <div className={`w-3 h-3 rounded-full border-2 transition-all ${region === m.label ? "bg-[#c8a951] border-[#e8d5a3] scale-150" : "bg-[#c8a951]/50 border-[#c8a951] group-hover:scale-125"}`} />
            <p className={`absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] transition-opacity ${region === m.label ? "text-[#c8a951] opacity-100" : "text-[#8a9bc2] opacity-0 group-hover:opacity-100"}`}
              style={{ fontFamily: "'Cinzel', serif" }}>{m.label}</p>
          </button>
        ))}
        <div className="absolute top-3 right-3 w-9 h-9 rounded-full border border-[#c8a951]/40 flex items-center justify-center" style={{ background: "rgba(4,10,22,0.8)" }}>
          <span className="text-[#c8a951] text-[10px]" style={{ fontFamily: "'Cinzel', serif" }}>N</span>
        </div>
      </div>
      {/* Region list */}
      <div className="md:w-52 flex-shrink-0 flex flex-col gap-2 md:gap-3 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        <SectionTitle>Exploration</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-0 md:flex md:flex-col md:gap-3">
          {regions.map(r => (
            <button key={r.name} onClick={() => setRegion(r.name)}>
              <OrnamentFrame className={`p-3 bg-[#0d1426] text-left transition-all ${region === r.name ? "border-[#c8a951]/55" : "opacity-70 hover:opacity-100"}`}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1.5">
                    <span>{r.icon}</span>
                    <span className="text-[#e8d5a3] text-xs" style={{ fontFamily: "'Cinzel', serif" }}>{r.name}</span>
                  </div>
                  <span className="text-xs" style={{ color: r.color }}>{r.pct}%</span>
                </div>
                <div className="h-1 bg-[#131d35] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${r.pct}%` }} transition={{ duration: 0.8 }}
                    className="h-full rounded-full" style={{ backgroundColor: r.color }} />
                </div>
              </OrnamentFrame>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("main");
  const [mainPage, setMainPage] = useState<MainPage>("home");

  // Full-screen overlays
  if (screen === "gacha") return <GachaScreen onBack={() => setScreen("main")} onHistory={() => setScreen("history")} />;
  if (screen === "history") return <WishHistory onBack={() => setScreen("gacha")} onGacha={() => setScreen("gacha")} />;

  return (
    <div className="w-screen h-screen bg-background text-foreground overflow-hidden flex" style={{ fontFamily: "'Lato', 'Noto Serif SC', sans-serif" }}>

      {/* ─── Sidebar (desktop only) ─── */}
      <aside className="hidden md:flex w-52 flex-shrink-0 flex-col border-r border-[#c8a951]/18" style={{ background: "#06101e" }}>
        {/* Logo */}
        <div className="px-5 py-4 border-b border-[#c8a951]/18">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-5 h-5 border border-[#c8a951]/55 flex items-center justify-center" style={{ background: "rgba(200,169,81,0.1)" }}>
              <span className="text-[#c8a951] text-[10px]">✦</span>
            </div>
            <span className="text-[#c8a951] text-xs uppercase tracking-[0.25em]" style={{ fontFamily: "'Cinzel', serif" }}>Holy</span>
          </div>
          <p className="text-[#8a9bc2] text-[9px] uppercase tracking-[0.2em] ml-7" style={{ fontFamily: "'Cinzel', serif" }}>RNG</p>
        </div>

        {/* Traveler */}
        <div className="px-4 py-3 border-b border-[#c8a951]/12">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-9 h-9 overflow-hidden border border-[#c8a951]/30" style={{ background: "#131d35" }}>
              <img src="https://images.unsplash.com/photo-1641575616810-fbfac0af1c58?w=50&h=50&fit=crop&auto=format" alt="Traveler" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-[#e8d5a3] text-xs" style={{ fontFamily: "'Cinzel', serif" }}>Traveler</p>
              <p className="text-[#8a9bc2] text-[10px]">AR 55  ·  Asia</p>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-0.5">
              <span className="text-[#8a9bc2] text-[9px]">EXP</span>
              <span className="text-[#8a9bc2] text-[9px]">4820/6900</span>
            </div>
            <div className="h-1 bg-[#131d35] rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: "70%", background: "linear-gradient(to right, #c8a951, #e5c76b)" }} />
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-2 flex flex-col gap-0.5">
          {NAV.map(item => {
            const isActive = item.id === "gacha" ? false : (mainPage === item.id);
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "gacha") setScreen("gacha");
                  else setMainPage(item.id as MainPage);
                }}
                className={`relative flex items-center gap-3 px-3 py-2.5 text-left transition-all ${isActive ? "text-[#c8a951]" : "text-[#8a9bc2] hover:text-[#e8d5a3] hover:bg-[#131d35]/50"}`}
                style={{ background: isActive ? "rgba(200,169,81,0.1)" : undefined }}
              >
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#c8a951] rounded-full" />}
                {item.id === "gacha" && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#c8a951]/50 rounded-full" />}
                <span className="text-sm w-5 text-center">{item.icon}</span>
                <span className="text-[10px] uppercase tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>{item.label}</span>
                {item.id === "gacha" && (
                  <span className="ml-auto text-[9px] text-amber-400 border border-amber-400/40 px-1">NEW</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Currency footer */}
        <div className="px-4 py-3 border-t border-[#c8a951]/12 flex flex-col gap-1">
          {[
            { icon: "💎", val: "4,280", label: "Primogem" },
            { icon: "✦", val: "8", label: "Intertwined" },
          ].map(c => (
            <div key={c.label} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">{c.icon}</span>
                <span className="text-[#8a9bc2] text-[10px]">{c.label}</span>
              </div>
              <span className="text-[#e8d5a3] text-[10px]">{c.val}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* ─── Main ─── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex-shrink-0 h-12 flex items-center justify-between px-4 md:px-6 border-b border-[#c8a951]/18" style={{ background: "rgba(6,16,30,0.9)" }}>
          {/* Mobile: Logo left */}
          <div className="flex items-center gap-2 md:hidden">
            <span className="text-[#c8a951] text-xs">✦</span>
            <span className="text-[#c8a951] text-xs uppercase tracking-[0.25em]" style={{ fontFamily: "'Cinzel', serif" }}>Holy RNG</span>
          </div>
          {/* Desktop: Page title */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-[#c8a951] text-xs">{NAV.find(n => n.id === mainPage)?.icon}</span>
            <h1 className="text-[#e8d5a3] text-xs uppercase tracking-[0.22em]" style={{ fontFamily: "'Cinzel', serif" }}>
              {NAV.find(n => n.id === mainPage)?.label}
            </h1>
          </div>
          {/* Mobile: current page title center */}
          <div className="absolute left-1/2 -translate-x-1/2 md:hidden">
            <span className="text-[#e8d5a3] text-xs uppercase tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>
              {NAV.find(n => n.id === mainPage)?.label}
            </span>
          </div>
          <button onClick={() => setScreen("gacha")} className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 border border-[#c8a951]/40 text-[#c8a951] text-[10px] uppercase tracking-wider hover:bg-[#c8a951]/10 transition-all"
            style={{ fontFamily: "'Cinzel', serif", background: "rgba(200,169,81,0.06)" }}>
            <span>✦</span> Wish
          </button>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-hidden p-4 md:p-6 pb-20 md:pb-6">
          <AnimatePresence mode="wait">
            <motion.div key={mainPage} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="h-full">
              {mainPage === "home" && <HomePage onWish={() => setScreen("gacha")} />}
              {mainPage === "characters" && <CharactersPage />}
              {mainPage === "shop" && <ShopPage />}
              {mainPage === "inventory" && <InventoryPage />}
              {mainPage === "map" && <MapPage />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ─── Mobile Bottom Nav ─── */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-[#c8a951]/20 flex items-center justify-around px-2 py-2 z-50"
          style={{ background: "rgba(6,16,30,0.97)", backdropFilter: "blur(12px)" }}>
          {NAV.map(item => {
            const isActive = item.id === "gacha" ? false : (mainPage === item.id);
            const isGacha = item.id === "gacha";
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "gacha") setScreen("gacha");
                  else setMainPage(item.id as MainPage);
                }}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 relative transition-all ${isActive ? "text-[#c8a951]" : "text-[#8a9bc2]"}`}
              >
                {isGacha ? (
                  <div className="w-10 h-10 rounded-full border border-[#c8a951]/60 flex items-center justify-center -mt-4"
                    style={{ background: "linear-gradient(135deg, #1a1000, #2d2000)", boxShadow: "0 0 16px rgba(200,169,81,0.3)" }}>
                    <span className="text-[#c8a951] text-base">{item.icon}</span>
                  </div>
                ) : (
                  <span className={`text-base transition-all ${isActive ? "scale-110" : ""}`}>{item.icon}</span>
                )}
                <span className="text-[8px] uppercase tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>{item.label}</span>
                {isActive && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#c8a951] rounded-full" />}
              </button>
            );
          })}
        </nav>
      </main>
    </div>
  );
}
