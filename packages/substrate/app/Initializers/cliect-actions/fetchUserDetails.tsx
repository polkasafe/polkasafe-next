import { connect } from "@sdk/polkasafe-sdk/src"

export const fetchUserDetails = async (address: string, signature: string) => {
  connect({ address })
}