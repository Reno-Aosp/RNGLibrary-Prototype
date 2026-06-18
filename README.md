# 🌍 WW1 Gacha Simulator (RNGLibrary Prototype)

A fully functional, Genshin-style Gacha Simulator built with React, Vite, and Tailwind CSS. Instead of fantasy characters, this simulator allows you to pull for historical World War 1 figures, factions, and strategic tactics!

## 📸 Project Overview

*(Drag and drop your UI screenshots here when editing this file on GitHub!)*

### 🎖️ Featured Banners
The application features three distinct types of banners with accurate pity and 50/50 logic:
- **Limited Character Banners:** Pull for legendary leaders like Kaiser Wilhelm II and Emperor Franz Joseph I. Features a 90-pull pity system with a 50/50 guarantee mechanic.
- **Tactics (Weapon) Banner:** Pull for strategic historical battle plans like the *Schlieffen Plan* or *Hundred Days Offensive*. Features a dedicated 50/50 system that guarantees your selected weapon path if you lose.
- **Permanent Standard Banner:** A balanced pool featuring the leaders of the Allied Powers (David Lloyd George, Woodrow Wilson, Raymond Poincaré, Tsar Nicholas II) with an equal 25% drop rate and no 50/50 restriction.

### 📚 Historical Lore & Kits
Each character and weapon comes with meticulously crafted descriptions detailing their historical background and an imagined RPG combat kit (Normal Attack, Elemental Skill, Elemental Burst). Click the **Details** button on any character to view their historical impact.

## 🛠️ Technology Stack
- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS & Framer Motion (for smooth, dynamic animations)
- **Deployment:** Vercel

## 🚀 Getting Started

To run this project locally on your machine:

1. **Navigate to the UI folder:**
   ```bash
   cd "UI,UX"
   ```
2. **Install dependencies:**
   ```bash
   pnpm install
   ```
3. **Start the development server:**
   ```bash
   pnpm run dev
   ```

Visit `http://localhost:5173` to start pulling!

## 🎮 How the Logic Works
- **Currencies:** Start with an infinite pool of Primogems, Intertwined Fates, Acquaint Fates, and Mora.
- **Pity System:** Individual pity trackers are mapped to each banner. Standard rates apply: 0.6% chance for a 5-star, with soft pity mechanics approaching 90 pulls.
- **Epitomized Path (Tactics Banner):** If you fail to get your target 5-star strategy, your next 5-star is guaranteed to be your chosen path.
