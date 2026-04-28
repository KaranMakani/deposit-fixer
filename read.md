Here’s a clean, ready-to-use README.md you can drop straight into your repo 👇

⸻

# 🧩 Bridge Deposit Recovery UI (L1 Tool)
## 📌 Overview
This tool is designed to help L1 support agents quickly resolve **stuck deposit issues** without escalating to L2.
It allows agents to:
- Check if a deposit is indexed
- Trigger deposit indexing (`notify_deposit`)
- Verify completion status
---
## 🎯 Problem
Users sometimes deposit funds from external chains (ETH, TRON, etc.) into their NEAR Intents account, but the deposit does not appear.
This usually happens because the deposit has not yet been indexed by the bridge.
---
## ✅ Solution
This tool:
1. Checks if the deposit exists using `recent_deposits`
2. If missing, triggers indexing using `notify_deposit`
3. Verifies that the deposit is processed
---
## 🚀 Features
- Check deposit status
- Trigger deposit recovery
- Auto-fetch deposit address
- Clear status indicators (Not Found / Pending / Completed)
- Prevent invalid actions
---
## 🧠 How It Works
### Flow
1. Enter deposit details
2. Click **Check Deposit**
3. If not found → Click **Fix Deposit**
4. System triggers indexing
5. Verify status updates
---
## 🧾 Required Inputs
| Field | Description | Example |
|------|-------------|--------|
| `account_id` | NEAR or EVM account | `user.near` / `0xabc...` |
| `chain` | Blockchain network | `eth:1`, `tron:mainnet` |
| `tx_hash` | Deposit transaction hash | `0x...` |
| `deposit_address` | Bridge deposit address | `0x...` / `T...` |
---
## 🔌 API Integration
### Base Endpoint

POST https://bridge.chaindefuser.com/rpc

---
### 1. Get Supported Chains
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "supported_tokens",
  "params": [{}]
}

👉 Extract chain from:

defuse_asset_identifier = chain:token

⸻

2. Get Deposit Address

{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "deposit_address",
  "params": [
    {
      "account_id": "user.near",
      "chain": "tron:mainnet"
    }
  ]
}

⸻

3. Check Deposits

{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "recent_deposits",
  "params": [
    {
      "account_id": "user.near",
      "chain": "tron:mainnet"
    }
  ]
}

⸻

4. Notify Deposit (Fix)

{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "notify_deposit",
  "params": [
    {
      "chain": "tron:mainnet",
      "deposit_address": "T...",
      "tx_hash": "..."
    }
  ]
}

⸻

🧠 Business Logic

Status Handling

Status	Meaning	Action
NOT_FOUND	Deposit not indexed	Allow fix
PENDING	Processing	Wait
COMPLETED	Done	No action

⸻

⚠️ Validation Rules

* ETH addresses → must start with 0x
* TRON addresses → must start with T
* Chain must be from supported list
* Prevent fixing already completed deposits

⸻

🖥️ UI Structure

Inputs

* Account ID
* Chain (dropdown)
* Deposit Address
* Transaction Hash
* Fetch Address button

⸻

Actions

* Check Deposit
* Fix Deposit

⸻

Output

* Status (Not Found / Pending / Completed)
* Amount
* Token
* Timestamp

⸻

🎨 Status Indicators

* 🔴 Not Indexed
* 🟡 Pending
* 🟢 Completed

⸻

🔁 Optional Automation

After triggering fix:

* Retry status check every 5 seconds
* Stop after success or timeout (~60 seconds)

⸻

❌ Error Handling

Error	Meaning
Account not found	Wrong deposit address
Empty deposits	Not indexed
Invalid chain	Unsupported network

⸻

🔐 Safety

* No infinite retries
* Disable fix if already completed
* Log all actions (recommended)

⸻

🛠️ Suggested Tech Stack

* Frontend: React / Next.js
* Backend (optional): Node.js / Express

⸻

🚀 Future Improvements

* Auto-detect chain from tx
* Explorer links (TronScan, Etherscan)
* Token name mapping
* Admin logs dashboard
* Bulk recovery tool

⸻

💡 Key Insight

Most “stuck deposit” issues are not failures, just unindexed deposits.

This tool enables L1 to resolve them instantly.

⸻

🏁 Goal

Reduce L2 dependency and enable fast, one-click resolution.
