import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}

export async function requireRole(role: string) {
  const user = await requireAuth();
  if (user.role !== role && user.role !== "ADMIN") {
    throw new Error(`Access denied. ${role} role required.`);
  }
  return user;
}

export async function requireAdmin() {
  return await requireRole("ADMIN");
}

export async function requireEditor() {
  return await requireRole("EDITOR");
}

export function hasRole(user: { role?: string } | null, role: string) {
  return user?.role === role || user?.role === "ADMIN";
}

export function canEdit(user: { role?: string } | null) {
  return hasRole(user, "EDITOR") || hasRole(user, "ADMIN");
}

export function canDelete(user: { role?: string } | null) {
  return hasRole(user, "ADMIN");
}
