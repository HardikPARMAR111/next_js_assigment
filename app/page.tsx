"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { Calendar, Clock, Repeat, Plus, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Event {
  id: number;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  isRecurring: boolean;
  frequency?: string | null;
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get("/api/events");
        if (data.success) setEvents(data.events);
      } catch (error) {
        console.error("Error loading events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const { data } = await axios.delete(`/api/events/${id}`);
      if (data.success) {
        toast.success("Event deleted successfully");
        setEvents((prev) => prev.filter((event) => event.id !== id));
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Loading events...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 dark:from-blue-500/5 dark:to-indigo-500/5"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
                Event Manager
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Organize and manage your events effortlessly
              </p>
            </div>
            <Link href="/events/create">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                Create Event
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg p-12 rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50">
              <Calendar className="w-20 h-20 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-center text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">
                No events yet
              </p>
              <p className="text-center text-gray-500 dark:text-gray-500">
                Start by creating your first event
              </p>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="group relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative p-6">
                  {/* Recurring badge */}
                  {event.isRecurring && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-semibold rounded-full shadow-md">
                      <Repeat className="w-3.5 h-3.5" />
                      {event.frequency?.toLowerCase() || "recurring"}
                    </div>
                  )}

                  <Link href={`/events/${event.id}`} className="block mb-4">
                    <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {event.title}
                    </h2>

                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                      {event.description || "No description provided"}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">
                          {new Date(event.startDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <Clock className="w-4 h-4 text-indigo-500" />
                        <span className="font-medium">
                          {new Date(event.endDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Action buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Link href={`/events/edit/${event.id}`} className="flex-1">
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 hover:from-blue-500 hover:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-gray-700 dark:text-gray-200 hover:text-white font-medium rounded-xl transition-all duration-300 shadow-sm hover:shadow-md">
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                    </Link>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 hover:from-red-500 hover:to-red-600 text-red-600 dark:text-red-400 hover:text-white font-medium rounded-xl transition-all duration-300 shadow-sm hover:shadow-md">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-gray-900 dark:text-white text-xl">
                            Delete Event?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                            This action cannot be undone. This will permanently
                            remove "{event.title}" from the database.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(event.id)}
                            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
