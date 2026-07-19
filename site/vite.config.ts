import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

const analyticsPlaceholder = "<!-- cloudflare-web-analytics -->";

function cloudflareWebAnalytics(token?: string): Plugin {
  return {
    name: "filebox-cloudflare-web-analytics",
    transformIndexHtml(html) {
      const analyticsToken = token?.trim();
      if (!analyticsToken) {
        return html.replace(analyticsPlaceholder, "");
      }

      const beaconConfig = JSON.stringify({ token: analyticsToken }).replace(/'/g, "&#39;");
      const snippet = `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='${beaconConfig}'></script>`;
      return html.replace(analyticsPlaceholder, snippet);
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");

  return {
    plugins: [react(), cloudflareWebAnalytics(env.CLOUDFLARE_WEB_ANALYTICS_TOKEN)],
    build: {
      sourcemap: false
    }
  };
});
