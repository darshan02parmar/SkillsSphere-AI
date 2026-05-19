const TOKEN_KEY = "skillssphere.auth.token";

export const getAuthToken = () =>
  localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || "";

export const resolveProtectedFilePath = (url) => {
  if (!url || typeof url !== "string") return null;

  // Skip third-party URLs
  if (/^https?:\/\//i.test(url) && !url.includes("/uploads/") && !url.includes("/api/files/")) {
    return null;
  }

  let apiPath = url;

  // Legacy public static paths → protected API routes
  if (url.includes("/uploads/avatars/")) {
    const filename = url.split("/uploads/avatars/").pop()?.split("?")[0];
    apiPath = filename ? `/api/files/avatars/${filename}` : url;
  } else if (url.includes("/uploads/")) {
    const filename = url.split("/uploads/").pop()?.split("?")[0];
    apiPath = filename ? `/api/files/resumes/${filename}` : url;
  } else if (url.startsWith("/api/files/")) {
    apiPath = url.split("?")[0];
  } else if (url.startsWith("http")) {
    try {
      const parsed = new URL(url);
      if (parsed.pathname.startsWith("/api/files/")) {
        apiPath = parsed.pathname;
      }
    } catch {
      return null;
    }
  }

  if (!apiPath.startsWith("/api/files/")) return null;

  return apiPath;
};
