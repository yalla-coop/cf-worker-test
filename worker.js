async function handleRequest(request) {
  // show hello world
  return new Response("Hello world! Yay...", {
    headers: { "content-type": "text/plain" },
  });
}

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
