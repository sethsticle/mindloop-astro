import { env } from 'cloudflare:workers';
import { defineMiddleware } from 'astro:middleware';

// @keystatic/astro v5 reads secrets via Astro.locals.runtime.env (Astro v5 API).
// @astrojs/cloudflare v13 removed this - restore it for Keystatic compatibility.
export const onRequest = defineMiddleware((context, next) => {
  const runtime = (context.locals as any).runtime;
  if (runtime) {
    Object.defineProperty(runtime, 'env', {
      value: env,
      writable: true,
      configurable: true,
    });
  }
  return next();
});
