import { NextResponse } from "next/server";
import { PrismaClient, Frequency } from "@prisma/client";

const prisma = new PrismaClient();

interface EventData {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  isRecurring?: boolean;
  frequency?: Frequency | null;
  daysOfWeek?: string[];
  recurrenceEnd?: string | null;
}

// Create event
export async function POST(req: Request) {
  try {
    const data: EventData = await req.json();

    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        isRecurring: data.isRecurring ?? false,
        frequency: data.frequency ?? null,
        daysOfWeek: data.daysOfWeek ?? [],
        recurrenceEnd: data.recurrenceEnd ? new Date(data.recurrenceEnd) : null,
      },
    });

    return NextResponse.json({ success: true, event });
  } catch (error: unknown) {
    console.error("Error creating event:", error);

    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return NextResponse.json(
      { success: false, message: "Failed to create event", error: message },
      { status: 500 }
    );
  }
}

// Fetch All Events
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { startDate: "asc" },
    });
    return NextResponse.json({ success: true, events });
  } catch (error: unknown) {
    console.error("Error fetching event:", error);

    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return NextResponse.json(
      { success: false, message: "Failed to fetch events", error: message },
      { status: 500 }
    );
  }
}
