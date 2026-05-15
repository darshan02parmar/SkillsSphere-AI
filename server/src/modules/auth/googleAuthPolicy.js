export const LOCAL_EMAIL_REGISTERED_MESSAGE =
  "This email is already registered with a password. Please log in with your email and password.";

/** @param {{ provider?: string } | null | undefined} user */
export const isLocalPasswordAccount = (user) => {
  if (!user) return false;
  return (user.provider || "local") !== "google";
};
