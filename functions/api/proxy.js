export async function onRequest(context) {
  const url = new URL(context.request.url);
  const targetUrl = url.searchParams.get("url");

  if (!targetUrl) {
    return new Response("Missing url parameter", { status: 400 });
  }

  try {
    // 发起请求，Cloudflare 会自动处理内部路由，通常能绕过 WAF
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "v2rayN/6.33", // 伪装 User-Agent
        "Accept": "*/*"
      },
      redirect: "follow"
    });

    // 创建一个新的响应，保留原始响应体和部分头信息
    const newHeaders = new Headers(response.headers);
    newHeaders.set("Access-Control-Allow-Origin", "*"); // 允许跨域，方便调试

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  } catch (e) {
    return new Response(`Proxy error: ${e.message}`, { status: 500 });
  }
}
