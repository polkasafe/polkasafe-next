import { connect } from "@sdk/polkasafe-sdk/src"
import { IGenericResponse } from "@substrate/app/global/types"

export const connectAddress = async (address: string) => {
  try {
    const data = await connect({ address })
    return { data, error: null } as unknown as IGenericResponse<any>
  } catch (error) {
    return { data: null, error: error.message || error }
  }
}