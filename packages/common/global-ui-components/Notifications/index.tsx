import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import {
	CircleArrowDownIcon,
	DiscordIcon,
	ElementIcon,
	MailIcon,
	NotificationIcon,
	SlackIcon,
	TelegramIcon
} from '@common/global-ui-components/Icons';
import { InfoCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Checkbox, ConfigProvider, Dropdown, Input, MenuProps } from 'antd';
import React, { useState } from 'react';

interface NotificationArticleProps {
	icon: React.ReactNode;
	title: string;
	platform?: string;
	input?: boolean;
	buttonText?: string;
}

const NotificationArticle: React.FC<NotificationArticleProps> = ({ icon, title, platform, input, buttonText }) => {
	return (
		<article className='bg-bg-secondary rounded-lg px-1 py-4 flex items-center justify-start gap-x-8'>
			<Button
				htmlType='submit'
				icon={icon}
				variant={EButtonVariant.PRIMARY}
				className='bg-transparent text-text-secondary border-none shadow-none text-sm flex items-center justify-start w-[250px]'
				fullWidth
			>
				{title} Notifications
			</Button>
			{input ? (
				<div className='flex gap-x-2'>
					<div className='w-[353px]'>
						<ConfigProvider
							theme={{
								token: {
									colorBgContainer: '#24272E',
									controlHeight: 31,
									colorIcon: '#1573FE'
								}
							}}
						>
							<Input
								placeholder='Enter email'
								width={353}
							/>
						</ConfigProvider>
					</div>
					<Button
						variant={EButtonVariant.PRIMARY}
						className='h-[30px] rounded-md w-[84px]'
						size='large'
					>
						{buttonText}
					</Button>
				</div>
			) : (
				<p className='m-0 p-0 text-white text-sm flex items-center gap-x-1'>
					<span className='text-primary mr-2 flex items-center'>
						<PlusCircleOutlined className='mr-1 text-primary' /> ADD THE PSAFE BOT
					</span>
					to a {platform} chat to get {title} notifications
				</p>
			)}
		</article>
	);
};

export const NotificationsUI: React.FC = () => {
	const [selectedOption, setSelectedOption] = useState<string>('8 hrs');
	const dropdownOptions = ['8 hrs', '12 hrs', '16 hrs', '24 hrs'];

	const items: MenuProps['items'] = dropdownOptions.map((option, index) => ({
		key: index.toString(),
		label: <p className='text-white'>{option}</p>,
		onClick: () => setSelectedOption(option)
	}));

	const checkboxItems = [
		{ label: 'New Transaction needs to be signed' },
		{ label: 'Transaction has been signed and executed' },
		{ label: 'Transaction has been cancelled' },
		{ label: 'Get remainders from other signatories' }
	];

	const notificationPlatforms = [
		{ icon: <MailIcon />, title: 'Email', input: true, buttonText: 'Verify' },
		{ icon: <TelegramIcon />, title: 'Telegram', platform: 'Telegram' },
		{ icon: <DiscordIcon />, title: 'Discord', platform: 'Discord' },
		{ icon: <ElementIcon />, title: 'Element', platform: 'Element' },
		{ icon: <SlackIcon />, title: 'Slack', platform: 'Slack' }
	];

	return (
		<section className='flex flex-col gap-y-4 overflow-y-auto'>
			<article className='bg-bg-secondary rounded-lg px-1 py-4 flex items-start justify-start gap-x-8'>
				<Button
					htmlType='submit'
					icon={<NotificationIcon />}
					variant={EButtonVariant.PRIMARY}
					className='bg-transparent text-text-secondary border-none shadow-none text-sm flex items-center justify-start w-[250px]'
					fullWidth
				>
					General
				</Button>
				<div className='flex flex-col gap-y-2 items-start'>
					<p className='m-0 p-0 text-text-secondary'>
						Configure the notifications you want Polkasafe to send in your linked channels
					</p>
					<div className='flex flex-col gap-y-2 mt-2'>
						<ConfigProvider
							theme={{
								token: {
									colorBgContainer: '#24272E'
								}
							}}
						>
							{checkboxItems.map((checkbox, index) => (
								<Checkbox key={index}>{checkbox.label}</Checkbox>
							))}
							<Checkbox className='-mt-3'>
								<div className='flex gap-x-2 mt-3'>
									For Pending Transactions remind signers every{' '}
									<Dropdown
										trigger={['click']}
										className='-mt-1 border border-text-secondary flex items-center justify-center rounded-lg w-[93px] h-[31px] p-2.5 bg-bg-secondary cursor-pointer'
										menu={{
											items
										}}
									>
										<div className='flex justify-between gap-x-2 items-center text-white text-[16px]'>
											<p className='text-text-tertiary text-sm'>{selectedOption}</p>
											<CircleArrowDownIcon className='text-primary' />
										</div>
									</Dropdown>
								</div>
							</Checkbox>
						</ConfigProvider>
					</div>
				</div>
			</article>

			{notificationPlatforms.map((platform, index) => (
				<NotificationArticle
					key={index}
					icon={platform.icon}
					title={platform.title}
					platform={platform.platform}
					input={platform.input}
					buttonText={platform.buttonText}
				/>
			))}

			<div className='h-[54px] flex items-center justify-start gap-x-2 px-5 py-4 bg-bg-secondary rounded-lg'>
				<InfoCircleOutlined className='text-waiting' />
				<p className='m-0 p-0 text-waiting text-sm flex items-center gap-x-1'>
					Not receiving notifications? <span className='m-0 p-0 text-primary'>Contact Us</span>
				</p>
			</div>
		</section>
	);
};
