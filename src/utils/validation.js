export function validateAddress(address, chain) {
  if (!address || !address.trim()) {
    return 'Deposit address is required';
  }

  const addr = address.trim();

  if (chain.startsWith('eth:')) {
    if (!addr.startsWith('0x')) {
      return 'EVM address must start with 0x';
    }
    if (addr.length !== 42) {
      return 'EVM address must be 42 characters long';
    }
  }

  if (chain.startsWith('tron:')) {
    if (!addr.startsWith('T')) {
      return 'TRON address must start with T';
    }
  }

  if (chain.startsWith('btc:')) {
    if (!addr.startsWith('1') && !addr.startsWith('3') && !addr.startsWith('bc1')) {
      return 'BTC address must start with 1, 3, or bc1';
    }
  }

  return null;
}

export function validateAccountId(accountId) {
  if (!accountId || !accountId.trim()) {
    return 'Account ID is required';
  }
  return null;
}

export function validateTxHash(txHash) {
  if (!txHash || !txHash.trim()) {
    return 'Transaction hash is required';
  }
  return null;
}

export function canFixDeposit(status) {
  return status === 'NOT_FOUND' || status === 'FAILED';
}
