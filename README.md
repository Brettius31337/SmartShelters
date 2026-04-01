\# SmartShelters — EVE Frontier × Sui 2026 Hackathon Entry



\*\*A tribe-agnostic Smart Assembly for ship swapping in Shelters \& Heavy Shelters\*\*



\*\*Theme:\*\* "A Toolkit for Civilization"  

\*\*Category:\*\* Utility + Live Frontier Integration



\## What it does

\- Anyone can create a Smart Shelter (no manual tribe input).

\- Automatically ties to the owner's current tribe (official `world::tribe`).

\- Tiered access based on \*\*personal standings the owner has set\*\*:

&#x20; - Tribe member only → Shuttles / Corvettes

&#x20; - + Good standing → + Frigates

&#x20; - + Excellent standing → + Destroyers / Cruisers / Battlecruisers

\- Shelter \*\*owner\*\* always has full access to every ship.

\- All checks happen on-chain in one transaction (official `world::standing` + `world::tribe`).

\- Full error detection and clear feedback for players.



Works with \*\*both\*\* core Shelter and Heavy Shelter Object IDs.



\## Tech Stack

\- Sui Move (custom Smart Assembly)

\- Official EVE Frontier world-contracts

\- React + @mysten/dapp-kit frontend

\- Built on official `builder-scaffold` (March 2026)



\## How to test / deploy

1\. Clone this repo + follow the scaffold README.

2\. Run `pnpm tsx ts-scripts/deploy-smartshelters.ts` to create a shelter.

3\. Deploy frontend (`pnpm dev` or Vercel).

4\. Paste any Shelter/Heavy Shelter Object ID → swap ships.



\## Live Demo

\[Deployed URL — put your Vercel link here]



\## Screenshots / Video

(Attach 2–3 screenshots or a short Loom video here)



\## Team

\- Solo / Brettius



\*\*Submitted for the DeepSurge EVE Frontier Hackathon 2026\*\*  

Built in < 24 hours using the official scaffold and tutorials.

Last updated: April 1, 2026 (Redeploy triggered)



Made with love for the Frontier community 🚀

