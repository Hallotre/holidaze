/**
 * Get the current user from localStorage.
 * @returns {object | null} All user fields or null if not logged in.
 */
export function getLocalUser() {
  if (typeof window === "undefined") return null;
  const accessToken = localStorage.getItem("accessToken");
  const name = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  const avatar = localStorage.getItem("avatar");
  const banner = localStorage.getItem("banner");
  const venueManager = localStorage.getItem("venueManager");
  if (!accessToken || !name) return null;
  return {
    accessToken,
    name,
    email,
    avatar: avatar ? JSON.parse(avatar) : null,
    banner: banner ? JSON.parse(banner) : null,
    venueManager: venueManager ? JSON.parse(venueManager) : false,
  };
} 