/**
 * @type {import('next').NextConfig}
 */
// const withImages = require('next-images');

const nextConfig = {
	sassOptions: {
		additionalData: `@import "src/assets/styles/variables.scss"; @import "src/assets/styles/mixins.scss";`,
	},
	i18n: {
		locales: ['en', 'id', 'ru', 'ua'],
		defaultLocale: 'id',
		localeDetection: false,
	},
	exportPathMap: async () => {
		const paths = {
			'/': {
				page: '/',
				query: {
					lang: 'id',
					__nextDefaultLocale: 'id',
					__nextLocale: 'id',
				},
			},
			'/catalog': {
				page: '/catalog',
				query: {
					lang: 'id',
					__nextDefaultLocale: 'id',
					__nextLocale: 'id',
				},
			},
			'/services': {
				page: '/services',
				query: {
					lang: 'id',
					__nextDefaultLocale: 'id',
					__nextLocale: 'id',
				},
			},
		};

		const languages = ['id', 'en', 'ru', 'ua'];
		const defaultLanguage = 'id';

		for (const language of languages) {
			paths[`/${language}`] = {
				page: `/`,
				query: {
					lang: language,
					__nextDefaultLocale: defaultLanguage,
					__nextLocale: language,
				},
			};
			paths[`/${language}/services`] = {
				page: '/services',
				query: {
					lang: language,
					__nextDefaultLocale: defaultLanguage,
					__nextLocale: language,
				},
			};
			paths[`/${language}/catalog`] = {
				page: '/catalog',
				query: {
					lang: language,
					__nextDefaultLocale: defaultLanguage,
					__nextLocale: language,
				},
			};
		}

		return paths;
	},
	webpack: (config, { isServer }) => {
		config.module.rules.push({
			test: /\.(mp4|webm|mov)$/,
			use: {
				loader: 'url-loader',
				options: {
					limit: 500 * 1024 * 1024,
					fallback: 'file-loader',
					publicPath: '/_next/static/media/',
					outputPath: `${isServer ? '../' : ''}/_next/static/media/`,
					name: '[name].[ext]',
				},
			},
		});

		return config;
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '5000',
				pathname: '/properties/images/**',
			},
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '5000',
				pathname: '/uploads/property/property_images/**',
			},
		], 
	},

};

export default nextConfig;
