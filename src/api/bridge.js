const RPC_ENDPOINT = 'https://bridge.chaindefuser.com/rpc';
const REQUEST_TIMEOUT = 30000;

let requestId = 0;

async function bridgeRpc(method, params = [{}]) {
  requestId += 1;
  const body = {
    jsonrpc: '2.0',
    id: requestId,
    method,
    params,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  const response = await fetch(RPC_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: controller.signal,
  });

  clearTimeout(timeoutId);

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message || `RPC error: ${JSON.stringify(data.error)}`);
  }

  return data.result;
}

export async function fetchSupportedTokens(chains) {
  const params = [{}];
  if (chains && chains.length > 0) {
    params[0].chains = chains;
  }
  return bridgeRpc('supported_tokens', params);
}

export async function fetchDepositAddress(accountId, chain) {
  return bridgeRpc('deposit_address', [{
    account_id: accountId,
    chain,
  }]);
}

export async function fetchRecentDeposits(accountId, chain, status, limit = 20, offset = 0) {
  const params = [{
    account_id: accountId,
  }];
  if (chain) params[0].chain = chain;
  if (status) params[0].status = status;
  if (limit) params[0].limit = limit;
  if (offset) params[0].offset = offset;
  return bridgeRpc('recent_deposits', params);
}

export async function notifyDeposit(chain, depositAddress, txHash, extraParams = {}) {
  const params = [{
    chain,
    deposit_address: depositAddress,
    tx_hash: txHash,
  }];
  if (extraParams.nearSenderAccount) {
    params[0].near_sender_account = extraParams.nearSenderAccount;
  }
  if (extraParams.memo) {
    params[0].memo = extraParams.memo;
  }
  return bridgeRpc('notify_deposit', params);
}

export async function fetchWithdrawalStatus(withdrawalHash) {
  return bridgeRpc('withdrawal_status', [{
    withdrawal_hash: withdrawalHash,
  }]);
}
