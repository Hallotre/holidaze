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

/**
 * Update the venue manager status in localStorage
 * @param {boolean} status - Whether the user is a venue manager
 */
export function updateVenueManagerStatus(status: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem("venueManager", JSON.stringify(status));
}

/**
 * Force a refresh of the local user's venueManager status
 * This is useful when troubleshooting issues with permission settings
 */
export function refreshLocalUserSettings() {
  if (typeof window === "undefined") return null;
  
  // Get the current settings
  const user = getLocalUser();
  if (!user) return null;
  
  // Force parse venueManager as boolean
  const venueManagerValue = localStorage.getItem("venueManager");
  if (venueManagerValue) {
    try {
      const parsedValue = JSON.parse(venueManagerValue);
      // Ensure it's stored as a proper boolean
      localStorage.setItem("venueManager", JSON.stringify(!!parsedValue));
    } catch {
      // If parsing fails, set a default value
      localStorage.setItem("venueManager", "false");
    }
  } else {
    // If no value exists, explicitly set to false
    localStorage.setItem("venueManager", "false");
  }
  
  return getLocalUser(); // Return the refreshed user
} 