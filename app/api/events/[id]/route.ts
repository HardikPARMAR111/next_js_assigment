import { NextResponse } from "next/server";
import { PrismaClient, Frequency } from "@prisma/client";

const prisma = new PrismaClient();

interface EventData {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  isRecurring?: boolean;
  frequency?: Frequency | null;
  daysOfWeek?: string[];
  recurrenceEnd?: string | null;
}

// Get Event by ID
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> } // 👈 updated type
) {
  try {
    const { id } = await context.params; // 👈 await the params Promise
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing event ID" },
        { status: 400 }
      );
    }

    const event = await prisma.event.findUnique({
      where: { id: numericId },
    });

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, event });
  } catch (error: unknown) {
    console.error("Error fetching event:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return NextResponse.json(
      { success: false, message: "Failed to fetch event", error: message },
      { status: 500 }
    );
  }
}

// Update Event By Id
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const eventId = parseInt(id, 10);

    if (isNaN(eventId)) {
      return NextResponse.json(
        { success: false, message: "Invalid event ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { title, description, startDate, endDate, isRecurring, frequency } =
      body;

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isRecurring,
        frequency,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update event" },
      { status: 500 }
    );
  }
}

// Delete Event By Id

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const eventId = parseInt(id, 10);

    if (isNaN(eventId)) {
      return NextResponse.json(
        { success: false, message: "Invalid event ID" },
        { status: 400 }
      );
    }

    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    await prisma.event.delete({ where: { id: eventId } });

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error: unknown) {
    console.error("Error deleting event:", error);
    const message =
      error instanceof Error ? error.message : "Unexpected server error";
    return NextResponse.json(
      { success: false, message: "Failed to delete event", error: message },
      { status: 500 }
    );
  }
}
