"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Repeat,
  ArrowLeft,
  MapPin,
  AlertCircle,
} from "lucide-react";

interface Event {
  id: number;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  isRecurring: boolean;
  frequency?: string | null;
  daysOfWeek: string[];
  recurrenceEnd?: string | null;
}

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchEvent = async () => {
      try {
        const { data } = await axios.get(`/api/events/${id}`);
        if (data.success) setEvent(data.event);
      } catch (error) {
        console.error("Error loading event:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Loading event...
          </p>
        </div>
      </div>
    );

  if (!event)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col items-center justify-center p-6">
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg p-12 rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Event Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/">
            <button className="px-6 py-3 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-white font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto">
              <ArrowLeft className="w-5 h-5" />
              Back to Events
            </button>
          </Link>
        </div>
      </div>
    );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const startDateTime = formatDate(event.startDate);
  const endDateTime = formatDate(event.endDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Events</span>
        </Link>

        {/* Main Card */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden">
          {/* Header Section with Gradient */}
          <div className="relative bg-gradient-to-r from-primary to-indigo-600 dark:from-primary dark:to-indigo-500 p-8 md:p-12">
            <div className="absolute inset-0 bg-black/5"></div>
            <div className="relative">
              {event.isRecurring && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-4">
                  <Repeat className="w-4 h-4" />
                  Recurring Event
                </div>
              )}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {event.title}
              </h1>
              {event.description && (
                <p className="text-white/90 text-lg leading-relaxed max-w-3xl">
                  {event.description}
                </p>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-12 space-y-8">
            {/* Date & Time Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Start Date/Time */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-2xl border-2 border-green-200 dark:border-green-800/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-500 rounded-xl">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Start
                  </h3>
                </div>
                <p className="text-gray-900 dark:text-gray-100 font-semibold mb-1">
                  {startDateTime.date}
                </p>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">{startDateTime.time}</span>
                </div>
              </div>

              {/* End Date/Time */}
              <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 p-6 rounded-2xl border-2 border-red-200 dark:border-red-800/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-red-500 rounded-xl">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    End
                  </h3>
                </div>
                <p className="text-gray-900 dark:text-gray-100 font-semibold mb-1">
                  {endDateTime.date}
                </p>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">{endDateTime.time}</span>
                </div>
              </div>
            </div>

            {/* Recurring Information */}
            {event.isRecurring && (
              <div className="bg-gradient-to-br from-primary/5 to-indigo-500/5 dark:from-primary/10 dark:to-indigo-500/10 p-6 rounded-2xl border-2 border-primary/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary rounded-xl">
                    <Repeat className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Recurrence Details
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Frequency */}
                  <div className="flex items-start gap-3">
                    <div className="min-w-[140px] text-gray-600 dark:text-gray-400 font-medium">
                      Frequency:
                    </div>
                    <div className="flex-1">
                      <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary dark:text-primary/90 rounded-lg font-semibold">
                        {event.frequency}
                      </span>
                    </div>
                  </div>

                  {/* Days of Week */}
                  {event.daysOfWeek && event.daysOfWeek.length > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="min-w-[140px] text-gray-600 dark:text-gray-400 font-medium">
                        Days of Week:
                      </div>
                      <div className="flex-1 flex flex-wrap gap-2">
                        {event.daysOfWeek.map((day) => (
                          <span
                            key={day}
                            className="px-3 py-1.5 bg-white dark:bg-slate-700 border-2 border-primary/30 text-gray-900 dark:text-gray-100 rounded-lg font-medium text-sm"
                          >
                            {day.charAt(0) + day.slice(1).toLowerCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recurrence End */}
                  {event.recurrenceEnd && (
                    <div className="flex items-start gap-3">
                      <div className="min-w-[140px] text-gray-600 dark:text-gray-400 font-medium">
                        Ends On:
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-900 dark:text-gray-100 font-semibold">
                          {new Date(event.recurrenceEnd).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-6 border-t-2 border-gray-200 dark:border-slate-700">
              <Link
                href={`/events/edit/${event.id}`}
                className="flex-1 min-w-[200px]"
              >
                <button className="w-full px-6 py-4 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]">
                  Edit Event
                </button>
              </Link>
              <Link href="/" className="flex-1 min-w-[200px]">
                <button className="w-full px-6 py-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-slate-600 dark:hover:to-slate-500 text-gray-900 dark:text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]">
                  View All Events
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
