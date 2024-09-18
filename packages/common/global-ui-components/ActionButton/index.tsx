import Button, { EButtonVariant } from '@common/global-ui-components/Button';

interface IActionButton {
	label: string;
	disabled: boolean;
	loading?: boolean;
}

function ActionButton({ label, disabled, loading }: IActionButton) {
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
				{label}
			</Button>
		</div>
	);
}

export default ActionButton;
