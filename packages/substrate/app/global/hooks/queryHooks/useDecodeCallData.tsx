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
		const callJSONData = call.toHuman();
		const metaData = call.meta.toHuman();
		const allCalls: any = [];
		function decodeCallData(call: IGenericObject, payload: IGenericObject = {}) {
			if (!call) {
				return;
			}
			payload.method = call.method;
			payload.section = call.section;

			const currentPoint = call?.args as IGenericObject;
			// check is there a proxy address
			const proxyAddress = currentPoint?.real?.Id;
			if (proxyAddress) {
				payload.proxyAddress = proxyAddress;
			}

			// check if there is a dest address
			const destAddress = currentPoint?.dest?.Id;
			if (destAddress) {
				payload.to = destAddress;
			}
			// check if there is a value
			const value = currentPoint?.value;
			if (value) {
				payload.value = value.split(',').join('');
			}

			allCalls.push(payload);
			// check is there any call or calls
			const callOrCalls = currentPoint?.call || currentPoint?.calls;

			// if callOrCalls is an object
			if (!Array.isArray(callOrCalls)) {
				const call = callOrCalls as IGenericObject;
				decodeCallData(call);
			}
			// if callOrCalls is an array
			if (Array.isArray(callOrCalls)) {
				for (const call of callOrCalls) {
					decodeCallData(call);
				}
			}
		}

		decodeCallData(callJSONData);

		if (metaData.name === 'batch_all' || metaData.name === 'batch') {
			const calls = (callJSONData?.args as IGenericObject)?.calls as Array<IGenericObject>;
			for (const batchCall of calls) {
				const dest = (batchCall.args as IGenericObject)?.dest;
				const value = (batchCall.args as IGenericObject)?.value;
				if (dest && value && dest.id) {
					payload.to = getEncodedAddress(value.address20 ? value.address20 : value.id, apiData.network);
					payload.value = value.split(',').join('');
					break;
				}
			}
			return payload;
		}
		const calls = Object.entries(callJSONData?.args || {});
		for (const [key, value] of calls) {
			if (key === 'dest' && value.id) {
				payload.to = getEncodedAddress(value.address20 ? value.address20 : value.id, apiData.network);
			}
			if (key === 'value') {
				payload.value = value.split(',').join('');
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
