/** @type {import('next').NextConfig} */
const nextConfig = {
	compiler: {
		styledComponents: true,
	},
	images: {
		domains: ["images.unsplash.com", "cdn.pixabay.com"],
	},
}

module.exports = nextConfig
