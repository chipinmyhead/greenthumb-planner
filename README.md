# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## U.S. vascular plant catalog

The embedded catalog snapshot contains 10,000 distinct species, ranked by the
number of research-grade, non-captive observations in iNaturalist's United
States place under Tracheophyta. This is a measure of reporting frequency.
Species with equal counts are ordered by iNaturalist taxon ID. The snapshot was
retrieved on 2026-11-24. Run `python3 scripts/import-us-plants.py` to refresh it.
The [iNaturalist API](https://www.inaturalist.org/pages/api+reference) supplies
taxon IDs, names, and observation counts.

`src/data/verifiedPlantCare.ts` is the horticultural lookup, keyed by species
name. Its fields cover USDA hardiness zone, light, soil moisture, watering
frequency, pruning season, pruning instructions, transplant season, mature
height and spread, soil texture and pH, bloom season, and toxicity to people
and pets. Each
populated field links to two sources, such as university Extension gardening
guides, botanical garden profiles, and the NC Extension Gardener Handbook.
General watering recommendations describe when to check and water based on
establishment and soil conditions. Missing fields are shown as awaiting review. Missing toxicity data is labeled
as unknown.
The original garden profiles and reminder settings remain available to existing
gardens as unverified settings. The lookup is a care reference and does not set
automatic reminder intervals.
