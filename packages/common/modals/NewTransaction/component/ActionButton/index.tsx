import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import React from 'react';

interface IActionButton {
	disabled: boolean;
	loading?: boolean;
}

function ActionButton({ disabled, loading }: IActionButton) {
	return (
		<div className='w-full'>
			<Button
				htmlType='submit'
				variant={EButtonVariant.PRIMARY}
				className='bg-primary border-primary text-sm'
				disabled={disabled}
				fullWidth
				loading={Boolean(loading)}
			>
				Send Transaction
			</Button>
		</div>
	);
}

export default ActionButton;
