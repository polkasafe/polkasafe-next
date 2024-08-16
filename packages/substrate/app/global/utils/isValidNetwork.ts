import { networks } from '@common/constants/substrateNetworkConstant'

export const isValidNetwork = (network: string) => {
  return Object.values(networks).includes(network)
}