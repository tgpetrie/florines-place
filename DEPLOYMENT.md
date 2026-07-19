# Florine's Place deployments

The project ships as two independent Cloudflare Workers from the same branch:

- `petriecabin.com` — live mode. It never falls back to demo records. Until a
  live service is connected, reservations, weather, tides, notes, supplies,
  ideas, and guestbook areas render honest empty or unavailable states.
- `demo.petriecabin.com` — demo mode. It uses deterministic, browser-local
  sample reservations and the clearly labeled sample content.

Cloudflare Builds watches the `hero-figma-forest` branch for both Workers.
Each push runs the live and demo build commands independently and deploys a new
version to its matching domain.

## Local commands

```sh
npm run dev:live
npm run dev:demo
npm run build:live
npm run build:demo
npm run preview:live
npm run preview:demo
```

## Cloudflare commands

```sh
npm run deploy:live
npm run deploy:demo
```

Each deploy command rebuilds its mode before uploading, so the two Workers
cannot accidentally reuse one another's generated bundle.

`wrangler.jsonc` owns the two Worker names and custom-domain routes. Private
cabin details and database credentials must be stored as encrypted Worker
secrets, never committed to this repository. The required names are documented
in `.env.example`.
