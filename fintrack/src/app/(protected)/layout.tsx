import { requireCurrentUser } from "@/server/auth/session";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireCurrentUser();

  return children;
}
