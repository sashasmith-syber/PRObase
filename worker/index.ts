export interface Env {
  STRIPE_SECRET_KEY: string;
  STRIPE_PRICE_ID: string;
  GEMINI_API_KEY: string;
  ALLOWED_ORIGIN: string;
}

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

function corsHeaders(origin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

function getAllowedOrigin(request: Request, env: Env): string {
  const requestOrigin = request.headers.get('Origin') ?? '';
  const allowed = [env.ALLOWED_ORIGIN, 'http://localhost:3000'].filter(Boolean);
  return allowed.includes(requestOrigin) ? requestOrigin : (env.ALLOWED_ORIGIN || 'http://localhost:3000');
}

function getCustomerId(request: Request): string | null {
  const auth = request.headers.get('Authorization');
  if (auth && auth.startsWith('Bearer ')) {
    const id = auth.slice(7).trim();
    return id.length > 0 ? id : null;
  }
  return null;
}

async function checkActiveSubscription(customerId: string, stripeSecretKey: string): Promise<boolean> {
  const params = new URLSearchParams({
    customer: customerId,
    status: 'active',
    limit: '1',
  });
  const resp = await fetch(`https://api.stripe.com/v1/subscriptions?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
    },
  });
  if (!resp.ok) return false;
  const data = await resp.json() as { data: unknown[] };
  return Array.isArray(data.data) && data.data.length > 0;
}

async function handleChat(request: Request, env: Env, origin: string): Promise<Response> {
  const customerId = getCustomerId(request);
  if (!customerId) {
    const checkoutUrl = `${origin}`;
    return new Response(
      JSON.stringify({ error: 'subscription_required', checkout_url: checkoutUrl }),
      {
        status: 402,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      }
    );
  }

  const isActive = await checkActiveSubscription(customerId, env.STRIPE_SECRET_KEY);
  if (!isActive) {
    const checkoutUrl = `${origin}`;
    return new Response(
      JSON.stringify({ error: 'subscription_required', checkout_url: checkoutUrl }),
      {
        status: 402,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      }
    );
  }

  let body: { model?: string; contents: unknown; generationConfig?: unknown; systemInstruction?: unknown };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_json' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    });
  }

  const model = body.model || 'gemini-2.5-flash';
  const geminiUrl = `${GEMINI_BASE}/${model}:streamGenerateContent?alt=sse&key=${env.GEMINI_API_KEY}`;

  const geminiBody: Record<string, unknown> = { contents: body.contents };
  if (body.generationConfig) geminiBody['generationConfig'] = body.generationConfig;
  if (body.systemInstruction) geminiBody['systemInstruction'] = body.systemInstruction;

  const geminiResp = await fetch(geminiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(geminiBody),
  });

  if (!geminiResp.ok) {
    const errText = await geminiResp.text();
    return new Response(errText, {
      status: geminiResp.status,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    });
  }

  const responseHeaders = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    ...corsHeaders(origin),
  });

  return new Response(geminiResp.body, { status: 200, headers: responseHeaders });
}

async function handleCreateCheckout(request: Request, env: Env, origin: string): Promise<Response> {
  const customerId = getCustomerId(request);

  let successUrl = `${origin}?checkout=success`;
  let cancelUrl = `${origin}?checkout=cancel`;

  try {
    const body = await request.json() as { success_url?: string; cancel_url?: string };
    if (body.success_url) successUrl = body.success_url;
    if (body.cancel_url) cancelUrl = body.cancel_url;
  } catch {
    // use defaults
  }

  const params = new URLSearchParams({
    mode: 'subscription',
    'line_items[0][price]': env.STRIPE_PRICE_ID,
    'line_items[0][quantity]': '1',
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
  if (customerId) params.set('customer', customerId);

  const resp = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const data = await resp.json() as { url?: string; error?: { message: string } };
  if (!resp.ok) {
    return new Response(JSON.stringify({ error: data.error?.message ?? 'checkout_failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    });
  }
  return new Response(JSON.stringify({ url: data.url }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}

async function handleCreatePortal(request: Request, env: Env, origin: string): Promise<Response> {
  const customerId = getCustomerId(request);
  if (!customerId) {
    return new Response(JSON.stringify({ error: 'customer_id_required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    });
  }

  let returnUrl = origin;
  try {
    const body = await request.json() as { return_url?: string };
    if (body.return_url) returnUrl = body.return_url;
  } catch {
    // use default
  }

  const params = new URLSearchParams({ customer: customerId, return_url: returnUrl });

  const resp = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const data = await resp.json() as { url?: string; error?: { message: string } };
  if (!resp.ok) {
    return new Response(JSON.stringify({ error: data.error?.message ?? 'portal_failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    });
  }
  return new Response(JSON.stringify({ url: data.url }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}

async function handleSubscriptionStatus(request: Request, env: Env, origin: string): Promise<Response> {
  const customerId = getCustomerId(request);
  if (!customerId) {
    return new Response(JSON.stringify({ active: false, plan: null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    });
  }

  const params = new URLSearchParams({ customer: customerId, status: 'active', limit: '1', expand: 'data.items' });
  const resp = await fetch(`https://api.stripe.com/v1/subscriptions?${params.toString()}`, {
    headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` },
  });

  if (!resp.ok) {
    return new Response(JSON.stringify({ active: false, plan: null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    });
  }

  const data = await resp.json() as { data: Array<{ items?: { data: Array<{ price?: { nickname?: string } }> } }> };
  const active = Array.isArray(data.data) && data.data.length > 0;
  let plan: string | null = null;
  if (active && data.data[0]?.items?.data?.[0]?.price?.nickname) {
    plan = data.data[0].items.data[0].price.nickname;
  }

  return new Response(JSON.stringify({ active, plan }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = getAllowedOrigin(request, env);
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    const path = url.pathname;

    if (path === '/api/chat' && request.method === 'POST') {
      return handleChat(request, env, origin);
    }

    if (path === '/api/create-checkout' && request.method === 'POST') {
      return handleCreateCheckout(request, env, origin);
    }

    if (path === '/api/create-portal' && request.method === 'POST') {
      return handleCreatePortal(request, env, origin);
    }

    if (path === '/api/subscription-status' && request.method === 'GET') {
      return handleSubscriptionStatus(request, env, origin);
    }

    return new Response(JSON.stringify({ error: 'not_found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    });
  },
};
