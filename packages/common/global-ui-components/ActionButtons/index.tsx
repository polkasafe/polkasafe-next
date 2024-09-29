import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import { OutlineCheckIcon, OutlineCloseIcon } from '@common/global-ui-components/Icons';
import { ReactNode } from 'react';

interface IActionButton {
	label: string;
	disabled: boolean;
	loading?: boolean;
	onClick?: () => void;
	onCancel?: () => void;
}

export function ActionButtons({ label, disabled, loading, onClick, onCancel }: IActionButton) {
	return (
		<div className='w-full flex gap-2 flex-row-reverse'>
			<div className='w-full'>
				<Button
					htmlType='submit'
					variant={EButtonVariant.PRIMARY}
					disabled={disabled}
					size='large'
					fullWidth
					loading={Boolean(loading)}
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...(onClick && { onClick })}
				>
					{label}
				</Button>

			</div>
			<div className='w-full'>
				<Button
					variant={EButtonVariant.DANGER}
					disabled={disabled}
					size='large'
					fullWidth
					loading={Boolean(loading)}
					icon={<OutlineCloseIcon className='text-failure' />}
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...(onCancel && { onClick: onCancel })}
				>
					Cancel
				</Button>
			</div>
		</div>
	);
}
