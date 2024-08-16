/* eslint-disable no-bitwise */

'use client';

import DoughnutChart from '@common/global-ui-components/DoughnutChart';
import { assetsAtom } from '@substrate/app/atoms/assets/assetsAtom';
import { useAtomValue } from 'jotai/react';
import React from 'react';

const getRandomColor = (): string => {
	const baseColor: string = '#3b0e96';
	let color: string = baseColor;
	const randomFactor: number = Math.floor(Math.random() * 5) + 1;
	// eslint-disable-next-line @typescript-eslint/no-shadow
	const shadeColor = (color: string, percent: number): string => {
		const num: number = parseInt(color.slice(1), 16);
		const amt: number = Math.round(2.55 * percent);
		const R: number = (num >> 16) + amt;
		const G: number = ((num >> 8) & 0x00ff) + amt;
		const B: number = (num & 0x0000ff) + amt;

		return `#${(0x1000000 + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
	};

	color = shadeColor(color, randomFactor * 10);

	return color;
};

export default function AssetsCard() {
	const assets = useAtomValue(assetsAtom);
	const assetsData = assets.map((asset) => {
		if (!asset) {
			return null;
		}
		return {
			label: asset.symbol,
			color: getRandomColor(),
			value: asset.free
		};
	});

	return <DoughnutChart data={assetsData} />;
}
