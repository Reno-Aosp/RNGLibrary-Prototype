import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface HistoryRecord {
  id: string;
  name: string;
  type: "character" | "weapon";
  rarity: 5 | 4 | 3;
  element?: string;
  banner: string;
  timestamp: string;
  pity: number;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const ELEMENT_ICONS: Record<string, string> = {
  Pyro: "🔥", Hydro: "💧", Electro: "⚡", Anemo: "🌀", Geo: "⛰", Cryo: "❄", Dendro: "🌿"
};

const HISTORY_DATA: Record<string, HistoryRecord[]> = {
  ember: [
    { id: "e1", name: "Solara", type: "character", rarity: 5, element: "Pyro", banner: "Ember's Requiem", timestamp: "2024-06-14 15:23:04", pity: 67 },
    { id: "e2", name: "Mirael", type: "character", rarity: 4, element: "Hydro", banner: "Ember's Requiem", timestamp: "2024-06-14 15:22:51", pity: 21 },
    { id: "e3", name: "Void Hymn", type: "weapon", rarity: 3, banner: "Ember's Requiem", timestamp: "2024-06-14 15:22:38", pity: 7 },
    { id: "e4", name: "Harbinger's Edge", type: "weapon", rarity: 3, banner: "Ember's Requiem", timestamp: "2024-06-14 15:22:25", pity: 6 },
    { id: "e5", name: "Theron", type: "character", rarity: 4, element: "Geo", banner: "Ember's Requiem", timestamp: "2024-06-13 20:11:02", pity: 5 },
    { id: "e6", name: "Ancient Iron", type: "weapon", rarity: 3, banner: "Ember's Requiem", timestamp: "2024-06-13 20:10:49", pity: 4 },
    { id: "e7", name: "Skybane", type: "weapon", rarity: 3, banner: "Ember's Requiem", timestamp: "2024-06-13 20:10:36", pity: 3 },
    { id: "e8", name: "Amber Dawn", type: "weapon", rarity: 3, banner: "Ember's Requiem", timestamp: "2024-06-13 20:10:23", pity: 2 },
    { id: "e9", name: "Crescent Pierce", type: "weapon", rarity: 3, banner: "Ember's Requiem", timestamp: "2024-06-12 10:45:17", pity: 1 },
    { id: "e10", name: "Celia", type: "character", rarity: 4, element: "Anemo", banner: "Ember's Requiem", timestamp: "2024-06-12 10:45:04", pity: 10 },
    { id: "e11", name: "Void Hymn", type: "weapon", rarity: 3, banner: "Ember's Requiem", timestamp: "2024-06-11 08:30:11", pity: 9 },
    { id: "e12", name: "Ancient Iron", type: "weapon", rarity: 3, banner: "Ember's Requiem", timestamp: "2024-06-11 08:29:58", pity: 8 },
  ],
  tempest: [
    { id: "t1", name: "Valkoryn", type: "character", rarity: 5, element: "Electro", banner: "Tempest's Call", timestamp: "2024-06-10 21:14:33", pity: 80 },
    { id: "t2", name: "Korvin", type: "character", rarity: 4, element: "Pyro", banner: "Tempest's Call", timestamp: "2024-06-10 21:14:20", pity: 9 },
    { id: "t3", name: "Void Hymn", type: "weapon", rarity: 3, banner: "Tempest's Call", timestamp: "2024-06-10 21:14:07", pity: 8 },
    { id: "t4", name: "Skybane", type: "weapon", rarity: 3, banner: "Tempest's Call", timestamp: "2024-06-09 14:22:45", pity: 7 },
    { id: "t5", name: "Davan", type: "character", rarity: 4, element: "Electro", banner: "Tempest's Call", timestamp: "2024-06-09 14:22:32", pity: 6 },
    { id: "t6", name: "Harbinger's Edge", type: "weapon", rarity: 3, banner: "Tempest's Call", timestamp: "2024-06-08 18:05:19", pity: 5 },
  ],
  weapon: [
    { id: "w1", name: "Sunfire's Wrath", type: "weapon", rarity: 5, banner: "Eternal Armament", timestamp: "2024-06-07 12:30:55", pity: 72 },
    { id: "w2", name: "Tidal Whisper", type: "weapon", rarity: 4, banner: "Eternal Armament", timestamp: "2024-06-07 12:30:42", pity: 14 },
    { id: "w3", name: "Twilight Recurve", type: "weapon", rarity: 4, banner: "Eternal Armament", timestamp: "2024-06-06 09:18:27", pity: 4 },
    { id: "w4", name: "Ancient Iron", type: "weapon", rarity: 3, banner: "Eternal Armament", timestamp: "2024-06-06 09:18:14", pity: 3 },
    { id: "w5", name: "Void Hymn", type: "weapon", rarity: 3, banner: "Eternal Armament", timestamp: "2024-06-05 16:44:38", pity: 2 },
  ],
  standard: [
    { id: "s1", name: "Aurantia", type: "character", rarity: 5, element: "Cryo", banner: "Wanderer's Fate", timestamp: "2024-06-04 22:10:05", pity: 55 },
    { id: "s2", name: "Lyris", type: "character", rarity: 4, element: "Hydro", banner: "Wanderer's Fate", timestamp: "2024-06-04 22:09:52", pity: 18 },
    { id: "s3", name: "Skybane", type: "weapon", rarity: 3, banner: "Wanderer's Fate", timestamp: "2024-06-03 11:35:41", pity: 5 },
    { id: "s4", name: "Tamren", type: "character", rarity: 4, element: "Geo", banner: "Wanderer's Fate", timestamp: "2024-06-03 11:35:28", pity: 4 },
    { id: "s5", name: "Harbinger's Edge", type: "weapon", rarity: 3, banner: "Wanderer's Fate", timestamp: "2024-06-02 07:20:14", pity: 3 },
    { id: "s6", name: "Oryx", type: "character", rarity: 4, element: "Electro", banner: "Wanderer's Fate", timestamp: "2024-06-01 14:58:33", pity: 10 },
    { id: "s7", name: "Crescent Pierce", type: "weapon", rarity: 3, banner: "Wanderer's Fate", timestamp: "2024-06-01 14:58:20", pity: 9 },
    { id: "s8", name: "Void Hymn", type: "weapon", rarity: 3, banner: "Wanderer's Fate", timestamp: "2024-05-31 20:12:47", pity: 8 },
  ],
};

const BANNER_TABS = [
  { id: "ember", label: "Character Event Wish", short: "Char. Event 1" },
  { id: "tempest", label: "Character Event Wish-2", short: "Char. Event 2" },
  { id: "weapon", label: "Weapon Event Wish", short: "Weapon Event" },
  { id: "standard", label: "Standard Wish", short: "Standard" },
];

const PAGE_SIZE = 7;

const RARITY_ROW_BG: Record<number, string> = {
  5: "rgba(229,199,107,0.06)",
  4: "rgba(197,128,217,0.06)",
  3: "transparent",
};

const RARITY_NAME_COLOR: Record<number, string> = {
  5: "#e5c76b",
  4: "#c580d9",
  3: "#5b9bd5",
};

// ─── Component ─────────────────────────────────────────────────────────────────
export function WishHistory({ onBack, onGacha }: { onBack: () => void; onGacha: () => void }) {
  const [bannerTab, setBannerTab] = useState("ember");
  const [page, setPage] = useState(1);

  const records = HISTORY_DATA[bannerTab] ?? [];
  const totalPages = Math.ceil(records.length / PAGE_SIZE);
  const pageRecords = records.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const total5 = records.filter(r => r.rarity === 5).length;
  const total4 = records.filter(r => r.rarity === 4).length;

  const handleTabChange = (id: string) => {
    setBannerTab(id);
    setPage(1);
  };

  return (
    <div
      className="fixed inset-0 overflow-hidden flex flex-col"
      style={{ fontFamily: "'Lato', sans-serif", background: "#07101f" }}
    >
      {/* Subtle background */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,169,81,0.06), transparent 70%)" }} className="absolute inset-0" />
      </div>

      {/* ─── Top Bar ─── */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 h-14 border-b border-[#c8a951]/18 relative z-10"
        style={{ background: "rgba(4,10,22,0.9)" }}>
        <button onClick={onBack} className="flex items-center gap-2 text-[#e8d5a3]/80 hover:text-[#e8d5a3] transition-opacity">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-xs uppercase tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>Back</span>
        </button>

        <h2 className="text-[#e8d5a3] text-sm uppercase tracking-[0.22em]" style={{ fontFamily: "'Cinzel', serif" }}>
          Wish History
        </h2>

        <button onClick={onGacha} className="text-[#c8a951] text-xs uppercase tracking-wider hover:text-[#e5c76b] transition-colors" style={{ fontFamily: "'Cinzel', serif" }}>
          ✦ Wish →
        </button>
      </div>

      {/* ─── Banner Tabs ─── */}
      <div className="flex-shrink-0 flex border-b border-[#c8a951]/15 relative z-10" style={{ background: "rgba(4,10,22,0.7)" }}>
        {BANNER_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className="flex-1 py-3 px-2 text-center transition-all relative"
          >
            {bannerTab === tab.id && (
              <motion.div layoutId="historyTab" className="absolute inset-0" style={{ background: "rgba(200,169,81,0.08)" }} />
            )}
            <p className={`text-[10px] uppercase tracking-wider relative z-10 transition-colors ${bannerTab === tab.id ? "text-[#c8a951]" : "text-[#8a9bc2] hover:text-[#e8d5a3]"}`}
              style={{ fontFamily: "'Cinzel', serif" }}>
              {tab.short}
            </p>
            {bannerTab === tab.id && (
              <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#c8a951]" />
            )}
          </button>
        ))}
      </div>

      {/* ─── Summary Pills ─── */}
      <div className="flex-shrink-0 flex items-center gap-3 px-6 py-3 border-b border-[#c8a951]/12 relative z-10">
        <p className="text-[#8a9bc2] text-[10px] uppercase tracking-wider mr-2">
          {BANNER_TABS.find(t => t.id === bannerTab)?.label}
        </p>
        <div className="flex items-center gap-1.5 bg-[#0d1426] border border-amber-400/25 rounded-sm px-2.5 py-1">
          <span className="text-amber-400 text-xs">★★★★★</span>
          <span className="text-[#e8d5a3] text-xs ml-1">{total5}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#0d1426] border border-purple-400/25 rounded-sm px-2.5 py-1">
          <span className="text-purple-400 text-xs">★★★★</span>
          <span className="text-[#e8d5a3] text-xs ml-1">{total4}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#0d1426] border border-[#c8a951]/20 rounded-sm px-2.5 py-1">
          <span className="text-[#8a9bc2] text-[10px]">Total</span>
          <span className="text-[#e8d5a3] text-xs ml-1">{records.length}</span>
        </div>
      </div>

      {/* ─── Table ─── */}
      <div className="flex-1 overflow-hidden relative z-10 px-6 pt-4">
        {/* Table header */}
        <div className="grid text-[#8a9bc2] text-[10px] uppercase tracking-wider px-4 py-2.5 border border-[#c8a951]/18 rounded-t-sm mb-0"
          style={{ gridTemplateColumns: "2.5fr 1fr 1fr 1fr 1.5fr", background: "rgba(4,10,22,0.9)" }}>
          <span>Item Name</span>
          <span>Type</span>
          <span>Rarity</span>
          <span>Pity</span>
          <span className="text-right">Time</span>
        </div>

        {/* Rows */}
        <div className="border border-t-0 border-[#c8a951]/18 rounded-b-sm overflow-hidden" style={{ background: "rgba(4,10,22,0.6)" }}>
          <AnimatePresence mode="wait">
            <motion.div key={bannerTab + "-" + page} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              {pageRecords.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-[#8a9bc2]">
                  <p className="text-[#8a9bc2] text-sm">No pull records found.</p>
                </div>
              ) : pageRecords.map((record, i) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="grid items-center px-4 py-2.5 border-b border-[#c8a951]/10 last:border-b-0 hover:bg-white/[0.02] transition-colors"
                  style={{
                    gridTemplateColumns: "2.5fr 1fr 1fr 1fr 1.5fr",
                    background: RARITY_ROW_BG[record.rarity],
                  }}
                >
                  {/* Name + element */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-1 h-4 rounded-full flex-shrink-0 ${record.rarity === 5 ? "bg-amber-400" : record.rarity === 4 ? "bg-purple-400" : "bg-blue-400/60"}`} />
                    <span className="text-[11px] font-display truncate" style={{ color: RARITY_NAME_COLOR[record.rarity], fontFamily: "'Cinzel', serif" }}>
                      {record.name}
                    </span>
                    {record.element && (
                      <span className="text-xs flex-shrink-0">{ELEMENT_ICONS[record.element]}</span>
                    )}
                  </div>

                  {/* Type */}
                  <span className="text-[#8a9bc2] text-[11px] capitalize">{record.type}</span>

                  {/* Stars */}
                  <span className="text-[11px]" style={{ color: RARITY_NAME_COLOR[record.rarity] }}>
                    {"★".repeat(record.rarity)}
                  </span>

                  {/* Pity */}
                  <span className={`text-[11px] ${record.rarity === 5 ? "text-amber-400 font-bold" : "text-[#8a9bc2]"}`}>
                    {record.pity}
                  </span>

                  {/* Timestamp */}
                  <span className="text-[#8a9bc2] text-[10px] text-right">{record.timestamp}</span>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ─── Pagination ─── */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-t border-[#c8a951]/15 relative z-10"
        style={{ background: "rgba(4,10,22,0.85)" }}>
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page <= 1}
          className="flex items-center gap-1.5 text-[#8a9bc2] hover:text-[#e8d5a3] disabled:opacity-30 transition-colors text-xs uppercase tracking-wider"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 3L4 7L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Prev
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-6 h-6 flex items-center justify-center rounded-sm text-[10px] transition-all border ${page === i + 1 ? "bg-[#c8a951] text-[#080c18] border-[#c8a951]" : "text-[#8a9bc2] border-[#c8a951]/20 hover:border-[#c8a951]/50"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
          className="flex items-center gap-1.5 text-[#8a9bc2] hover:text-[#e8d5a3] disabled:opacity-30 transition-colors text-xs uppercase tracking-wider"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Next
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3L10 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
