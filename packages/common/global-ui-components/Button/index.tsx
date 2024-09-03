/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Button as AntDButton, ButtonProps } from 'antd';
import { twMerge } from 'tailwind-merge';
import { ScaleMotion } from '@common/global-ui-components/Motion/Scale';

export enum EButtonVariant {
	PRIMARY = 'primary',
	SECONDARY = 'secondary',
	DANGER = 'danger'
}

interface IButtonProps extends ButtonProps {
	fullWidth?: boolean;
	variant?: EButtonVariant;
	className?: string;
}

export default function Button({
	variant = EButtonVariant.PRIMARY,
	className,
	fullWidth,
	children,
	...props
}: IButtonProps) {
	switch (variant) {
		case EButtonVariant.PRIMARY:
			return (
				<ScaleMotion>
					<AntDButton
						className={twMerge(
							'bg-bg-secondary text-text-primary border-primary p-3 h-full rounded-lg',
							fullWidth && 'w-full',
							className
						)}
						{...props}
					>
						{children}
					</AntDButton>
				</ScaleMotion>
			);
		case EButtonVariant.SECONDARY:
			return (
				<ScaleMotion>
					<AntDButton
						className={twMerge(
							'bg-bg-secondary text-text-primary border-secondary p-3 h-full rounded-lg',
							fullWidth && 'w-full',
							className
						)}
						{...props}
					>
						{children}
					</AntDButton>
				</ScaleMotion>
			);
		case EButtonVariant.DANGER:
			return (
				<ScaleMotion>
					<AntDButton
						className={twMerge(
							'bg-bg-secondary text-text-danger border-danger bg-failure/75 p-3 h-full rounded-lg',
							fullWidth && 'w-full',
							className
						)}
						{...props}
					>
						{children}
					</AntDButton>
				</ScaleMotion>
			);
		default:
			return (
				<ScaleMotion>
					<AntDButton
						className={twMerge(
							'bg-bg-secondary text-text-primary border-default p-3 h-full rounded-lg',
							fullWidth && 'w-full',
							className
						)}
						{...props}
					>
						{children}
					</AntDButton>
				</ScaleMotion>
			);
	}
}
