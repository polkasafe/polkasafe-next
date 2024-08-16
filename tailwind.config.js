module.exports = {
	content: [
		// add the paths to all of your template files
		'./packages/*.{jsx,tsx}',
		'./packages/**/*.{jsx,tsx}'
	],
	important: true, // to generate utilities as !important
	theme: {
		extend: {
			colors: {
				primary: 'var(--primary)',
				highlight: 'var(--highlight)',
				danger: 'var(--danger)',
				'bg-main': 'var(--bg-main)',
				'bg-secondary': 'var(--bg-secondary)',
				success: 'var(--success)',
				waiting: 'var(--waiting)',
				failure: 'var(--failure)',
				'text-primary': 'var(--text-primary)',
				'text-outline-primary': 'var(--text-outline-primary)',
				'text-secondary': 'var(--text-secondary)',
				'text-danger': 'var(--text-danger)',
				'text-disabled': 'var(--text-disabled)',
				'text-success': 'var(--text-success)',
				'network-badge': 'var(--network-badge)',
				'proxy-pink': 'var(--proxy-pink)',
				'org-primary-bg': 'var(--org-primary-bg)',
				'bg-success': 'var(--bg-success)',
				'bg-failure': 'var(--bg-failure)'
			},
			fontFamily: {
				// add new font family
				primary: ['Archivo', 'sans-serif']
			},
			backgroundImage: {
				'custom-gradient':
					'linear-gradient(60deg, #434449, #27305B, #34449A, #423C85, #34449A, #27305B, #27305B,#434449)',
				'org-gradient': 'radial-gradient(100% 100% at 50% 70%, #27305B 0%, rgba(54, 0, 96, 0.00) 100%)'
			}
		}
	},
	plugins: []
};
