import { getAssets, getMultisigData, getQueueTransactions, getTransactions } from '@sdk/polkasafe-sdk/src';
import { ETransactionType, IMultisig, ITransaction } from '@substrate/app/global/types';

const parseAssets = (assets: any) => ({
  balance: assets.balance_token,
  value: `$ ${assets.balance_usd || 0}`,
  logoURI: assets.logoURI,
  name: assets.name,
  asset: assets.symbol
})

export const getMultisigTransactions = async (type: ETransactionType, address: string, network: string, page: number, limit: number) => {
  
  const transactionsData = type === ETransactionType.HISTORY_TRANSACTION ? 
                  await getTransactions({address, network, page, limit}) : 
                  await getQueueTransactions({address, network, page, limit})

  const { data: { count, transactions }, error: transactionsError } = transactionsData as { 
    data: { count: number, transactions: Array<ITransaction> },
    error: string
  };

  if(transactionsError) {
    return { transactions: [] }
  }

  return { transactions, count }
}