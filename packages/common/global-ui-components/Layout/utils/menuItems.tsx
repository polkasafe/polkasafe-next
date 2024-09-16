import { ESettingsTab, ETransactionTab } from '@common/enum/substrate';
import {
	AddressBookIcon,
	AppsIcon,
	AssetsIcon,
	ExchangeIcon,
	HomeIcon,
	StarIcon,
	TransactionIcon,
	TreasuryAnalyticsIcon
} from '@common/global-ui-components/Icons';

export const menuItems = [
	{
		baseURL: '/dashboard',
		icon: <HomeIcon />,
		title: 'Home'
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
		title: 'Exchange'
	},
	{
		baseURL: '/watchlist',
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
		isNew: true
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
		icon: <TreasuryAnalyticsIcon />,
		title: 'Settings',
		tab: ESettingsTab.SIGNATORIES
	}
];
