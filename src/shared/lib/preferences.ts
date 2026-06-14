export const localeCookieName = "courses-locale";
export const themeCookieName = "courses-theme";

export const defaultLocale = "en";
export const defaultTheme = "light";

export function readCookieValue(cookieHeader: string | undefined, name: string) {
  if (!cookieHeader) {
    return null;
  }

  const parts = cookieHeader.split(";").map((part) => part.trim());
  const match = parts.find((part) => part.startsWith(`${name}=`));

  if (!match) {
    return null;
  }

  return decodeURIComponent(match.slice(name.length + 1));
}
