# Deposit Fixer

A simple tool for L1 support agents to fix stuck deposits on the NEAR Intents bridge. Most "stuck" deposits aren't actually failed — they just haven't been indexed yet. This tool lets agents check and trigger indexing without escalating to L2.

## What it does

- Check if a deposit has been indexed by the bridge
- Trigger deposit indexing if it's missing
- Auto-fetch the deposit address for an account
- Show deposit status with clear color indicators (red/yellow/green)
- Auto-poll after fixing to verify the deposit goes through

## How to use

1. Enter the user's Account ID (NEAR account or EVM address)
2. Select the chain from the dropdown
3. Click **Fetch** to auto-fill the deposit address (or paste it manually)
4. Enter the transaction hash
5. Click **Check Deposit** to see current status
6. If status shows "Not Indexed" — click **Fix Deposit**
7. The tool will auto-check every 10 seconds (max 6 times) to verify it went through

## API it talks to

All requests go to `https://bridge.chaindefuser.com/rpc` (JSON-RPC)

| Action | Method | When |
|--------|--------|------|
| Load chains | `supported_tokens` | Page load (once) |
| Get deposit address | `deposit_address` | Click Fetch |
| Check deposits | `recent_deposits` | Click Check Deposit |
| Trigger indexing | `notify_deposit` | Click Fix Deposit |

## API Safety

- Polling is 10 second intervals, max 6 requests per fix attempt, hard stop at 60 seconds
- Only one poll runs at a time — starting a new one kills the previous
- All requests have a 30 second timeout (AbortController)
- Action buttons are disabled while a request is in progress — no double-submit
- No auto-refresh or background requests on page load (except loading chains once)

## Special chain fields

- **NEAR deposits** (`near:mainnet`): Shows an extra "NEAR Sender Account" field — required by the API
- **Stellar deposits** (`stellar:mainnet`): Shows a "Memo" field (max 32 chars) — required by the API

## Status meanings

| Status | Color | What it means |
|--------|-------|---------------|
| Not Indexed | Red | Deposit not found in bridge — can trigger fix |
| Pending | Yellow | Being processed — wait |
| Credited | Yellow | Partially processed — wait |
| Completed | Green | Done — no action needed |
| Failed | Red | Something went wrong — can retry fix |

## Validation

- EVM addresses must start with `0x` and be 42 chars
- TRON addresses must start with `T`
- BTC addresses must start with `1`, `3`, or `bc1`
- Fix Deposit button is disabled if deposit is already completed or pending

## Tech

- React 18 + Vite 6
- No backend — all calls are direct to the bridge RPC
- Plain CSS (no framework)
- Deploys as a static site on Netlify

## Run locally

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
```

Output goes to `dist/` folder.

## Deploy on Netlify

Connect your GitHub repo to Netlify — it picks up the config from `netlify.toml` automatically. Or just drag the `dist/` folder to [app.netlify.com/drop](https://app.netlify.com/drop).

## Not built yet (maybe later)

- Auto-detect chain from tx hash format
- Links to block explorers (Etherscan, TronScan, etc.)
- Token name display instead of raw asset IDs
- Action logging / history
- Bulk recovery (multiple deposits at once)
- Withdrawal status checker
