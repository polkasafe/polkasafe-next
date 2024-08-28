// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StaticImageData } from 'next/image';
import acalaLogo from '@common/assets/parachains-logos/acala-logo.png';
import alephzeroLogo from '@common/assets/parachains-logos/aleph-zero-logo.jpeg';
import assethubLogo from '@common/assets/parachains-logos/assethub-logo.png';
import astarLogo from '@common/assets/parachains-logos/astar-logo.png';
import kusamaLogo from '@common/assets/parachains-logos/kusama-logo.gif';
import moonbeamLogo from '@common/assets/parachains-logos/moonbeam-logo.png';
import moonriverLogo from '@common/assets/parachains-logos/moonriver-logo.png';
import polkadotLogo from '@common/assets/parachains-logos/polkadot-logo.jpg';
import polymeshLogo from '@common/assets/parachains-logos/polymesh-logo.png';
import westendLogo from '@common/assets/parachains-logos/westend-logo.png';
import rococoLogo from '@common/assets/parachains-logos/rococo-logo.jpeg';
import phalaLogo from '@common/assets/parachains-logos/phala-logo.png';
import khalaLogo from '@common/assets/parachains-logos/khala-logo.png';
import availLogo from '@common/assets/parachains-logos/avail-logo.png';

export type Network = (typeof networks)[keyof typeof networks];
export type TokenSymbol = (typeof tokenSymbol)[keyof typeof tokenSymbol];

export interface ChainProps {
	blockTime: number;
	logo?: any;
	ss58Format: number;
	tokenDecimals: number;
	tokenSymbol: TokenSymbol;
	chainId: number;
	rpcEndpoint: string;
	existentialDeposit: string;
}

export type ChainPropType = {
	[index: string]: ChainProps;
};

export const networks = {
	ALEPHZERO: 'alephzero',
	ASTAR: 'astar',
	AVAIL: 'avail-goldberg',
	KHALA: 'khala',
	KUSAMA: 'kusama',
	PHALA: 'phala',
	POLKADOT: 'polkadot',
	ROCOCO: 'rococo',
	STATEMINE: 'assethub-kusama',
	STATEMINT: 'assethub-polkadot',
	TURING: 'avail-turing',
	WESTEND: 'westend',
	ROCOCO_ASSETHUB: 'assethub-rococo'
};

export const tokenSymbol = {
	ASTR: 'ASTR',
	AVL: 'AVL',
	AZERO: 'AZERO',
	DOT: 'DOT',
	KSM: 'KSM',
	PHA: 'PHA',
	// PAS: 'PAS',
	ROC: 'ROC',
	T_AVAIL: 'AVAIL',
	WND: 'WND'
};

