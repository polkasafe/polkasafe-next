// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import CurrencyDropdown from '../CurrencyDropdown';
import AssetsTable from '../AssetsTable';

type IAsset = {
	balance: string;
	value: string;
	logoURI: string;
	name: string;
	asset: string;
};

interface IAssetsTemplateProps {
	assets: Array<IAsset>;
}

function AssetsTemplate({ assets }: IAssetsTemplateProps) {
	return (
		<div className='bg-bg-main rounded-xl p-5 h-full gap-5 flex flex-col'>
			<div className='flex justify-between items-center'>
				<h1>Tokens</h1>
				<CurrencyDropdown />
			</div>
			<AssetsTable dataSource={assets} />
		</div>
	);
}

export default AssetsTemplate;
