// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable sort-keys */
import Loader from '@common/global-ui-components/Loder';
import { NotificationStatus } from '@common/types/substrate';
import { notification as antdNotification } from 'antd';
import type { NotificationPlacement } from 'antd/es/notification/interface';
import { ReactNode } from 'react';

interface Props {
	message: ReactNode;
	description?: ReactNode;
	durationInSeconds?: number;
	status: NotificationStatus;
	placement?: NotificationPlacement;
	className?: string;
	closeIcon?: ReactNode;
}
export const notification = ({
	description,
	closeIcon,
	className,
	message,
	durationInSeconds = 4.5,
	status,
	placement
}: Props) => {
	const args = {
		className,
		closeIcon,
		message,
		description,
		duration: durationInSeconds,
		placement: placement || 'topRight',
		...(status === NotificationStatus.INFO ? { icon: <Loader /> } : {})
	};

	// queues notifcation
	antdNotification[status](args);
};
