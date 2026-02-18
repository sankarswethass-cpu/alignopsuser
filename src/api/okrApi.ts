import type { TeamOKRData } from "@/data/mockData";

const API_BASE = "https://alignopsuser.onrender.com";

export async function fetchTeamOKRs(
  userId: string | undefined,
  teamId: string,
  quarterId: string
): Promise<TeamOKRData | null> {
  if (!userId || !teamId || !quarterId) return null;

  const url = `${API_BASE}/api/okrs?userId=${encodeURIComponent(
    userId
  )}&teamId=${encodeURIComponent(teamId)}&quarterId=${encodeURIComponent(quarterId)}`;

  const res = await fetch(url);
  if (!res.ok) {
    console.error("Failed to fetch OKRs", await res.text());
    return null;
  }

  const data = await res.json();
  if (Array.isArray(data) && data.length > 0) {
    return data[0] as TeamOKRData;
  }
  return null;
}

export async function saveTeamOKRs(
  userId: string | undefined,
  doc: TeamOKRData
): Promise<TeamOKRData | null> {
  if (!userId) return null;

  const payload: TeamOKRData = { ...doc, ownerUserId: userId };

  const res = await fetch(`${API_BASE}/api/okrs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    console.error("Failed to save OKRs", await res.text());
    return null;
  }

  return (await res.json()) as TeamOKRData;
}

