# SmartShelters — EVE Frontier × Sui

**A tribe-agnostic Smart Assembly for secure ship storage in Shelters & Heavy Shelters.**

Built for the EVE Frontier ecosystem after the Sui migration (March 2026).

## What it does

- Anyone can create a **Smart Shelter** (no manual tribe input required).
- Automatically detects the owner's current tribe using official `world::tribe`.
- Tiered access based on **personal standings** set by the shelter owner:
  - Basic tribe members → Shuttles / Corvettes
  - Good standing → + Frigates
  - Excellent standing → + Destroyers, Cruisers, Battlecruisers
- Shelter **owner** always has full access to all stored ships.
- All logic (including standing checks) happens on-chain in a single transaction.
- Supports both standard Shelters and Heavy Shelters.

Ships can be deposited and withdrawn using the clean React frontend.

## Features

- Fully on-chain access control using official EVE Frontier contracts
- Automatic loading of owned shelters when wallet connects
- Simple deposit/withdraw UI with real-time feedback
- Compatible with zkLogin and sponsored transactions
- Clean, dark sci-fi UI styled for the Frontier

## Tech Stack

- **Smart Contract**: Sui Move (Smart Assembly)
- **Frontend**: React + TypeScript + Vite
- **Wallet & Blockchain**: `@mysten/dapp-kit` + `@mysten/sui`
- **Styling**: Inline + custom dark theme
- **Deployment**: Vercel (auto-deploys on push to `main`)

## How to Test / Deploy

1. Clone the repo
2. `npm install`
3. `npm run dev` for local development
4. Deploy the Move module using the deploy script
5. Push to GitHub → automatic Vercel deployment

Live Demo: https://smart-shelters-8nz70k015-brettius31337s-projects.vercel.app/

## Live Demo

https://smart-shelters-8nz70k015-brettius31337s-projects.vercel.app/

---

**Submitted for the DeepSurge EVE Frontier Hackathon 2026**
