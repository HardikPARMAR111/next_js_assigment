"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Event {
  id: number;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  isRecurring: boolean;
  frequency?: string | null;
  daysOfWeek?: string | null;
}

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get("/api/events");
        if (data.success) setEvents(data.events);
      } catch (err) {
        console.error("Error fetching events:", err);
        toast.error("Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const rows = [];
  let days = [];
  let day = startDate;

  // Expand recurring events for display
  const expandRecurringEvents = (event: Event) => {
    const expanded: Date[] = [];
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    const monthStartDate = startOfMonth(currentMonth);
    const monthEndDate = endOfMonth(currentMonth);

    if (!event.isRecurring) return [start];

    switch (event.frequency) {
      case "daily":
        for (
          let d = new Date(monthStartDate);
          d <= monthEndDate;
          d.setDate(d.getDate() + 1)
        ) {
          expanded.push(new Date(d));
        }
        break;
      case "weekly":
        if (!event.daysOfWeek) return [];
        const days = JSON.parse(event.daysOfWeek);
        const weekdays = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        for (
          let d = new Date(monthStartDate);
          d <= monthEndDate;
          d.setDate(d.getDate() + 1)
        ) {
          if (days.includes(weekdays[d.getDay()])) expanded.push(new Date(d));
        }
        break;
      case "monthly":
        const dateNum = start.getDate();
        const thisMonthDate = new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth(),
          dateNum
        );
        if (thisMonthDate >= monthStartDate && thisMonthDate <= monthEndDate)
          expanded.push(thisMonthDate);
        break;
    }
    return expanded;
  };

  // Build the calendar grid
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const dayEvents = events.filter((event) => {
        const eventDates = expandRecurringEvents(event);
        return (
          eventDates.some((d) => isSameDay(d, day)) ||
          isSameDay(new Date(event.startDate), day)
        );
      });

      days.push(
        <div
          key={day.toString()}
          className={`border rounded-xl p-2 min-h-[110px] bg-white/70 dark:bg-slate-800/60 transition-all duration-200 ${
            isSameMonth(day, monthStart)
              ? "text-gray-900 dark:text-white"
              : "text-gray-400 dark:text-gray-500"
          } hover:bg-blue-50 dark:hover:bg-slate-700/70`}
        >
          <div className="text-sm font-semibold mb-1 text-right">
            {format(day, "d")}
          </div>
          <div className="space-y-1 overflow-y-auto max-h-[80px]">
            {dayEvents.slice(0, 2).map((event) => (
              <Link
                href={`/events/${event.id}`}
                key={event.id}
                className={`block text-xs font-medium rounded-md px-2 py-1 truncate ${
                  event.isRecurring
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                }`}
              >
                {event.title}
              </Link>
            ))}
            {dayEvents.length > 2 && (
              <span className="block text-xs text-gray-500 dark:text-gray-400">
                +{dayEvents.length - 2} more
              </span>
            )}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day.toString()} className="grid grid-cols-7 gap-2">
        {days}
      </div>
    );
    days = [];
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <CalendarDays className="w-7 h-7 text-blue-600" />
            {format(currentMonth, "MMMM yyyy")}
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="p-2 rounded-full bg-gray-200 dark:bg-slate-700 hover:bg-blue-500 hover:text-white transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-full bg-gray-200 dark:bg-slate-700 hover:bg-blue-500 hover:text-white transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <Link
              href="/events/create"
              className="ml-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow hover:shadow-lg transition"
            >
              + Add Event
            </Link>
          </div>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 text-center font-semibold text-gray-600 dark:text-gray-400 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="space-y-2">{rows}</div>
      </div>
    </div>
  );
}
