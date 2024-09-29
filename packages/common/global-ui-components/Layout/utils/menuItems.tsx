import { ESettingsTab, ETransactionTab } from '@common/enum/substrate';
import {
	AddressBookIcon,
	AppsIcon,
	AssetsIcon,
	ExchangeIcon,
	HomeIcon,
	SettingsIcon,
	StarIcon,
	TransactionIcon,
	TreasuryAnalyticsIcon
} from '@common/global-ui-components/Icons';

export const menuItems = [
	{
		baseURL: '/dashboard',
		icon: <HomeIcon />,
		title: 'Home',
		tab: ETransactionTab.QUEUE
	},
	{
		baseURL: '/transactions',
		icon: <TransactionIcon />,
		title: 'Transactions',
		tab: ETransactionTab.QUEUE
	},
	{
		baseURL: '/assets',
		icon: <AssetsIcon />,
		title: 'Assets'
	},
	{
		baseURL: '/exchange',
		authenticated: true,
		icon: <ExchangeIcon />,
		title: 'Exchange',
		noShow: true
	},
	{
		baseURL: '/watch-list',
		icon: <StarIcon />,
		authenticated: true,
		title: 'Watchlist'
	},
	{
		baseURL: '/address-book',
		authenticated: true,
		icon: <AddressBookIcon />,
		title: 'Address Book'
	},
	{
		baseURL: '/treasury-analytics',
		authenticated: true,
		icon: <TreasuryAnalyticsIcon />,
		title: 'Treasury Analytics',
		isNew: false
	},
	{
		baseURL: '/invoices',
		authenticated: true,
		icon: <TreasuryAnalyticsIcon />,
		title: 'Invoices',
		noShow: true
	},
	{
		baseURL: '/apps',
		authenticated: true,
		icon: <AppsIcon />,
		title: 'Apps'
	},
	// {
	// baseURL: '/settings',
	// authenticated: true,
	// icon: <TreasuryAnalyticsIcon />,
	// title: 'Notifications',
	// tab: ESettingsTab.NOTIFICATIONS
	// },
	{
		baseURL: '/settings',
		authenticated: true,
		icon: <SettingsIcon />,
		title: 'Settings',
		tab: ESettingsTab.SIGNATORIES
	}
];
