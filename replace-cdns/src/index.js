/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import redirectsMap from './redirectsMap.js';

export default {
	async fetch(request, env, ctx) {
		return handleRequest(request);
	},
};

async function handleRequest(request) {
	const url = new URL(request.url);
	const domain = 'https://elrha.webflow.io';

	// Check if the request is for an old page and redirect to the new one
	if (redirectsMap[url.pathname]) {
		return Response.redirect(`${domain}${redirectsMap[url.pathname]}`, 301);
	}

	try {
		// Fetch the response from the origin or upstream
		const response = await fetch(request);

		// Clone the response to modify its body
		const responseBody = await response.text();

		// Replace URLs in the response body
		const modifiedBody = responseBody
			.replace(/https:\/\/cdn\.prod\.website-files\.com\//g, 'https://www.yallacooperative.site/assets/')
			.replace(/https:\/\/elrha\.canto\.global\/direct\//g, 'https://www.yallacooperative.site/docs/');

		// Return a new response with the modified content
		return new Response(modifiedBody, {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers,
		});
	} catch (error) {
		console.error('Fetch error:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
}
