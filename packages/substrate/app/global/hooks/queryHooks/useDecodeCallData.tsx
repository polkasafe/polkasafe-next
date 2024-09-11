// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
/* eslint-disable no-restricted-syntax */
import { IGenericObject } from '@common/types/substrate';
import getEncodedAddress from '@common/utils/getEncodedAddress';
import { ApiPromise } from '@polkadot/api';
import { IApiAtom } from '@substrate/app/atoms/api/apiAtom';
import { useQuery } from '@tanstack/react-query';

interface IUseHistoryTransaction {
	apiData: IApiAtom | null;
	callHash: string;
	callData?: string;
}

export function useDecodeCallData({ apiData, callHash, callData }: IUseHistoryTransaction) {
	const decodedData = async () => {
		const payload = {} as IGenericObject;
		if (!apiData || !apiData.api || !callData) {
			return payload;
		}
		const { api } = apiData as { api: ApiPromise };
		const call = api.createType('Call', callData);
		const callJSONData = call.toJSON();
		const metaData = call.meta.toJSON();
		payload.method = call.method;
		payload.section = call.section;
		console.log('callJSONData', callJSONData);
		if (metaData.name === 'batch_all') {
			const calls = (callJSONData?.args as IGenericObject)?.calls as Array<IGenericObject>;
			for (const batchCall of calls) {
				const dest = (batchCall.args as IGenericObject)?.dest;
				const value = (batchCall.args as IGenericObject)?.value;
				if (dest && value && (dest?.id || dest?.address20)) {
					payload.to = getEncodedAddress(value.address20 ? value.address20 : value.id, apiData.network);
					payload.value = value;
					break;
				}
			}
			return payload;
		}
		const calls = Object.entries(callJSONData?.args || {});
		for (const [key, value] of calls) {
			if (key === 'dest' && (value?.id || value?.address20)) {
				payload.to = getEncodedAddress(value.address20 ? value.address20 : value.id, apiData.network);
			}
			if (key === 'value') {
				payload.value = value;
			}
			if (payload.to && payload.value) {
				break;
			}
		}
		return payload;
	};

	return useQuery({
		queryKey: [`decodeCallData_${callHash}_${callData}`],
		queryFn: decodedData
	});
}