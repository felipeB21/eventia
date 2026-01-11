import { Elysia, t } from "elysia";
import { db } from "@/db";
import { getSessionServer } from "@/lib/auth-server";
import { CoverUploadService } from "@/services/cover";
import { event, eventCategoryEnum, user } from "@/db/schema";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
const categories = eventCategoryEnum.enumValues;

const app = new Elysia({ prefix: "/api" })
  .post(
    "/event/create",
    async ({ body, set }) => {
      const session = await getSessionServer();
      if (!session?.user?.id) {
        set.status = 401;
        return { error: "Unauthorized" };
      }

      const userId = session.user.id;
      const { title, description, image, category, location, startsAt } = body;

      try {
        const coverService = new CoverUploadService();
        const coverBuffer = Buffer.from(await image.arrayBuffer());
        const coverKey = await coverService.saveCover(
          userId,
          coverBuffer,
          image.type
        );

        const eventId = randomUUID();

        const [newEvent] = await db
          .insert(event)
          .values({
            id: eventId,
            title,
            description,
            image: coverKey,
            location,
            category: category,
            startsAt: new Date(startsAt),
            creatorId: userId,
          })
          .returning();

        return { success: true, id: newEvent.id };
      } catch (error) {
        console.log(error);

        set.status = 500;
        return { error: "Failed to create event" };
      }
    },
    {
      body: t.Object({
        title: t.String(),
        description: t.Optional(t.String()),
        image: t.File(),
        startsAt: t.String(),
        category: t.Enum(Object.fromEntries(categories.map((c) => [c, c]))),
        location: t.String(),
      }),
    }
  )
  .get(
    "/events",
    async ({ query }) => {
      const { limit, offset } = query;

      // 1. Buscamos los datos con el Join
      const results = await db
        .select()
        .from(event)
        .innerJoin(user, eq(event.creatorId, user.id))
        .where(eq(event.status, "active"))
        .limit(limit)
        .offset(offset);

      const coverService = new CoverUploadService();

      const eventsWithImages = await Promise.all(
        results.map(async ({ event: e, user: u }) => {
          let imageUrl = null;
          if (e.image) {
            imageUrl = await coverService.getSignedUrl(e.image);
          }

          return {
            ...e,
            imageUrl,
            creator: {
              id: u.id,
              name: u.name,
              image: u.image,
            },
          };
        })
      );

      return eventsWithImages;
    },
    {
      query: t.Object({
        limit: t.Numeric({ default: 10 }), // t.Numeric permite que el string de la URL sea número
        offset: t.Numeric({ default: 0 }),
      }),
    }
  );

export const GET = app.fetch;
export const POST = app.fetch;
export type App = typeof app;
