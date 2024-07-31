import { db, Alert, eq } from "astro:db";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({}) => {
  const alerts = await db.select().from(Alert).where(eq(Alert.visible, true));

  return new Response(JSON.stringify(alerts), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