export const chainProperties: ChainPropType = {
	[networks.POLKADOT]: {
		blockTime: 6000,
		chainId: 0,
		existentialDeposit: '1.00',
		logo: polkadotLogo,
		rpcEndpoint: 'wss://rpc.polkadot.io',
		ss58Format: 0,
		tokenDecimals: 10,
		tokenSymbol: tokenSymbol.DOT
	},
	[networks.KUSAMA]: {
		blockTime: 6000,
		chainId: 0,
		existentialDeposit: '0.000333333333',
		logo: kusamaLogo,
		rpcEndpoint: 'wss://kusama-rpc.polkadot.io',
		ss58Format: 2,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.KSM
	},
	[networks.WESTEND]: {
		blockTime: 6000,
		chainId: 0,
		existentialDeposit: '0.0100',
		logo: westendLogo,
		rpcEndpoint: 'wss://westend-rpc.dwellir.com',
		ss58Format: 42,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.WND
	},
	[networks.ROCOCO]: {
		blockTime: 6000,
		chainId: 0,
		existentialDeposit: '0.000033333333',
		logo: rococoLogo,
		rpcEndpoint: 'wss://rococo-rpc.polkadot.io',
		ss58Format: 42,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.ROC
	},
	[networks.ASTAR]: {
		blockTime: 12000,
		chainId: 0,
		existentialDeposit: '0.000000000001',
		logo: astarLogo,
		rpcEndpoint: 'wss://astar-rpc.dwellir.com/',
		ss58Format: 5,
		tokenDecimals: 18,
		tokenSymbol: tokenSymbol.ASTR
	},
	[networks.STATEMINT]: {
		blockTime: 6000,
		chainId: 0,
		existentialDeposit: '0.1000',
		logo: assethubLogo,
		rpcEndpoint: 'wss://polkadot-asset-hub-rpc.polkadot.io',
		ss58Format: 0,
		tokenDecimals: 10,
		tokenSymbol: tokenSymbol.DOT
	},
	[networks.STATEMINE]: {
		blockTime: 6000,
		chainId: 0,
		existentialDeposit: '0.000033333333',
		logo: assethubLogo,
		rpcEndpoint: 'wss://kusama-asset-hub-rpc.polkadot.io',
		ss58Format: 2,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.KSM
	},
	[networks.ALEPHZERO]: {
		blockTime: 1000,
		chainId: 0,
		existentialDeposit: '0.0000000005',
		logo: alephzeroLogo,
		rpcEndpoint: 'wss://ws.azero.dev/',
		ss58Format: 42,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.AZERO
	},
	[networks.PHALA]: {
		blockTime: 1000,
		chainId: 0,
		existentialDeposit: '0.0100',
		logo: phalaLogo,
		rpcEndpoint: 'wss://phala.api.onfinality.io/public-ws/',
		ss58Format: 30,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.PHA
	},
	[networks.KHALA]: {
		blockTime: 1000,
		chainId: 0,
		existentialDeposit: '0.0100',
		logo: khalaLogo,
		rpcEndpoint: 'wss://khala.public.curie.radiumblock.co/ws/',
		ss58Format: 30,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.PHA
	},
	[networks.AVAIL]: {
		blockTime: 1000,
		chainId: 0,
		existentialDeposit: '0.00001',
		logo: availLogo,
		rpcEndpoint: 'wss://rpc-testnet.avail.tools/ws',
		ss58Format: 42,
		tokenDecimals: 18,
		tokenSymbol: tokenSymbol.AVL
	},
	[networks.TURING]: {
		blockTime: 1000,
		chainId: 0,
		existentialDeposit: '0.00001',
		logo: availLogo,
		rpcEndpoint: 'wss://turing-rpc.avail.so/ws',
		ss58Format: 42,
		tokenDecimals: 18,
		tokenSymbol: tokenSymbol.T_AVAIL
	},
	[networks.ROCOCO_ASSETHUB]: {
		blockTime: 6000,
		chainId: 0,
		existentialDeposit: '0.0000333333330',
		logo: rococoLogo,
		rpcEndpoint: 'wss://asset-hub-rococo-rpc.dwellir.com',
		ss58Format: 42,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.ROC
	}
	// [networks.PASEO]: {
	// blockTime: 1000,
	// chainId: 0,
	// existentialDeposit: '1.0000',
	// logo: paseoLogo,
	// rpcEndpoint: 'wss://rpc.dotters.network/paseo/',
	// ss58Format: 42,
	// tokenDecimals: 10,
	// tokenSymbol: tokenSymbol.PAS
	// }
};

/* eslint-disable sort-keys */
export const onrampTokens = {
	POLKADOT: 'polkadot',
	KUSAMA: 'kusama',
	ASTAR: 'astar',
	MOONBEAM: 'moonbeam',
	MOONRIVER: 'moonriver',
	POLYMESH: 'polymesh',
	ACALA: 'acala'
};

export const onrampTokenProperties: {
	[name: string]: { tokenSymbol: string; logo: StaticImageData; offramp?: boolean };
} = {
	[onrampTokens.POLKADOT]: {
		tokenSymbol: 'dot',
		logo: polkadotLogo,
		offramp: true
	},
	[onrampTokens.KUSAMA]: {
		tokenSymbol: 'ksm',
		logo: kusamaLogo,
		offramp: true
	},
	[onrampTokens.ASTAR]: {
		tokenSymbol: 'astr',
		logo: astarLogo
	},
	[onrampTokens.MOONBEAM]: {
		tokenSymbol: 'glmr',
		logo: moonbeamLogo,
		offramp: true
	},
	[onrampTokens.MOONRIVER]: {
		tokenSymbol: 'movr',
		logo: moonriverLogo
	},
	[onrampTokens.POLYMESH]: {
		tokenSymbol: 'polyx',
		logo: polymeshLogo
	},
	[onrampTokens.ACALA]: {
		tokenSymbol: 'aca',
		logo: acalaLogo
	}
};
