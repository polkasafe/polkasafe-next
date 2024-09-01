// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable sort-keys */
import { NotificationStatus } from '@common/enum/substrate';
import { notification } from 'antd';
import type { NotificationPlacement } from 'antd/es/notification/interface';
import { ReactNode } from 'react';

interface Props {
	header: ReactNode;
	message?: ReactNode;
	durationInSeconds?: number;
	status: NotificationStatus;
	placement?: NotificationPlacement;
	className?: string;
	closeIcon?: ReactNode;
}
export function queueNotification({
	header,
	closeIcon,
	className,
	message,
	durationInSeconds = 4.5,
	status,
	placement
}: Props) {
	const args = {
		className: `scale-90 ${className}`,
		closeIcon,
		message: header,
		description: message,
		duration: durationInSeconds,
		placement: placement || 'topRight'
	};

	// queues notifcation
	notification[status](args);
}
