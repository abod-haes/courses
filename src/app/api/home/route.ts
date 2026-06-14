import { apiSuccess } from "@/shared/lib/api/api-server.service";
import { cookies } from "next/headers";
import { localeCookieName } from "@/shared/lib/preferences";
import { resolveLocale } from "@/shared/lib/helpers/locale.helper";
import { getHomeMessages } from "@/features/home/home.data";

export async function GET() {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(localeCookieName)?.value;
  const locale = resolveLocale(localeCookie);
  const data = getHomeMessages(locale);

  return apiSuccess(data);
}
