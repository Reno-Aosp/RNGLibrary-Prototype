import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

// ─── Types ────────────────────────────────────────────────────────────────────
type ElementType = "Pyro" | "Hydro" | "Electro" | "Anemo" | "Geo" | "Cryo" | "Dendro";

interface WishItem {
  id: string;
  name: string;
  type: "character" | "weapon";
  rarity: 5 | 4 | 3;
  element?: ElementType;
  image: string;
  weaponType?: string;
  history?: string;
  kit?: {
    normalAttack: { name: string; desc: string };
    elementalSkill: { name: string; desc: string };
    elementalBurst: { name: string; desc: string };
  };
  weaponPassive?: {
    name: string;
    desc: string;
  };
  aboutImage?: string;
}

interface Banner {
  id: string;
  label: string;
  title: string | string[];
  version: string;
  endDate: string;
  type: "limited" | "weapon" | "standard";
  featured5Stars: string[];
  featured4Stars: string[];
  element: ElementType | ElementType[];
  elementColor: string | string[];
  bgImage: string | string[];
  // charImages: array of images to cycle through (one per featured 5★)
  charImages: string[];
  // thumbImages: array of images for the banner tab thumbnail (split shown when multiple)
  thumbImages: string[];
  fateCurrency: "intertwined" | "acquaint";
}

interface PityState {
  count5: number;
  count4: number;
  guaranteed: boolean;
}

// ─── Constants ─────────────────────────────────────────────────────────────────
const ELEMENT_ICONS: Record<ElementType, string> = {
  Pyro: "🔥", Hydro: "💧", Electro: "⚡", Anemo: "🌀", Geo: "⛰", Cryo: "❄", Dendro: "🌿"
};

const RARITY_STAR_COLOR: Record<number, string> = { 5: "#e5c76b", 4: "#c580d9", 3: "#5b9bd5" };

const RARITY_BORDER: Record<number, string> = {
  5: "border-amber-400",
  4: "border-purple-400",
  3: "border-blue-400/60",
};

const RARITY_GLOW: Record<number, string> = {
  5: "shadow-[0_0_32px_rgba(229,199,107,0.75)]",
  4: "shadow-[0_0_20px_rgba(197,128,217,0.6)]",
  3: "shadow-[0_0_10px_rgba(91,155,213,0.3)]",
};

const RARITY_CARD_BG: Record<number, string> = {
  5: "linear-gradient(170deg, #3d2200 0%, #1a1000 60%, #0d0800 100%)",
  4: "linear-gradient(170deg, #1e0a3c 0%, #10052a 60%, #050210 100%)",
  3: "linear-gradient(170deg, #0a1a2e 0%, #050e1a 100%)",
};

// ─── Banner Data ───────────────────────────────────────────────────────────────
const BANNERS: Banner[] = [
  {
    id: "ember",
    label: "Banner 1",
    title: "Kaiser Franz I",
    version: "4.5",
    endDate: "2024-07-02 17:59:59",
    type: "limited",
    featured5Stars: ["Austro-Hungary Empire"],
    featured4Stars: ["Bulgaria", "Ottoman Empire", "African Colonies"],
    element: "Pyro",
    elementColor: "#ff6b35",
    bgImage: "/Background-Flags/Austro-Hungary-Flag.jpg",
    charImages: ["/Franz Joseph I.jpg"],
    thumbImages: ["/Franz Joseph I.jpg"],
    fateCurrency: "intertwined",
  },
  {
    id: "tempest",
    label: "Banner 2",
    title: "Kaiser Willhelm II",
    version: "4.5",
    endDate: "2024-07-02 17:59:59",
    type: "limited",
    featured5Stars: ["German Empire"],
    featured4Stars: ["Bulgaria", "Ottoman Empire", "African Colonies"],
    element: "Electro",
    elementColor: "#c77dff",
    bgImage: "Background-Flags/German-Empire-Flag.jpg",
    charImages: ["/willhelm-2.jpg"],
    thumbImages: ["/willhelm-2.jpg"],
    fateCurrency: "intertwined",
  },
  {
    id: "weapon",
    label: "Tactics Banner",
    title: ["Schlieffen Plan", "Plan-R", "KaiserSchlacht"],
    version: "4.5",
    endDate: "2024-07-02 17:59:59",
    type: "weapon",
    featured5Stars: ["Quick-Manuver", "Contingency pivot", "Hundred Days Offensive"],
    featured4Stars: ["Plan-19", "Plan-B", "Plan-G"],
    element: "Geo",
    elementColor: "#d4a017",
    bgImage: "/Tactics/Schlieffen-Plan-Arrange.jpg",
    // Two images — one per featured weapon
    charImages: ["/Tactics/Schlieffen-Plan.jpg", "/Tactics/Plan-R.jpg", "/Tactics/KaiserSchlacht.jpg"],
    thumbImages: ["/Tactics/Schlieffen-Plan.jpg", "/Tactics/Plan-R.jpg", "/Tactics/KaiserSchlacht.jpg"],
    fateCurrency: "intertwined",
  },
  {
    id: "standard",
    label: "Permanent Banners",
    title: ["David Lloyd George", "Woodrow Wilson", "Raymond Poincare", "Tsar Nicholas II"],
    version: "4.5",
    endDate: "Permanent",
    type: "standard",
    featured5Stars: ["Great Britain", "United States", "French Third Republic", "Russian Empire"],
    featured4Stars: ["Belgium", "Netherlands", "Luxembourg", "Italy", "Japan"],
    element: ["Hydro", "Dendro", "Anemo", "Cryo"],
    elementColor: ["#4fc3f7", "#a5c83b", "#7dc4a0", "#a8d8ea"],
    bgImage: [
      "/Background-Flags/British-Flag.jpg",
      "/Background-Flags/United-States-Flag.jpg",
      "/Background-Flags/French-Flag.jpg",
      "/Background-Flags/Russian-Empire-Flag.jpg"
    ],
    // Two images — one per featured 5★
    charImages: ["/David_Lloyd_George.jpg", "/Woodrow Wilson.jpg", "/Raymond Poincare.jpg", "/Tsar Nicholas II.jpg"],
    thumbImages: ["/David_Lloyd_George.jpg", "/Woodrow Wilson.jpg", "/Raymond Poincare.jpg", "/Tsar Nicholas II.jpg"],
    fateCurrency: "acquaint",
  },
];

