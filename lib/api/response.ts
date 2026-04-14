import { NextResponse } from "next/server";
import { ru } from "@/lib/i18n/ru";

export class HttpError extends Error {
  constructor(
    message: string,
    readonly status = 400,
    readonly code?: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export class JsonParseError extends HttpError {
  constructor() {
    super(ru.errors.invalidJson, 400, "invalid_json");
    this.name = "JsonParseError";
  }
}

export function jsonOk<T>(data: T, init?: ResponseInit): NextResponse<T> {
  return NextResponse.json(data, { status: 200, ...init });
}

export function jsonError(
  message: string,
  status = 400,
  code?: string,
): NextResponse<{ error: string; code?: string }> {
  return NextResponse.json(
    code ? { error: message, code } : { error: message },
    { status },
  );
}

/** Safe JSON parse for POST bodies; empty body → `{}`. */
export async function readJsonBody(req: Request): Promise<unknown> {
  const text = await req.text();
  if (!text.trim()) return {};
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new JsonParseError();
  }
}

export function handleApiError(err: unknown): NextResponse<{ error: string; code?: string }> {
  if (err instanceof HttpError) {
    return jsonError(err.message, err.status, err.code);
  }
  if (err instanceof SyntaxError) {
    return jsonError(ru.errors.invalidJson, 400, "invalid_json");
  }
  return jsonError(ru.errors.internal, 500, "internal_error");
}
