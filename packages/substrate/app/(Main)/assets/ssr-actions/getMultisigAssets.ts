import { getAssets, getMultisigData } from '@sdk/polkasafe-sdk/src';
import { IMultisig, ITransaction } from '@substrate/app/global/types';

const parseAssets = (assets: any) => ({
  balance: assets.balance_token,
  value: `$ ${assets.balance_usd || 0}`,
  logoURI: assets.logoURI,
  name: assets.name,
  asset: assets.symbol
})

export const getMultisigAssets = async (address: string, network: string) => {
  // fetch multisig data and transactions
  // const multisigPromise = getMultisigData({address, network})
  const { data: assets, error } = await getAssets({address, network}) as { data: Array<any>, error: string }

  if(error) {
    return { assets: [], error }
  }

  return { assets: assets.map(parseAssets), error: null}
}