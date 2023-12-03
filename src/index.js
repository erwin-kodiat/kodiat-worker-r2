/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx) {
		//return new Response('Hello World!');
		const url = new URL(request.url);
    const key = url.pathname.slice(1).toLowerCase().replace('secure/','') + ".png";
		console.log(key);
		//const key = "south_africa.png";
		let object = await env.MY_BUCKET.get(key);

		if (object === null) {
			object = await env.MY_BUCKET.get('default.png');
			//return new Response('Object Not Found', { status: 404 });
		}

		const headers = new Headers();
		object.writeHttpMetadata(headers);
		headers.set('etag', object.httpEtag);

		return new Response(object.body, {
			headers,
		});

	},
};
