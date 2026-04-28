import { useState, useEffect, useRef, useCallback, Component } from 'react';
import {
  fetchSupportedTokens,
  fetchDepositAddress,
  fetchRecentDeposits,
  notifyDeposit,
} from './api/bridge';
import {
  validateAddress,
  validateAccountId,
  validateTxHash,
  canFixDeposit,
} from './utils/validation';

const POLL_INTERVAL = 5000;
const POLL_TIMEOUT = 60000;

const CHAIN_NAMES = {
  'eth:1': 'Ethereum',
  'eth:56': 'BNB Chain',
  'eth:137': 'Polygon',
  'eth:10': 'Optimism',
  'eth:42161': 'Arbitrum One',
  'eth:8453': 'Base',
  'eth:43114': 'Avalanche',
  'eth:42220': 'Celo',
  'eth:59144': 'Linea',
  'eth:534352': 'Scroll',
  'eth:7777777': 'Zora',
  'eth:324': 'zkSync Era',
  'eth:1088': 'Metis',
  'eth:42170': 'Arbitrum Nova',
  'eth:288': 'Boba Network',
  'eth:25': 'Cronos',
  'eth:100': 'Gnosis',
  'eth:1284': 'Moonbeam',
  'eth:1285': 'Moonriver',
  'eth:1666600000': 'Harmony',
  'eth:1313161554': 'Aurora',
  'eth:11297108109': 'Palm',
  'eth:143': 'Monad',
  'eth:196': 'X Layer',
  'eth:36900': 'ADI Chain',
  'btc:mainnet': 'Bitcoin',
  'tron:mainnet': 'Tron',
  'near:mainnet': 'NEAR',
  'sol:mainnet': 'Solana',
  'stellar:mainnet': 'Stellar',
  'doge:mainnet': 'Dogecoin',
  'xrp:mainnet': 'XRP Ledger',
  'sui:mainnet': 'Sui',
  'apt:mainnet': 'Aptos',
};

function getChainLabel(chainId) {
  const name = CHAIN_NAMES[chainId];
  return name ? `${name} (${chainId})` : chainId;
}

function StatusBadge({ status }) {
  const config = {
    NOT_FOUND: { label: 'Not Indexed', className: 'status-not-found' },
    PENDING: { label: 'Pending', className: 'status-pending' },
    CREDITED: { label: 'Credited', className: 'status-pending' },
    COMPLETED: { label: 'Completed', className: 'status-completed' },
    FAILED: { label: 'Failed', className: 'status-not-found' },
  };
  const c = config[status] || { label: status || 'Unknown', className: 'status-unknown' };
  return <span className={`status-badge ${c.className}`}>{c.label}</span>;
}

function DepositRow({ deposit }) {
  const amount = deposit.amount != null
    ? (Number(deposit.amount) / Math.pow(10, deposit.decimals || 0)).toFixed(6)
    : '-';
  const token = deposit.defuse_asset_identifier
    ? (deposit.defuse_asset_identifier.length > 14
      ? deposit.defuse_asset_identifier.slice(0, 12) + '...'
      : deposit.defuse_asset_identifier)
    : '-';
  const time = deposit.created_at ? new Date(deposit.created_at).toLocaleString() : '-';

  return (
    <tr>
      <td><StatusBadge status={deposit.status} /></td>
      <td title={deposit.defuse_asset_identifier}>{token}</td>
      <td>{amount}</td>
      <td title={deposit.tx_hash} style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {deposit.tx_hash || '-'}
      </td>
      <td>{time}</td>
      <td>{getChainLabel(deposit.chain)}</td>
    </tr>
  );
}

