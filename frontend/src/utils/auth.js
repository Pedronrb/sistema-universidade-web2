export function getTokenPayload() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export function getUserPapel() {
  const payload = getTokenPayload();
  return payload?.papeis?.[0] || null;
}

export function isAuthenticated() {
  const payload = getTokenPayload();
  if (!payload) return false;
  return payload.exp * 1000 > Date.now();
}

export function logout() {
  localStorage.removeItem("token");
  window.location.href = "/";
}
