// app/api/debug-db/route.ts
import { prisma } from "@/lib/prisma/client";

export async function GET() {
  try {
    const result = await prisma.user.findMany({ take: 1 });
    return new Response(JSON.stringify(result));
  } catch (err: unknown) {
    let message = "Unknown error";

    if (err instanceof Error) {
      message = err.message;
    }

    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
