import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/server/db";

const sessionCookieName = "fintrack_session";
const sessionDurationMs = 1000 * 60 * 60 * 24 * 7;

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
};

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET não foi definida.");
  }

  return secret;
}

function signSessionPayload(payload: string) {
  return createHmac("sha256", getAuthSecret()).update(payload).digest("hex");
}

function isValidSignature(payload: string, signature: string) {
  const expectedSignature = signSessionPayload(payload);
  const expectedBuffer = Buffer.from(expectedSignature, "hex");
  const receivedBuffer = Buffer.from(signature, "hex");

  return (
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}

export async function createSession(userId: string) {
  const expiresAt = Date.now() + sessionDurationMs;
  const payload = `${userId}.${expiresAt}`;
  const signature = signSessionPayload(payload);
  const cookieStore = await cookies();

  cookieStore.set(sessionCookieName, `${payload}.${signature}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expiresAt),
  });
}

export async function destroySession() {
  const cookieStore = await cookies();

  cookieStore.delete(sessionCookieName);
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(sessionCookieName)?.value;

  if (!sessionCookie) {
    return null;
  }

  const [userId, expiresAtRaw, signature] = sessionCookie.split(".");
  const expiresAt = Number(expiresAtRaw);

  if (!userId || !expiresAtRaw || !signature || Number.isNaN(expiresAt)) {
    return null;
  }

  if (expiresAt < Date.now()) {
    return null;
  }

  if (!isValidSignature(`${userId}.${expiresAtRaw}`, signature)) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return user;
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
