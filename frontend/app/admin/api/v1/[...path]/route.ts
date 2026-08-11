import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL;

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

async function proxy(
  request: NextRequest,
  context: RouteContext,
) {
  if (!BACKEND_URL) {
    return NextResponse.json(
      {
        detail: "BACKEND_INTERNAL_URL belum dikonfigurasi.",
      },
      {
        status: 500,
      },
    );
  }

  const { path } = await context.params;

  const backendPath = path.join("/");

  const search = request.nextUrl.search;

  const targetUrl =
    `${BACKEND_URL.replace(/\/$/, "")}/api/v1/${backendPath}${search}`;

  const headers = new Headers();

  const contentType = request.headers.get("content-type");

  if (contentType) {
    headers.set("content-type", contentType);
  }

  const authorization = request.headers.get("authorization");

  if (authorization) {
    headers.set("authorization", authorization);
  }

  const cookie = request.headers.get("cookie");

  if (cookie) {
    headers.set("cookie", cookie);
  }

  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.arrayBuffer();

  let backendResponse: Response;

  try {
    backendResponse = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    });
  } catch (error) {
    console.error("Backend proxy error:", error);

    return NextResponse.json(
      {
        detail: "Backend tidak dapat dihubungi.",
      },
      {
        status: 502,
      },
    );
  }

  const responseHeaders = new Headers();

  const responseContentType =
    backendResponse.headers.get("content-type");

  if (responseContentType) {
    responseHeaders.set(
      "content-type",
      responseContentType,
    );
  }

  const setCookie = backendResponse.headers.get("set-cookie");

  if (setCookie) {
    responseHeaders.set("set-cookie", setCookie);
  }

  const responseBody = await backendResponse.arrayBuffer();

  return new NextResponse(responseBody, {
    status: backendResponse.status,
    headers: responseHeaders,
  });
}

export async function GET(
  request: NextRequest,
  context: RouteContext,
) {
  return proxy(request, context);
}

export async function POST(
  request: NextRequest,
  context: RouteContext,
) {
  return proxy(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  return proxy(request, context);
}

export async function PUT(
  request: NextRequest,
  context: RouteContext,
) {
  return proxy(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext,
) {
  return proxy(request, context);
}