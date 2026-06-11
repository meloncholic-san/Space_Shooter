# 🚀 Space Shooter

2D space shooter game built with **PixiJS + TypeScript + Vite**.

## Features

- Level-based gameplay (Level 1 → Level 2 Boss)
- Asteroid destruction system
- Boss with multiple attack patterns
- Player shooting system with limited ammo
- Collision system (bullets, enemies, boss)
- Game UI (timer, ammo counter, HP bar)
- Win / Lose scenes
- Strong Object-Oriented Programming approach

## Boss mechanics

- HP system (4 hits to destroy)
- Phase-based attacks:
  - 3+ HP → single shot
  - 2–3 HP → triple spread shot
  - ≤2 HP → 5-way spread attack
- Horizontal movement within screen bounds
- Shoots every 2 seconds

## Tech Stack

- TypeScript
- PixiJS
- Vite
- GitHub Pages (deployment)

## Build & Run

### Install dependencies
```bash
npm install
npm run dev

Live-demo version: https://meloncholic-san.github.io/Space_Shooter/