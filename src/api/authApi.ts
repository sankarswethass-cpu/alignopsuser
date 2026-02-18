const API_BASE = "http://localhost:4000";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export async function signup(name: string, email: string, password: string): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Failed to sign up");
  }

  return (await res.json()) as AuthUser;
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Failed to log in");
  }

  return (await res.json()) as AuthUser;
}