// ─── Wish Pool ────────────────────────────────────────────────────────────────
const WISH_ITEMS: Record<string, WishItem> = {
  "Solara": { id: "solara", name: "Solara", type: "character", rarity: 5, element: "Pyro", image: "https://images.unsplash.com/photo-1641575616810-fbfac0af1c58?w=400&h=600&fit=crop&auto=format" },
  "Valkoryn": { id: "valkoryn", name: "Valkoryn", type: "character", rarity: 5, element: "Electro", image: "https://images.unsplash.com/photo-1779589897308-3d0c71acefdc?w=400&h=600&fit=crop&auto=format" },
  "Aurantia": { id: "aurantia", name: "Aurantia", type: "character", rarity: 5, element: "Cryo", image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop&auto=format" },
  "Kethros": { id: "kethros", name: "Kethros", type: "character", rarity: 5, element: "Geo", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&auto=format" },
  "Nyxara": { id: "nyxara", name: "Nyxara", type: "character", rarity: 5, element: "Hydro", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop&auto=format" },
  "Sunfire's Wrath": { id: "sunfire", name: "Sunfire's Wrath", type: "weapon", rarity: 5, image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=400&h=600&fit=crop&auto=format" },
  "Celestial Hymn": { id: "celestial", name: "Celestial Hymn", type: "weapon", rarity: 5, image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop&auto=format" },
  "Quick-Manuver": {
    id: "schlieffen", name: "Schlieffen Plan", type: "weapon", rarity: 5, image: "/Tactics/Schlieffen-Plan.jpg", element: "Geo",
    weaponType: "Strategic Plan",
    history: "The Schlieffen Plan was the German General Staff's overall strategic plan for a two-front war against France and Russia. Conceived by Field Marshal Alfred von Schlieffen, it relied on a rapid, overwhelming sweep through neutral Belgium to encircle Paris and defeat France before the vast Russian army could fully mobilize in the east. Though it initially made deep gains and shocked the Allies, logistical failures, unexpected Belgian resistance, and the rapid Russian mobilization led to its ultimate failure at the First Battle of the Marne, dooming Europe to years of grinding trench warfare.",
    aboutImage: "/About/Schlieffen-Plan-About.jpg",
    weaponPassive: {
      name: "Right Flank Sweep",
      desc: "Increases Movement SPD by 15% and ATK by 20% for the first 10 seconds of entering combat. Dealing damage to an enemy from behind triggers an additional instance of True Damage based on 150% of Base ATK. This effect can only trigger once every 4 seconds."
    }
  },
  "Contingency pivot": {
    id: "planr", name: "Plan-R", type: "weapon", rarity: 5, image: "/Tactics/Plan-R.jpg", element: "Geo",
    weaponType: "Strategic Plan",
    history: "Plan R was the Austro-Hungarian contingency strategy designed to handle a sudden escalation of the Balkan conflict into a full-scale war with Russia. Rather than committing entirely to the invasion of Serbia (Plan B), Plan R diverted the bulk of the Austro-Hungarian military forces northward to Galicia to counter the massive Imperial Russian Army. The hasty redeployment of trains and troops caused massive logistical chaos and contributed to severe early defeats for the Dual Monarchy.",
    aboutImage: "/About/Plan-R-About.jpg",
    weaponPassive: {
      name: "Logistical Redeployment",
      desc: "When the active character's HP drops below 50%, they instantly regenerate 15 Energy and their active Elemental Skill cooldown is reduced by 50%. This effect can only trigger once every 20 seconds. Additionally, increases Energy Recharge by 25%."
    }
  },
  "Hundred Days Offensive": {
    id: "hundreddays", name: "Hundred Days Offensive", type: "weapon", rarity: 5, image: "/Tactics/KaiserSchlacht.jpg", element: "Geo",
    weaponType: "Strategic Plan",
    history: "The Hundred Days Offensive (or the Grand Offensive) was a series of massive, coordinated Allied attacks beginning with the Battle of Amiens in August 1918. Utilizing a combined-arms approach of infantry, tanks, artillery, and aircraft, the Allied forces systematically pushed the exhausted German army out of France and forced the collapse of the Hindenburg Line. It was the final, decisive period of the First World War, culminating in the Armistice of November 11, 1918.",
    aboutImage: "/About/KaiserSchlachtAbout.jpg",
    weaponPassive: {
      name: "Combined Arms Breakthrough",
      desc: "Increases Elemental Burst DMG by 24%. When the active character uses an Elemental Burst, all party members gain a 12% ATK bonus and 10% movement speed for 12 seconds. If a shield is active during the burst, the ATK bonus is doubled."
    }
  },
  "Austro-Hungary Empire": {
    id: "austria", name: "Kaiser Franz Joseph I", type: "character", rarity: 5, element: "Pyro", image: "/Franz Joseph I.jpg",
    weaponType: "Heavy Howitzer",
    history: "The Austro-Hungarian Empire, ruled by Kaiser Franz Joseph I, was a dual monarchy spanning Central Europe. Entering WWI after the assassination of Archduke Franz Ferdinand in Sarajevo, it fought on multiple fronts against Serbia, Russia, and Italy. Its multi-ethnic army struggled with cohesion, yet remained a formidable power until the Empire's dissolution in 1918.",
    kit: {
      normalAttack: { name: "Howitzer Barrage", desc: "Fires a volley of artillery shells dealing Pyro DMG to enemies in a frontal arc. Charged attack concentrates fire on a single target for massive Pyro DMG." },
      elementalSkill: { name: "Alpine Fortification", desc: "Erects a fortified position, granting a shield to all nearby allies and increasing their DEF. Enemies entering the zone are scorched by Pyro flames." },
      elementalBurst: { name: "Dual Monarchy Rally", desc: "Summons the combined might of Austria and Hungary, unleashing a grand Pyro explosion that deals massive AoE DMG and applies a persistent burning field for 8 seconds." }
    }
  },
  "German Empire": {
    id: "germany", name: "Kaiser Wilhelm II", type: "character", rarity: 5, element: "Electro", image: "/willhelm-2.jpg",
    weaponType: "Bolt-Action Rifle",
    history: "Kaiser Wilhelm II led the German Empire into WWI in August 1914, driven by a complex web of alliances and imperial ambitions. Germany's Schlieffen Plan aimed for a swift victory on two fronts but stalled at the Marne. German forces pioneered new tactics including stormtrooper infiltration, poison gas, and unrestricted submarine warfare, making them the most technically innovative power of the conflict.",
    kit: {
      normalAttack: { name: "Stormtrooper Strike", desc: "Delivers swift multi-hit melee combos imbued with Electro energy, representing the elite shock-troop tactics developed on the Western Front." },
      elementalSkill: { name: "U-Boot Blockade", desc: "Launches an Electro torpedo that tracks the nearest enemy, dealing heavy Electro DMG and applying Superconduct to reduce the target's physical resistance." },
      elementalBurst: { name: "Gotha Bomber Strike", desc: "Calls in a strategic aerial bombardment, dropping Electro charges across a wide area. Enemies caught in the blast are paralyzed and take continuous Electro DMG for 6 seconds." }
    }
  },
  "Great Britain": {
    id: "britain", name: "David Lloyd George", type: "character", rarity: 5, element: "Hydro", image: "/David_Lloyd_George.jpg",
    weaponType: "Dreadnought Cannon",
    history: "Under Prime Minister David Lloyd George, the British Empire mobilized resources from across its vast global territories. Britain dominated the seas with its Grand Fleet, enforcing a naval blockade that slowly strangled Germany's supply lines. The Western Front saw millions of British soldiers endure the trenches of France and Belgium, culminating in victories at the Hundred Days Offensive in 1918.",
    kit: {
      normalAttack: { name: "Grand Fleet Volley", desc: "Channels the power of the Royal Navy, firing Hydro-imbued shells that pierce through enemy formations and apply Wet status." },
      elementalSkill: { name: "Naval Blockade", desc: "Creates a Hydro barrier around the player that deflects projectiles. Enemies that strike the barrier are soaked and their ATK speed is reduced by 20%." },
      elementalBurst: { name: "Tank Mark I Vanguard", desc: "Deploys the world's first battle tank, a lumbering Hydro construct that charges forward crushing enemies and leaving a trail of Hydro energy that triggers Vaporize reactions." }
    }
  },
  "United States": {
    id: "us", name: "United States", type: "character", rarity: 5, element: "Dendro", image: "/Woodrow Wilson.jpg",
    weaponType: "Springfield Rifle",
    history: "President Woodrow Wilson kept the United States neutral until 1917, when German unrestricted submarine warfare and the Zimmermann Telegram forced America's hand. The arrival of fresh American troops and vast industrial resources proved decisive in breaking the stalemate. Wilson later championed the Fourteen Points, a visionary peace plan that shaped the post-war world order and formed the basis for the League of Nations.",
    kit: {
      normalAttack: { name: "Doughboy Assault", desc: "Launches a series of Dendro-infused rifle shots representing the fresh and determined AEF soldiers, each hit seeding Dendro cores on contact." },
      elementalSkill: { name: "Fourteen Points Doctrine", desc: "Inspires nearby allies, boosting their ATK by 18% and granting them Dendro infusion for 8 seconds. Represents Wilson's diplomatic strength and the power of American idealism." },
      elementalBurst: { name: "Liberty's Arsenal", desc: "Channels American industrial might to summon a cascade of Dendro-charged equipment drops across the battlefield, dealing massive AoE Dendro DMG and triggering Bloom or Quicken reactions with any existing elements." }
    }
  },
  "French Third Republic": {
    id: "french", name: "Raymond Poincaré", type: "character", rarity: 5, element: "Anemo", image: "/Raymond Poincare.jpg",
    weaponType: "Lebel Rifle",
    history: "President Raymond Poincaré steered France through its most devastating conflict since the Napoleonic Wars. France bore the brunt of the Western Front, with the Battle of Verdun and the Somme claiming hundreds of thousands of lives. The resilient French Army, known for its 'Furia Francese,' ultimately played a decisive role in the Allied victory, while French commanders like Foch and Pétain became legends of modern warfare.",
    kit: {
      normalAttack: { name: "Chasseur Advance", desc: "Dashes forward with Anemo-infused rifle strikes, each hit generating small gusts that briefly knock lighter enemies off balance." },
      elementalSkill: { name: "Verdun's Stand", desc: "Plants a flag that creates an Anemo vortex, pulling nearby enemies inward and dealing continuous Swirl DMG. Symbolizes France's unyielding defense at the Hell of Verdun." },
      elementalBurst: { name: "Furia Francese", desc: "Unleashes the legendary French fury: a massive Anemo cyclone tears across the battlefield dealing devastating AoE Swirl DMG. Amplifies all Elemental Reactions triggered within for 10 seconds." }
    }
  },
  "Russian Empire": {
    id: "russia", name: "Tsar Nicholas II", type: "character", rarity: 5, element: "Cryo", image: "/Tsar Nicholas II.jpg",
    weaponType: "Mosin-Nagant Rifle",
    history: "Tsar Nicholas II led Russia into WWI driven by Slavic solidarity and great-power ambitions. Russia's vast armies fought valiantly but were hampered by poor logistics, a shortage of supplies, and weak industrial output. The Eastern Front became a war of movement and brutal attrition. Internal pressures, military disasters, and food shortages ultimately sparked the February Revolution of 1917, ending the Romanov dynasty and forcing Russia out of the war.",
    kit: {
      normalAttack: { name: "Cossack Charge", desc: "Mounts a swift Cryo-infused cavalry strike, dealing Cryo DMG in a wide arc. Charged attack summons a full Cossack lance charge, dealing massive single-target Cryo DMG and Freezing the enemy." },
      elementalSkill: { name: "Siberian Winter", desc: "Summons the brutal Russian winter, flash-freezing the ground in a wide area around the player. Enemies stepping in the zone are continually Chilled, reducing their Movement SPD and triggering Superconduct." },
      elementalBurst: { name: "Brusilov Offensive", desc: "Channels the genius of Russia's most successful WWI operation, launching a coordinated Cryo blizzard across the entire field. All enemies are Frozen solid for 4 seconds, and upon thawing, take a massive Cryo Shatter explosion." }
    }
  },
  "Mirael": { id: "mirael", name: "Mirael", type: "character", rarity: 4, element: "Hydro", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop&auto=format" },
  "Theron": { id: "theron", name: "Theron", type: "character", rarity: 4, element: "Geo", image: "https://images.unsplash.com/photo-1522556189639-b150ed9c4330?w=400&h=600&fit=crop&auto=format" },
  "Celia": { id: "celia", name: "Celia", type: "character", rarity: 4, element: "Anemo", image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop&auto=format" },
  "Korvin": { id: "korvin", name: "Korvin", type: "character", rarity: 4, element: "Pyro", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop&auto=format" },
  "Seraphel": { id: "seraphel", name: "Seraphel", type: "character", rarity: 4, element: "Cryo", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&auto=format" },
  "Davan": { id: "davan", name: "Davan", type: "character", rarity: 4, element: "Electro", image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&h=600&fit=crop&auto=format" },
  "Lyris": { id: "lyris", name: "Lyris", type: "character", rarity: 4, element: "Hydro", image: "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=400&h=600&fit=crop&auto=format" },
  "Tamren": { id: "tamren", name: "Tamren", type: "character", rarity: 4, element: "Geo", image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=600&fit=crop&auto=format" },
  "Oryx": { id: "oryx", name: "Oryx", type: "character", rarity: 4, element: "Electro", image: "https://images.unsplash.com/photo-1500517895851-bc5f8f21de53?w=400&h=600&fit=crop&auto=format" },
  "Vael": { id: "vael", name: "Vael", type: "character", rarity: 4, element: "Pyro", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=600&fit=crop&auto=format" },
  "Senta": { id: "senta", name: "Senta", type: "character", rarity: 4, element: "Cryo", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop&auto=format" },
  "Tidal Whisper": { id: "tidal", name: "Tidal Whisper", type: "weapon", rarity: 4, image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=600&fit=crop&auto=format" },
  "Twilight Recurve": { id: "twilight", name: "Twilight Recurve", type: "weapon", rarity: 4, image: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=400&h=600&fit=crop&auto=format" },
  "Blackened Blade": { id: "blackened", name: "Blackened Blade", type: "weapon", rarity: 4, image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=400&h=600&fit=crop&auto=format" },
  "Harbinger's Edge": { id: "harbingersedge", name: "Harbinger's Edge", type: "weapon", rarity: 3, image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=400&h=600&fit=crop&auto=format" },
  "Skybane": { id: "skybane", name: "Skybane", type: "weapon", rarity: 3, image: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=400&h=600&fit=crop&auto=format" },
  "Void Hymn": { id: "voidhymn", name: "Void Hymn", type: "weapon", rarity: 3, image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop&auto=format" },
  "Ancient Iron": { id: "ancientiron", name: "Ancient Iron", type: "weapon", rarity: 3, image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=600&fit=crop&auto=format" },
  "Amber Dawn": { id: "amberdawn", name: "Amber Dawn", type: "weapon", rarity: 3, image: "https://images.unsplash.com/photo-1504700610630-ac6aba3536d3?w=400&h=600&fit=crop&auto=format" },
  "Crescent Pierce": { id: "crescentpierce", name: "Crescent Pierce", type: "weapon", rarity: 3, image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&h=600&fit=crop&auto=format" },
};

const POOL_3STAR = ["Harbinger's Edge", "Skybane", "Void Hymn", "Ancient Iron", "Amber Dawn", "Crescent Pierce"];
const POOL_4STAR_ALL = ["Mirael", "Theron", "Celia", "Korvin", "Seraphel", "Davan", "Lyris", "Tamren", "Oryx", "Vael", "Senta", "Tidal Whisper", "Twilight Recurve"];
const POOL_5STAR_STANDARD = ["Great Britain", "United States", "French Third Republic", "Russian Empire"];

// ─── Character Details Modal ───────────────────────────────────────────────────
function CharacterDetailsModal({ item, onClose }: { item: WishItem; onClose: () => void }) {
  const elementColor: Record<string, string> = {
    Pyro: "#ff6b35", Hydro: "#4fc3f7", Electro: "#c77dff",
    Anemo: "#7dc4a0", Geo: "#d4a017", Cryo: "#a8d8ea", Dendro: "#a5c83b",
  };
  const color = item.element ? elementColor[item.element] : "#e8d5a3";
  const stars = Array(item.rarity).fill("★").join("");

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

        {/* Modal */}
        <motion.div
          className="relative z-10 w-full max-w-3xl max-h-[88vh] flex rounded-2xl overflow-hidden shadow-2xl"
          style={{ border: `1px solid ${color}40`, background: "linear-gradient(135deg, rgba(8,12,28,0.97) 0%, rgba(12,18,38,0.97) 100%)" }}
          initial={{ scale: 0.88, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.88, y: 30, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left — image area */}
          <div className="hidden md:flex w-[42%] shrink-0 relative items-end justify-center overflow-hidden"
            style={{ background: `linear-gradient(160deg, ${color}18 0%, rgba(0,0,0,0) 60%)`, borderRight: `1px solid ${color}20` }}>
            {item.aboutImage ? (
              <img src={item.aboutImage} alt={item.name} className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-500" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-30">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                <p className="text-[10px] uppercase tracking-widest" style={{ color }}>Add Image</p>
              </div>
            )}
            {/* Element glow orb */}
            <div className="absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center text-xl"
              style={{ background: `${color}30`, border: `1px solid ${color}60` }}>
              {item.element ? ELEMENT_ICONS[item.element as ElementType] : "⚔"}
            </div>
          </div>

          {/* Right — info panel */}
          <div className="flex flex-col flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: `${color}50 transparent` }}>
            {/* Header */}
            <div className="sticky top-0 z-10 px-6 pt-6 pb-4" style={{ background: "linear-gradient(to bottom, rgba(8,12,28,1) 80%, transparent)", borderBottom: `1px solid ${color}20` }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] mb-1" style={{ color: `${color}aa` }}>
                    {item.type === "character" ? "Character" : "Weapon"} · {item.element ?? "—"}
                  </p>
                  <h2 className="text-2xl font-bold leading-tight" style={{ fontFamily: "'Cinzel Decorative', serif", color: "#e8d5a3", textShadow: `0 0 24px ${color}80` }}>
                    {item.name}
                  </h2>
                  <p className="mt-1 text-sm" style={{ color }}>{stars}</p>
                </div>
                <button onClick={onClose}
                  className="mt-1 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 shrink-0"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e8d5a3" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Weapon type badge */}
              {item.weaponType && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs"
                  style={{ background: `${color}18`, border: `1px solid ${color}40`, color }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M14.5 10.5L3 22M21 3l-7 7M21 3H15M21 3V9" />
                  </svg>
                  {item.weaponType}
                </div>
              )}
            </div>

            {/* Body */}
            <div className="px-6 py-4 flex flex-col gap-6">

              {/* History */}
              {item.history && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: `${color}80` }}>Historical Background</p>
                  <p className="text-[#c8cfe8] text-sm leading-relaxed">{item.history}</p>
                </div>
              )}

              {/* Kit */}
              {item.kit && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] mb-3" style={{ color: `${color}80` }}>Combat Kit</p>
                  <div className="flex flex-col gap-3">
                    {[
                      { label: "Normal Attack", icon: "⚔", data: item.kit.normalAttack },
                      { label: "Elemental Skill", icon: "✦", data: item.kit.elementalSkill },
                      { label: "Elemental Burst", icon: "◈", data: item.kit.elementalBurst },
                    ].map(({ label, icon, data }) => (
                      <div key={label} className="rounded-xl p-4" style={{ background: `${color}0d`, border: `1px solid ${color}25` }}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm" style={{ color }}>{icon}</span>
                          <span className="text-[10px] uppercase tracking-widest" style={{ color: `${color}99` }}>{label}</span>
                        </div>
                        <p className="font-semibold text-sm mb-1" style={{ color: "#e8d5a3", fontFamily: "'Cinzel', serif" }}>{data.name}</p>
                        <p className="text-[#8a9bc2] text-xs leading-relaxed">{data.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Weapon Passive */}
              {item.weaponPassive && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] mb-3" style={{ color: `${color}80` }}>Strategic Effect</p>
                  <div className="rounded-xl p-4" style={{ background: `${color}0d`, border: `1px solid ${color}25` }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm" style={{ color }}>✦</span>
                      <span className="text-[10px] uppercase tracking-widest" style={{ color: `${color}99` }}>Passive</span>
                    </div>
                    <p className="font-semibold text-sm mb-1" style={{ color: "#e8d5a3", fontFamily: "'Cinzel', serif" }}>{item.weaponPassive.name}</p>
                    <p className="text-[#8a9bc2] text-xs leading-relaxed">{item.weaponPassive.desc}</p>
                  </div>
                </div>
              )}

              {/* Fallback for items without detail data */}
              {!item.history && !item.kit && !item.weaponPassive && (
                <p className="text-[#8a9bc2] text-sm text-center py-8">No detailed data available for this item yet.</p>
              )}

              <div className="pb-2" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Pull Logic ────────────────────────────────────────────────────────────────
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateSinglePull(banner: Banner, pity5: number, pity4: number, guaranteed: boolean) {
  // ─── Step 1: Determine rarity ─────────────────────────────────────────────
  // Soft pity starts at pull 73. Every pull beyond 73 adds +6% to the base 0.6% rate.
  let rate5 = 0.006;
  if (pity5 >= 73) rate5 = Math.min(0.006 + (pity5 - 72) * 0.06, 1);
  const is5 = Math.random() < rate5 || pity5 >= 89; // hard pity at 90
  const is4 = !is5 && (Math.random() < 0.051 || pity4 >= 9); // hard pity at 10

  let item: WishItem;
  let newGuaranteed = guaranteed;

  // ─── Step 2: Pick item based on banner type ───────────────────────────────
  if (is5) {
    if (banner.type === "standard") {
      // Standard banner: always pull from the shared standard pool. No 50/50, no guarantee.
      item = WISH_ITEMS[pickRandom(POOL_5STAR_STANDARD)];
      newGuaranteed = false;

    } else if (banner.type === "weapon") {
      // Weapon banner: Epitomized Path style.
      // chosen weapon = featured5Stars[0] (Schlieffen Plan, etc.)
      // 50% → chosen weapon (win)
      // 50% → other featured weapons OR standard pool (loss) → guaranteed next 5★
      const chosenWeapon = banner.featured5Stars[0];
      const otherWeapons = banner.featured5Stars.slice(1); // the non-chosen featured weapons
      const lossPool = otherWeapons.length > 0 ? otherWeapons : POOL_5STAR_STANDARD;
      if (guaranteed) {
        item = WISH_ITEMS[chosenWeapon]; // guarantee consumed: always chosen weapon
        newGuaranteed = false;
      } else if (Math.random() < 0.5) {
        item = WISH_ITEMS[chosenWeapon]; // won 50/50 → chosen weapon
        newGuaranteed = false;
      } else {
        item = WISH_ITEMS[pickRandom(lossPool)] ?? WISH_ITEMS[pickRandom(POOL_5STAR_STANDARD)]; // lost 50/50
        newGuaranteed = true; // next 5★ is guaranteed chosen weapon
      }

    } else {
      // Limited character banner: classic 50/50 with guarantee.
      // If guaranteed (lost 50/50 last time) → always featured.
      // If not guaranteed → 50% chance featured, 50% chance standard pool.
      // On a loss (standard pool wins), set guaranteed = true for NEXT 5★.
      if (guaranteed) {
        item = WISH_ITEMS[banner.featured5Stars[0]];
        newGuaranteed = false; // guarantee consumed
      } else if (Math.random() < 0.5) {
        item = WISH_ITEMS[banner.featured5Stars[0]]; // won the 50/50
        newGuaranteed = false;
      } else {
        item = WISH_ITEMS[pickRandom(POOL_5STAR_STANDARD)]; // lost the 50/50
        newGuaranteed = true; // next 5★ is guaranteed featured
      }
    }

  } else if (is4) {
    // 4★: 50% chance to be a banner rate-up 4★, 50% from general pool
    if (Math.random() < 0.5 && banner.featured4Stars.length > 0) {
      const featName = pickRandom(banner.featured4Stars);
      item = WISH_ITEMS[featName] ?? WISH_ITEMS[pickRandom(POOL_4STAR_ALL)];
    } else {
      item = WISH_ITEMS[pickRandom(POOL_4STAR_ALL)];
    }

  } else {
    // 3★: always from 3★ pool
    item = WISH_ITEMS[pickRandom(POOL_3STAR)];
  }

  return {
    item: item ?? WISH_ITEMS["Harbinger's Edge"],
    newPity5: is5 ? 0 : pity5 + 1,
    newPity4: is5 || is4 ? 0 : pity4 + 1,
    newGuaranteed,
  };
}

function doWishes(count: 1 | 10, banner: Banner, pity5: number, pity4: number, guaranteed: boolean) {
  const results: WishItem[] = [];
  let p5 = pity5, p4 = pity4, g = guaranteed;
  for (let i = 0; i < count; i++) {
    const pull = generateSinglePull(banner, p5, p4, g);
    results.push(pull.item);
    p5 = pull.newPity5; p4 = pull.newPity4; g = pull.newGuaranteed;
  }
  return { results, finalPity5: p5, finalPity4: p4, finalGuaranteed: g };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PullCard({ item, delay = 0 }: { item: WishItem; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.75 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.4, type: "spring", bounce: 0.25 }}
      className={`relative overflow-hidden border-2 rounded-sm flex-shrink-0 ${RARITY_BORDER[item.rarity]} ${RARITY_GLOW[item.rarity]}`}
      style={{ width: 88, height: 128, background: RARITY_CARD_BG[item.rarity] }}
    >
      <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-90" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)" }} />

      {item.element && (
        <div className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center bg-black/50 text-xs">
          {ELEMENT_ICONS[item.element as ElementType]}
        </div>
      )}

      <div className="absolute bottom-0 inset-x-0 px-1.5 pb-1.5 text-center">
        <p className="text-[10px] leading-none mb-0.5" style={{ color: RARITY_STAR_COLOR[item.rarity] }}>
          {"★".repeat(item.rarity)}
        </p>
        <p className="text-white text-[9px] leading-tight truncate">{item.name}</p>
      </div>

      {item.rarity === 5 && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(105deg, transparent 30%, rgba(229,199,107,0.18) 50%, transparent 70%)" }}
          animate={{ backgroundPositionX: ["200%", "-200%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: delay + 0.5 }}
        />
      )}
    </motion.div>
  );
}

function PullResultsOverlay({ results, onClose }: { results: WishItem[]; onClose: () => void }) {
  const has5Star = results.some(r => r.rarity === 5);
  const starColor = has5Star ? "#e5c76b" : results.some(r => r.rarity === 4) ? "#c580d9" : "#5b9bd5";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      onClick={onClose}
    >
      <div className="absolute inset-0" style={{
        background: has5Star
          ? "radial-gradient(ellipse at 50% 40%, #2a1500 0%, #0a0800 50%, #000 100%)"
          : "radial-gradient(ellipse at 50% 40%, #0a0520 0%, #020110 50%, #000 100%)"
      }} />

      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: Math.random() * 2.5 + 0.5,
            height: Math.random() * 2.5 + 0.5,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: starColor,
          }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.8, 0] }}
          transition={{ duration: 2 + Math.random() * 2.5, delay: Math.random() * 3, repeat: Infinity }}
        />
      ))}

      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 60% 40% at 50% 50%, ${starColor}15 0%, transparent 70%)`,
      }} />

      <div className="relative z-10 flex flex-col items-center">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[#e8d5a3] text-xs uppercase tracking-[0.3em] mb-6"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {results.length > 1 ? "×10 Wish Results" : "Wish Result"}
        </motion.p>

        <div className={`flex flex-wrap justify-center gap-3 max-w-5xl px-6 ${results.length === 10 ? "gap-2" : "gap-4"}`}>
          {results.map((item, i) => (
            <PullCard key={i} item={item} delay={i * 0.07} />
          ))}
        </div>

        {has5Star && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: results.length * 0.07 + 0.4 }}
            className="mt-6 flex flex-col items-center gap-1"
          >
            {results.filter(r => r.rarity === 5).map((r, i) => (
              <p key={i} className="text-amber-400 text-sm uppercase tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>
                ✦ {r.name} — 5★ {r.type === "character" ? "Character" : "Weapon"} Obtained!
              </p>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: results.length * 0.07 + 0.7 }}
          className="mt-8 flex flex-col items-center gap-2"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
        >
          <button
            className="px-10 py-2.5 border border-[#c8a951]/70 rounded-sm text-[#c8a951] text-xs uppercase tracking-[0.2em] transition-all hover:bg-[#c8a951]/15"
            style={{ fontFamily: "'Cinzel', serif", background: "rgba(200,169,81,0.08)" }}
          >
            Confirm
          </button>
          <p className="text-[#8a9bc2] text-[10px]">Click anywhere to close</p>
        </motion.div>
      </div>
    </motion.div>
  );
}

function DetailsModal({ banner, pity, onClose }: { banner: Banner; pity: PityState; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="rounded-sm border border-[#c8a951]/30 max-w-md w-full mx-4 p-6 max-h-[80vh] overflow-y-auto"
        style={{ background: "#08101e", scrollbarWidth: "none" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-1">
          <p className="text-[#c8a951] text-xs uppercase tracking-[0.2em]" style={{ fontFamily: "'Cinzel', serif" }}>
            {banner.label}
          </p>
          <button onClick={onClose} className="text-[#8a9bc2] hover:text-[#e8d5a3] w-6 h-6 flex items-center justify-center">✕</button>
        </div>
        <h3 className="text-[#e8d5a3] text-lg mb-3" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
          {Array.isArray(banner.title) ? banner.title.join(" · ") : banner.title}
        </h3>
        <div className="h-px bg-gradient-to-r from-[#c8a951]/50 to-transparent mb-4" />

        <p className="text-[#8a9bc2] text-[10px] uppercase tracking-wider mb-2">Base Probability</p>
        <div className="rounded-sm border border-[#c8a951]/15 overflow-hidden mb-5">
          {[
            { label: "5★ Item", rate: "0.600%", color: "#e5c76b" },
            { label: "4★ Item", rate: "5.100%", color: "#c580d9" },
            { label: "3★ Item", rate: "94.300%", color: "#5b9bd5" },
          ].map((r, i) => (
            <div key={i} className={`flex justify-between items-center px-3 py-2 ${i < 2 ? "border-b border-[#c8a951]/10" : ""}`}
              style={{ background: i === 0 ? "rgba(229,199,107,0.06)" : i === 1 ? "rgba(197,128,217,0.06)" : "transparent" }}>
              <span className="text-xs" style={{ color: r.color }}>{"★".repeat(parseInt(r.label[0]))} {r.label}</span>
              <span className="text-[#8a9bc2] text-xs font-mono">{r.rate}</span>
            </div>
          ))}
        </div>

        <div className="border border-[#c8a951]/20 rounded-sm p-3 mb-5" style={{ background: "rgba(200,169,81,0.06)" }}>
          <p className="text-[#c8a951] text-[10px] font-display uppercase mb-1">Soft & Hard Pity</p>
          <p className="text-[#8a9bc2] text-[10px] leading-relaxed">
            From pull 74 onward, 5★ rate increases with each pull. At pull 90, a 5★ item is guaranteed.
            {banner.type === "limited" && " Limited banner runs 50/50 — if the 50/50 is lost, the next 5★ is guaranteed featured."}
          </p>
          <p className="text-[#c8a951] text-[10px] mt-2">
            Your pity: <span className="text-[#e8d5a3]">{pity.count5}/90</span>
            {pity.guaranteed && <span className="text-amber-400 ml-2">· Guaranteed featured</span>}
          </p>
        </div>

        <p className="text-[#8a9bc2] text-[10px] uppercase tracking-wider mb-2">Featured 5★</p>
        {banner.featured5Stars.map((name) => {
          const item = WISH_ITEMS[name];
          if (!item) return null;
          return (
            <div key={name} className="flex items-center gap-3 mb-2 p-2 rounded-sm border border-amber-400/25" style={{ background: "rgba(229,199,107,0.07)" }}>
              <div className="w-10 h-12 rounded-sm overflow-hidden flex-shrink-0 border border-amber-400/40">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-amber-400 text-xs" style={{ fontFamily: "'Cinzel', serif" }}>{item.name}</p>
                <p className="text-[#e5c76b] text-[10px]">★★★★★</p>
                {item.element && <p className="text-[#8a9bc2] text-[10px]">{ELEMENT_ICONS[item.element as ElementType]} {item.element} · {item.type === "character" ? "Character" : "Weapon"}</p>}
              </div>
              {banner.type !== "standard" && <div className="ml-auto bg-[#c8a951]/20 border border-[#c8a951]/40 rounded-sm px-2 py-0.5"><span className="text-[#c8a951] text-[9px] uppercase">Rate Up</span></div>}
            </div>
          );
        })}

        <p className="text-[#8a9bc2] text-[10px] uppercase tracking-wider mt-4 mb-2">Featured 4★ Rate-Up</p>
        <div className="grid grid-cols-3 gap-2">
          {banner.featured4Stars.slice(0, 3).map((name) => {
            const item = WISH_ITEMS[name];
            if (!item) return null;
            return (
              <div key={name} className="flex flex-col items-center gap-1 p-2 rounded-sm border border-purple-400/20" style={{ background: "rgba(197,128,217,0.06)" }}>
                <div className="w-10 h-10 rounded-sm overflow-hidden border border-purple-400/30">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-purple-400 text-[9px] text-center">{item.name}</p>
                <p className="text-[#c580d9] text-[9px]">★★★★</p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

function WishButton({
  count, currency, available, primogems, onClick
}: {
  count: 1 | 10; currency: "intertwined" | "acquaint"; available: number; primogems: number; onClick: () => void;
}) {
  const fateCost = count;
  const primoCost = count * 160;
  const canAfford = available >= fateCost || primogems >= primoCost;
  const label = currency === "intertwined" ? "Intertwined Fate" : "Acquaint Fate";

  return (
    <button
      onClick={onClick}
      disabled={!canAfford}
      className="relative w-full overflow-hidden transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
      style={{ borderRadius: 2 }}
    >
      <div
        className="px-4 py-3 border"
        style={{
          background: canAfford
            ? "linear-gradient(180deg, #d9a94e 0%, #c08235 50%, #8f5a18 100%)"
            : "linear-gradient(180deg, #3a3a3a, #252525)",
          borderColor: canAfford ? "rgba(229,199,107,0.8)" : "rgba(100,100,100,0.4)",
          borderRadius: 2,
        }}
      >
        <p className="text-white text-sm text-left" style={{ fontFamily: "'Cinzel', serif", letterSpacing: "0.05em" }}>
          Wish ×{count}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[#ffe0a0] text-xs">✦</span>
          <span className="text-[#ffe0a0] text-[11px]">{label} ×{count}</span>
        </div>
      </div>
      {canAfford && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.12) 50%, transparent 65%)" }}
          animate={{ x: ["-150%", "150%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
        />
      )}
    </button>
  );
}

function CurrencyBadge({ icon, value, label }: { icon: string; value: number; label?: string }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border border-[#c8a951]/20" style={{ background: "rgba(0,0,0,0.55)" }}>
      <span className="text-base leading-none">{icon}</span>
      <div>
        <p className="text-[#e8d5a3] text-xs leading-none">{value.toLocaleString()}</p>
        {label && <p className="text-[#8a9bc2] text-[9px] leading-none mt-0.5">{label}</p>}
      </div>
    </div>
  );
}

// ─── Split Thumbnail for Weapon/Standard banners ───────────────────────────────
function BannerThumb({ banner, isActive }: { banner: Banner; isActive: boolean }) {
  const imgs = banner.thumbImages;
  return (
    <div className="w-full h-full relative overflow-hidden">
      {imgs.length >= 2 ? (
        // Split view: two images side by side with diagonal divider
        <>
          <div className="absolute inset-0 flex">
            <div className="w-1/2 h-full overflow-hidden">
              <img src={imgs[0]} alt="" className="w-full h-full object-cover scale-110" />
            </div>
            <div className="w-1/2 h-full overflow-hidden">
              <img src={imgs[1]} alt="" className="w-full h-full object-cover scale-110" />
            </div>
          </div>
          {/* Diagonal divider line */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "linear-gradient(105deg, transparent 48%, rgba(200,169,81,0.6) 49%, rgba(200,169,81,0.6) 51%, transparent 52%)"
          }} />
        </>
      ) : (
        <img src={imgs[0]} alt="" className="w-full h-full object-cover" />
      )}
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.28)" }} />
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function GachaScreen({ onBack, onHistory }: { onBack: () => void; onHistory: () => void }) {
  const [bannerIndex, setBannerIndex] = useState(0);
  const [charSlide, setCharSlide] = useState(0); // which charImage is shown
  const [showDetails, setShowDetails] = useState(false);
  const [detailItem, setDetailItem] = useState<WishItem | null>(null);
  const [wishPhase, setWishPhase] = useState<"idle" | "wishing" | "results">("idle");
  const [wishResults, setWishResults] = useState<WishItem[]>([]);

  const [pityMap, setPityMap] = useState<Record<string, PityState>>({
    ember: { count5: 43, count4: 3, guaranteed: false },
    tempest: { count5: 12, count4: 7, guaranteed: false },
    weapon: { count5: 28, count4: 2, guaranteed: false },
    standard: { count5: 55, count4: 1, guaranteed: false },
  });

  const [currencies, setCurrencies] = useState({ primogems: 99999999999999, intertwined: 99999999999999, acquaint: 99999999999999, mora: 99999999999999 });

  const activeBanner = BANNERS[bannerIndex];
  const activePity = pityMap[activeBanner.id];
  const totalSlides = activeBanner.charImages.length;

  // Reset slide index when banner changes
  const handleBannerChange = (i: number) => {
    setBannerIndex(i);
    setCharSlide(0);
  };

  const handleWish = useCallback((count: 1 | 10) => {
    const { results, finalPity5, finalPity4, finalGuaranteed } = doWishes(
      count, activeBanner, activePity.count5, activePity.count4, activePity.guaranteed
    );
    const fateCurrency = activeBanner.fateCurrency;
    setCurrencies((prev) => {
      const avail = prev[fateCurrency];
      if (avail >= count) return { ...prev, [fateCurrency]: avail - count };
      const primosNeeded = (count - avail) * 160;
      return { ...prev, [fateCurrency]: 0, primogems: prev.primogems - primosNeeded };
    });
    setPityMap((prev) => ({
      ...prev,
      [activeBanner.id]: { count5: finalPity5, count4: finalPity4, guaranteed: finalGuaranteed },
    }));
    setWishResults(results);
    setWishPhase("wishing");
    setTimeout(() => setWishPhase("results"), 900);
  }, [activeBanner, activePity]);

  const pityPercent = (activePity.count5 / 90) * 100;
  const fateAvail = currencies[activeBanner.fateCurrency];

  const currentElement = (Array.isArray(activeBanner.element) ? activeBanner.element[charSlide] ?? activeBanner.element[0] : activeBanner.element) as ElementType;
  const currentElementColor = Array.isArray(activeBanner.elementColor) ? activeBanner.elementColor[charSlide] ?? activeBanner.elementColor[0] : activeBanner.elementColor;
  const currentBgImage = Array.isArray(activeBanner.bgImage) ? activeBanner.bgImage[charSlide] ?? activeBanner.bgImage[0] : activeBanner.bgImage;

  return (
    <div className="fixed inset-0 overflow-hidden select-none" style={{ fontFamily: "'Lato', sans-serif" }}>

      {/* ─── Background ─── */}
      <AnimatePresence mode="wait">
        <motion.div key={activeBanner.id + "-bg-" + charSlide} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }} className="absolute inset-0">
          <img src={currentBgImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 transition-colors duration-500" style={{ background: `radial-gradient(ellipse 80% 60% at 70% 40%, ${currentElementColor}22 0%, transparent 70%)` }} />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.4) 100%)" }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to right, transparent 40%, rgba(0,0,0,0.55) 100%)" }} />

      {/* ─── Character Art (with slide) ─── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeBanner.id + "-char-" + charSlide}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.55 }}
          className="absolute bottom-24 left-0 pointer-events-none"
          style={{ width: "58%", height: "calc(100% - 56px - 100px)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
        >
          <img
            src={activeBanner.charImages[charSlide]}
            alt={activeBanner.featured5Stars[charSlide] ?? activeBanner.featured5Stars[0]}
            className="h-full max-h-full w-auto object-contain object-bottom transition-all duration-500"
            style={{
              filter: `drop-shadow(0 0 50px ${currentElementColor}50) drop-shadow(0 8px 24px rgba(0,0,0,0.7))`,
              transform: activeBanner.type === "weapon" ? "scale(0.80) translateY(-5%)" : "none"
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* ─── Char Slide Arrows (only when multiple images) ─── */}
      {totalSlides > 1 && (
        <>
          <div className="absolute pointer-events-auto z-10 flex items-center justify-between"
            style={{
              top: "50%",
              transform: "translateY(-50%)",
              left: "2%",
              width: "54%",
              padding: "0 1rem"
            }}>
            {/* Left arrow */}
            <button
              onClick={() => setCharSlide((s) => (s - 1 + totalSlides) % totalSlides)}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center border-2 border-[#c8a951]/50 hover:bg-[#c8a951]/20 hover:scale-110 transition-all backdrop-blur-sm shadow-lg"
              style={{ background: "rgba(4,10,22,0.7)" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="#e8d5a3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Right arrow */}
            <button
              onClick={() => setCharSlide((s) => (s + 1) % totalSlides)}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center border-2 border-[#c8a951]/50 hover:bg-[#c8a951]/20 hover:scale-110 transition-all backdrop-blur-sm shadow-lg"
              style={{ background: "rgba(4,10,22,0.7)" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="#e8d5a3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Dot indicators */}
          <div className="absolute pointer-events-auto z-10 flex items-center justify-center gap-2"
            style={{ bottom: "calc(100px + 24px)", left: "0", width: "58%" }}>
            {activeBanner.charImages.map((_, idx) => (
              <button key={idx} onClick={() => setCharSlide(idx)}
                className="rounded-full transition-all hover:scale-110"
                style={{
                  width: idx === charSlide ? 24 : 8,
                  height: 8,
                  background: idx === charSlide ? "#c8a951" : "rgba(200,169,81,0.35)",
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* ─── Banner Title Overlay (left side) ─── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeBanner.id + "-text-" + charSlide}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="absolute left-6 bottom-16 pointer-events-none"
        >
          <p className="text-[#8a9bc2] text-[10px] uppercase tracking-[0.3em] mb-1.5">{activeBanner.label}</p>
          <div className="flex items-center gap-3 pointer-events-auto">
            <h1 style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 28, color: "#e8d5a3", textShadow: "0 2px 20px rgba(0,0,0,0.9)", lineHeight: 1.2 }}>
              {Array.isArray(activeBanner.title) ? (activeBanner.title[charSlide] ?? activeBanner.title[0]) : activeBanner.title}
            </h1>
            <button
              onClick={() => {
                const charName = activeBanner.featured5Stars[charSlide] ?? activeBanner.featured5Stars[0];
                const item = WISH_ITEMS[charName];
                if (item) { setDetailItem(item); }
              }}
              className="w-7 h-7 rounded-full bg-black/40 border border-[#e8d5a3]/40 flex items-center justify-center hover:bg-[#e8d5a3]/20 transition-all hover:scale-110 backdrop-blur-sm shadow-lg"
              title="View Details"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e8d5a3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
            </button>
          </div>
          <p className="mt-2 text-xs transition-colors duration-500" style={{ color: currentElementColor }}>
            {ELEMENT_ICONS[currentElement]} {activeBanner.featured5Stars[charSlide] ?? activeBanner.featured5Stars[0]}
          </p>
          <p className="text-[#8a9bc2] text-[10px] mt-0.5">
            {activeBanner.endDate === "Permanent" ? "Permanent" : `Ends ${activeBanner.endDate}`}  ·  v{activeBanner.version}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* ─── Top Bar ─── */}
      <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-3 md:px-5 h-14"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.72), transparent)" }}>
        <button onClick={onBack} className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11.5 4L6.5 9L11.5 14" stroke="#e8d5a3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[#e8d5a3] text-xs uppercase tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>Menu</span>
        </button>

        <p className="text-[#e8d5a3] text-sm uppercase tracking-[0.25em]" style={{ fontFamily: "'Cinzel', serif" }}>
          ✦ Wish
        </p>

        <div className="flex items-center gap-1.5 md:gap-2">
          <CurrencyBadge icon="💎" value={currencies.primogems} label="Primogem" />
          <CurrencyBadge icon="✦" value={currencies.intertwined} label="Intertwined" />
          <CurrencyBadge icon="◈" value={currencies.acquaint} label="Acquaint" />
          <CurrencyBadge icon="🪙" value={currencies.mora} label="Mora" />
        </div>
      </div>

      {/* ─── Right Panel ─── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeBanner.id + "-panel"}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.35 }}
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10"
          style={{ width: 262 }}
        >
          <div className="rounded-sm border border-[#c8a951]/28 p-5" style={{ background: "rgba(4,10,22,0.84)", backdropFilter: "blur(8px)" }}>
            <p className="text-[#8a9bc2] text-[10px] uppercase tracking-[0.2em]">{activeBanner.label}</p>
            <div className="my-3 h-px" style={{ background: "linear-gradient(to right, rgba(200,169,81,0.7), rgba(200,169,81,0.1), transparent)" }} />

            <p className="text-[#8a9bc2] text-[10px] mb-1">{activeBanner.type === "weapon" ? "Featured Weapon" : "Featured Character Of : "}</p>
            <div className="flex items-center gap-2 mb-0.5 transition-colors duration-500">
              <span style={{ color: currentElementColor, fontSize: 14 }}>{ELEMENT_ICONS[currentElement]}</span>
              <p className="text-[#e8d5a3] text-xl leading-tight" style={{ fontFamily: "'Cinzel', serif" }}>
                {activeBanner.featured5Stars[charSlide] ?? activeBanner.featured5Stars[0]}
              </p>
            </div>
            <p className="text-[11px] mb-0.5" style={{ color: RARITY_STAR_COLOR[5] }}>★★★★★</p>
            <p className="text-[#8a9bc2] text-[10px] mb-4">
              4★ Rate Up: {activeBanner.featured4Stars.slice(0, 3).join(" · ")}
            </p>

            <div className="flex flex-col gap-2 mb-3">
              <WishButton count={1} currency={activeBanner.fateCurrency} available={fateAvail} primogems={currencies.primogems} onClick={() => handleWish(1)} />
              <WishButton count={10} currency={activeBanner.fateCurrency} available={fateAvail} primogems={currencies.primogems} onClick={() => handleWish(10)} />
            </div>

            <div className="flex items-center justify-between">
              <button onClick={() => setShowDetails(true)} className="text-[#8a9bc2] hover:text-[#c8a951] text-[11px] flex items-center gap-1 transition-colors">
                <span>ⓘ</span> Details
              </button>
              <button onClick={onHistory} className="text-[#8a9bc2] hover:text-[#c8a951] text-[11px] transition-colors">
                History →
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-[#c8a951]/18">
              <div className="flex justify-between items-center mb-1.5">
                <p className="text-[#8a9bc2] text-[10px]">Pity: {activePity.count5}/90</p>
                {activeBanner.type === "standard" ? (
                  <p className="text-[#8a9bc2] text-[10px]">Standard Pool</p>
                ) : activeBanner.type === "weapon" && activePity.guaranteed ? (
                  <p className="text-amber-400 text-[10px]">★ Guaranteed</p>
                ) : activeBanner.type === "weapon" ? (
                  <p className="text-[#8a9bc2] text-[10px]">50/50</p>
                ) : activePity.guaranteed ? (
                  <p className="text-amber-400 text-[10px]">★ Guaranteed</p>
                ) : (
                  <p className="text-[#8a9bc2] text-[10px]">50/50</p>
                )}
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${pityPercent}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  style={{ background: pityPercent >= 80 ? "#e5c76b" : "#3a6fa5" }}
                />
              </div>
              {activePity.count5 >= 73 && (
                <p className="text-amber-400 text-[10px] mt-1">Soft pity active — increased rate!</p>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ─── Banner Tabs ─── */}
      <div className="absolute bottom-0 inset-x-0 z-10 flex items-end justify-center pb-3 gap-3"
        style={{ height: 100, background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 100%)" }}>
        {BANNERS.map((b, i) => (
          <motion.button
            key={b.id}
            onClick={() => handleBannerChange(i)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="relative overflow-hidden flex-shrink-0 transition-all"
            style={{
              width: 72, height: 80,
              border: i === bannerIndex ? "2px solid #c8a951" : "2px solid rgba(255,255,255,0.18)",
              borderRadius: 2,
              boxShadow: i === bannerIndex ? "0 0 16px rgba(200,169,81,0.65), 0 0 4px rgba(200,169,81,0.3) inset" : "none",
              opacity: i === bannerIndex ? 1 : 0.65,
            }}
          >
            <BannerThumb banner={b} isActive={i === bannerIndex} />
            <div className="absolute bottom-0 inset-x-0 py-1 px-1" style={{ background: "rgba(0,0,0,0.72)" }}>
              <p className="text-white text-[8px] text-center leading-tight line-clamp-2">
                {b.label}
              </p>
            </div>
            {i === bannerIndex && <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#c8a951]" />}
          </motion.button>
        ))}
      </div>

      {/* ─── Wishing Spinner ─── */}
      <AnimatePresence>
        {wishPhase === "wishing" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/92">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              className="w-14 h-14 rounded-full border border-[#c8a951]/20 border-t-[#c8a951] mb-4"
            />
            <p className="text-[#c8a951] text-xs uppercase tracking-[0.3em]" style={{ fontFamily: "'Cinzel', serif" }}>
              Wishing...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Results ─── */}
      <AnimatePresence>
        {wishPhase === "results" && (
          <PullResultsOverlay results={wishResults} onClose={() => setWishPhase("idle")} />
        )}
      </AnimatePresence>

      {/* ─── Details Modal ─── */}
      <AnimatePresence>
        {showDetails && <DetailsModal banner={activeBanner} pity={activePity} onClose={() => setShowDetails(false)} />}
      </AnimatePresence>

      {/* ─── Character Details Modal ─── */}
      <AnimatePresence>
        {detailItem && <CharacterDetailsModal item={detailItem} onClose={() => setDetailItem(null)} />}
      </AnimatePresence>
    </div>
  );
}
