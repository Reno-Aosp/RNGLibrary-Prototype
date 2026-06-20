https://random-num-gen-gacha.vercel.app/  //Realtime Access Vercel

<img width="1919" height="921" alt="Screenshot 2026-06-18 220954" src="https://github.com/user-attachments/assets/c63199a8-579f-4522-a353-256b8c52b4bf" />
<img width="1919" height="923" alt="Screenshot 2026-06-18 220947" src="https://github.com/user-attachments/assets/dbcfb700-d502-4c92-8cbd-434a10307d67" />
<img width="1919" height="923" alt="Screenshot 2026-06-18 220927" src="https://github.com/user-attachments/assets/22d81385-21c3-490a-9ac5-2bb7bc5b0d9d" />
<img width="1919" height="926" alt="Screenshot 2026-06-17 183921" src="https://github.com/user-attachments/assets/88194607-0df7-495c-88cc-c33e67575e83" />
<img width="1919" height="921" alt="Screenshot 2026-06-17 183904" src="https://github.com/user-attachments/assets/c336adbd-728c-4b34-a04f-5e75132ffc99" />
<img width="1917" height="915" alt="Screenshot 2026-06-17 183350" src="https://github.com/user-attachments/assets/097a32a5-33d8-4306-b364-2dd2303052a4" />
<img width="1915" height="917" alt="Screenshot 2026-06-17 182011" src="https://github.com/user-attachments/assets/80ca1437-1d57-4754-befb-b549964451e3" />
<img width="1919" height="917" alt="Screenshot 2026-06-17 181544" src="https://github.com/user-attachments/assets/f0102273-9e0f-4e7c-b389-0af5357f730e" />
<img width="926" height="802" alt="Screenshot 2026-06-17 181500" src="https://github.com/user-attachments/assets/56722ecd-6749-4a76-982b-9c1c11f3ba9d" />
<img width="1919" height="924" alt="Screenshot 2026-06-17 181316" src="https://github.com/user-attachments/assets/d88de311-4f46-4e64-ad9a-abe8e3e6cd66" />
<img width="915" height="806" alt="Screenshot 2026-06-17 181048" src="https://github.com/user-attachments/assets/c9ce1d79-dbd2-4367-978b-d218b92648ee" />
<img width="962" height="813" alt="Screenshot 2026-06-17 180851" src="https://github.com/user-attachments/assets/e669b539-572d-44b4-b18c-183198fc4b28" />
<img width="1919" height="922" alt="Screenshot 2026-06-17 180621" src="https://github.com/user-attachments/assets/68754430-f242-453c-90d9-363781fd14a2" />
<img width="1919" height="911" alt="Screenshot 2026-06-17 180252" src="https://github.com/user-attachments/assets/e2db36ea-5de6-4386-b08f-8dbc39fad4d8" />
<img width="1919" height="905" alt="Screenshot 2026-06-17 175824" src="https://github.com/user-attachments/assets/a9faf306-6db7-4fd0-95e8-2989787ab361" />
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