export default function App() {
  const [chains, setChains] = useState([]);
  const [chainsLoading, setChainsLoading] = useState(true);

  const [accountId, setAccountId] = useState('');
  const [chain, setChain] = useState('');
  const [depositAddress, setDepositAddress] = useState('');
  const [txHash, setTxHash] = useState('');

  const [deposits, setDeposits] = useState([]);
  const [depositsLoading, setDepositsLoading] = useState(false);
  const [depositsChecked, setDepositsChecked] = useState(false);

  const [nearSenderAccount, setNearSenderAccount] = useState('');
  const [stellarMemo, setStellarMemo] = useState('');

  const [fixing, setFixing] = useState(false);
  const [fetchingAddress, setFetchingAddress] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [polling, setPolling] = useState(false);
  const pollTimerRef = useRef(null);
  const pollStartRef = useRef(null);

  // Load supported chains on mount
  useEffect(() => {
    async function loadChains() {
      try {
        setChainsLoading(true);
        const result = await fetchSupportedTokens();
        const chainSet = new Set();
        if (result.tokens) {
          result.tokens.forEach((t) => {
            const ident = t.defuse_asset_identifier || '';
            const parts = ident.split(':');
            if (parts.length >= 2) {
              chainSet.add(parts[0] + ':' + parts[1]);
            }
          });
        }
        const chainList = Array.from(chainSet)
          .map((c) => ({ id: c, label: getChainLabel(c) }))
          .sort((a, b) => a.label.localeCompare(b.label))
          .map((c) => c.id);
        setChains(chainList);
      } catch (err) {
        setError('Failed to load supported chains: ' + err.message);
      } finally {
        setChainsLoading(false);
      }
    }
    loadChains();
  }, []);

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    setPolling(false);
  }, []);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  const startPolling = useCallback(() => {
    stopPolling();
    setPolling(true);
    pollStartRef.current = Date.now();

    pollTimerRef.current = setInterval(async () => {
      if (Date.now() - pollStartRef.current > POLL_TIMEOUT) {
        stopPolling();
        setError('Auto-poll timed out after 60 seconds. Please check manually.');
        return;
      }

      try {
        const result = await fetchRecentDeposits(accountId.trim(), chain);
        const deps = result?.deposits || [];
        setDeposits(deps);

        const match = deps.find((d) => d.tx_hash === txHash.trim());
        if (match && (match.status === 'COMPLETED' || match.status === 'CREDITED')) {
          stopPolling();
          setSuccess('Deposit completed successfully!');
        }
        if (match && match.status === 'FAILED') {
          stopPolling();
          setError('Deposit processing failed.');
        }
      } catch {
        // Continue polling on transient errors
      }
    }, POLL_INTERVAL);
  }, [accountId, chain, txHash, stopPolling]);

  async function handleFetchAddress() {
    setError('');
    setSuccess('');

    const accErr = validateAccountId(accountId);
    if (accErr) { setError(accErr); return; }
    if (!chain) { setError('Please select a chain'); return; }

    try {
      setFetchingAddress(true);
      const result = await fetchDepositAddress(accountId.trim(), chain);
      if (result.address) {
        setDepositAddress(result.address);
        setSuccess('Deposit address fetched successfully');
      } else {
        setError('No deposit address returned');
      }
    } catch (err) {
      setError('Failed to fetch deposit address: ' + err.message);
    } finally {
      setFetchingAddress(false);
    }
  }

  async function handleCheckDeposit() {
    setError('');
    setSuccess('');
    stopPolling();

    const accErr = validateAccountId(accountId);
    if (accErr) { setError(accErr); return; }
    if (!chain) { setError('Please select a chain'); return; }

    try {
      setDepositsLoading(true);
      setDepositsChecked(false);
      const result = await fetchRecentDeposits(accountId.trim(), chain);
      setDeposits(result?.deposits || []);
      setDepositsChecked(true);
    } catch (err) {
      setError('Failed to check deposits: ' + err.message);
    } finally {
      setDepositsLoading(false);
    }
  }

  async function handleFixDeposit() {
    setError('');
    setSuccess('');

    const accErr = validateAccountId(accountId);
    if (accErr) { setError(accErr); return; }
    if (!chain) { setError('Please select a chain'); return; }
    const addrErr = validateAddress(depositAddress, chain);
    if (addrErr) { setError(addrErr); return; }
    const txErr = validateTxHash(txHash);
    if (txErr) { setError(txErr); return; }

    try {
      setFixing(true);
      const extraParams = {};
      if (chain === 'near:mainnet' && nearSenderAccount.trim()) {
        extraParams.nearSenderAccount = nearSenderAccount.trim();
      }
      if (chain === 'stellar:mainnet' && stellarMemo.trim()) {
        extraParams.memo = stellarMemo.trim();
      }
      await notifyDeposit(chain, depositAddress.trim(), txHash.trim(), extraParams);
      setSuccess('Deposit notification sent. Auto-checking status...');
      startPolling();
    } catch (err) {
      setError('Failed to fix deposit: ' + err.message);
    } finally {
      setFixing(false);
    }
  }

  // Determine overall status for the entered tx_hash
  const matchedDeposit = deposits.find((d) => txHash.trim() && d.tx_hash === txHash.trim());
  const overallStatus = depositsChecked && txHash.trim()
    ? (matchedDeposit ? matchedDeposit.status : 'NOT_FOUND')
    : null;

  const fixAllowed = canFixDeposit(overallStatus);

  return (
    <div className="app">
      <header className="header">
        <h1>Deposit Fixer</h1>
        <p>Deposit Recovery Tool for NEAR Intents</p>
      </header>

      <main className="main">
        {/* Form */}
        <section className="card">
          <h2>Deposit Details</h2>

          <div className="form-group">
            <label htmlFor="accountId">Account ID</label>
            <input
              id="accountId"
              type="text"
              placeholder="user.near or 0xabc..."
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="chain">Chain</label>
            <select
              id="chain"
              value={chain}
              onChange={(e) => setChain(e.target.value)}
              disabled={chainsLoading}
            >
              <option value="">{chainsLoading ? 'Loading chains...' : 'Select chain'}</option>
              {chains.map((c) => (
                <option key={c} value={c}>{getChainLabel(c)}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="depositAddress">Deposit Address</label>
            <div className="input-row">
              <input
                id="depositAddress"
                type="text"
                placeholder="0x... or T..."
                value={depositAddress}
                onChange={(e) => setDepositAddress(e.target.value)}
              />
              <button
                onClick={handleFetchAddress}
                disabled={fetchingAddress || !accountId || !chain}
                className="btn btn-secondary"
              >
                {fetchingAddress ? 'Fetching...' : 'Fetch'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="txHash">Transaction Hash</label>
            <input
              id="txHash"
              type="text"
              placeholder="0x..."
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
            />
          </div>

          {chain === 'near:mainnet' && (
            <div className="form-group">
              <label htmlFor="nearSender">NEAR Sender Account <span className="hint-inline">(required for NEAR deposits)</span></label>
              <input
                id="nearSender"
                type="text"
                placeholder="sender.near"
                value={nearSenderAccount}
                onChange={(e) => setNearSenderAccount(e.target.value)}
              />
            </div>
          )}

          {chain === 'stellar:mainnet' && (
            <div className="form-group">
              <label htmlFor="stellarMemo">Stellar Memo <span className="hint-inline">(required for Stellar deposits, max 32 chars)</span></label>
              <input
                id="stellarMemo"
                type="text"
                maxLength={32}
                placeholder="Enter memo"
                value={stellarMemo}
                onChange={(e) => setStellarMemo(e.target.value)}
              />
            </div>
          )}
        </section>

        {/* Status */}
        {overallStatus && (
          <section className="card status-card">
            <h2>Deposit Status</h2>
            <div className="status-row">
              <span>Status:</span>
              <StatusBadge status={overallStatus} />
            </div>
            {polling && <p className="polling-text">Auto-checking status (every 5s)...</p>}
          </section>
        )}

        {/* Actions */}
        <section className="card actions-card">
          <div className="actions-row">
            <button
              onClick={handleCheckDeposit}
              disabled={depositsLoading || !accountId || !chain}
              className="btn btn-primary"
            >
              {depositsLoading ? 'Checking...' : 'Check Deposit'}
            </button>
            <button
              onClick={handleFixDeposit}
              disabled={fixing || !fixAllowed || !accountId || !chain || !depositAddress || !txHash || (chain === 'near:mainnet' && !nearSenderAccount.trim()) || (chain === 'stellar:mainnet' && !stellarMemo.trim())}
              className="btn btn-danger"
              title={!fixAllowed && overallStatus ? 'Deposit already completed or pending' : 'Trigger deposit indexing'}
            >
              {fixing ? 'Fixing...' : 'Fix Deposit'}
            </button>
          </div>
          {!fixAllowed && overallStatus && overallStatus !== 'NOT_FOUND' && overallStatus !== 'FAILED' && (
            <p className="hint">Fix is disabled because the deposit is {overallStatus.toLowerCase()}.</p>
          )}
        </section>

        {/* Messages */}
        {error && <div className="message error-message">{error}</div>}
        {success && <div className="message success-message">{success}</div>}

        {/* Results Table */}
        {depositsChecked && (
          <section className="card">
            <h2>Recent Deposits ({deposits.length})</h2>
            {deposits.length === 0 ? (
              <p className="hint">No deposits found for this account on {chain}.</p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Token</th>
                      <th>Amount</th>
                      <th>Tx Hash</th>
                      <th>Time</th>
                      <th>Chain</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deposits.map((d, i) => (
                      <DepositRow key={i} deposit={d} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="footer">
        <p>Deposit Fixer &mdash; NEAR Intents Deposit Recovery Tool</p>
      </footer>
    </div>
  );
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <h2>Something went wrong</h2>
          <p style={{ color: '#666', marginTop: 8 }}>The app encountered an unexpected error.</p>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
            style={{ marginTop: 16 }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export { ErrorBoundary };
