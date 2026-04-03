# SmartShelters — EVE Frontier × Sui

**A Smart Storage-hosted dApp for advanced ship management in Shelters & Heavy Shelters.**

Submitted for the DeepSurge EVE Frontier Hackathon 2026.

### What it does

This dApp is hosted on a **Smart Storage Unit** and provides enhanced ship storage and management for official Shelters and Heavy Shelters.

- Currently supports depositing and withdrawing ships from a configured Shelter.
- Uses dynamic fields on the official `world::assembly::Assembly` for storage.
- Clean, dark sci-fi interface optimized for in-game use.
- Designed to eventually support tribe membership and standings-based access control (owner = full access, tribe members get tiered access to ship classes).

The dApp is intentionally hosted on a Smart Storage Unit because attaching dApps directly to Shelters has proven unreliable in the current game build.

### Features

- Hosted on Smart Storage Unit (reliable dApp attachment point)
- Controls any Shelter or Heavy Shelter (configurable via settings gear — owner only)
- Real-time ship deposit and withdrawal
- Clean monospace UI styled for EVE Frontier
- Built with latest post-migration Sui + dapp-kit patterns
- Persistent configuration using browser localStorage

### How to Use

1. Deploy the frontend (already live on Vercel).
2. In-game, find a Smart Storage Unit you own.
3. Add the Vercel URL as the dApp link on that Storage Unit.
4. Connect your wallet in the dApp.
5. (Optional) Click the ⚙️ gear (only visible to the Storage Unit owner) to configure which Shelter it controls.

Live Demo: https://smart-shelters-8nz70k015-brettius31337s-projects.vercel.app/

### Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Wallet & Blockchain**: `@mysten/dapp-kit` + `@mysten/sui`
- **Smart Contract**: Sui Move with dynamic fields on official `world::assembly::Assembly`
- **Styling**: Custom dark sci-fi theme
- **Deployment**: Vercel (auto-deploys on `main`)

### Future Plans

- Full tribe membership and standings-based access control (Shuttles/Corvettes → Frigates/Destroyers → Cruisers/Battlecruisers based on standing)
- Drag & drop ship management
- Support for multiple controlled Shelters
- Board and repackage functions

**Submitted for the DeepSurge EVE Frontier Hackathon 2026**  
Category: Utility + Live Frontier Integration

Made for the Frontier community.
