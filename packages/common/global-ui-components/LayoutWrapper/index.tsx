'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ConfigProvider, theme } from 'antd';
// import useNotification from 'antd/es/notification/useNotification';
import { SplashScreen } from './SplashScreen';

export const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
	const [isLayoutReady, setIsLayoutReady] = useState<boolean>(false);
	const router = useRouter();
	// const [, context] = useNotification();

	useEffect(() => {
		if (!router.push) {
			return;
		}
		setIsLayoutReady(true);
	}, [router]);

	return isLayoutReady ? (
		<ConfigProvider
			theme={{
				algorithm: theme.darkAlgorithm
			}}
		>
			{/* {context} */}
			{children}
		</ConfigProvider>
	) : (
		<SplashScreen />
	);
};
