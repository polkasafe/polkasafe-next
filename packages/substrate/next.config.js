// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
/* eslint-disable indent */

/* eslint-disable sort-keys */
/** @type {import('next').NextConfig} */
const nextConfig = {
	fallback: false,
	async headers() {
		return [
			{
				// matching all v1 API routes
				source: '/api/:path*',
				headers: [
					{ key: 'Access-Control-Allow-Credentials', value: 'true' },
					{ key: 'Access-Control-Allow-Origin', value: '*' },
					{ key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
					{ key: 'Access-Control-Allow-Headers', value: '*' },
					{ key: 'X-Frame-Options', value: 'SAMEORIGIN' },
					{ key: 'Content-Security-Policy', value: "default-src 'self'; img-src '*'" }
				]
			}
		];
	},
	transpilePackages: ['next-common'],
	images: {
		domains: ['parachains.info', 's2.coinmarketcap.com', 'resources.smartlayer.network', 'i.ibb.co', 'www.google.com']
	},
	reactStrictMode: false,
	webpack(config) {
		config.module.rules.push(
			{
				test: /\.svg$/,
				use: ['@svgr/webpack']
			},
			{
				test: /\.md$/,
				use: 'raw-loader'
			}
		);

		return config;
	},
	env: {
		NEXT_PUBLIC_DEPLOYMENT: process.env.NEXT_PUBLIC_DEPLOYMENT,
		NEXT_PUBLIC_SDK_BASE_URL: process.env.NEXT_PUBLIC_SDK_BASE_URL,
		NEXT_PUBLIC_POLKASAFE_FIREBASE_CONFIG_CLIENT: process.env.POLKASAFE_FIREBASE_CONFIG_CLIENT,
		NEXT_ONRAMP_APP_ID: process.env.NEXT_ONRAMP_APP_ID
	}
};

module.exports = nextConfig;
