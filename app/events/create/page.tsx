"use client";

import { useReducer, useState } from "react";
import axios from "axios";
import {
  Calendar,
  Clock,
  Repeat,
  Check,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner"; // ✅ Added

type Frequency = "DAILY" | "WEEKLY" | "MONTHLY" | null;

interface EventFormState {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  isRecurring: boolean;
  frequency: Frequency;
  daysOfWeek: string[];
  recurrenceEnd: string;
  errors: Record<string, string>;
}

type Action =
  | { type: "SET_FIELD"; field: keyof EventFormState; value: unknown }
  | { type: "TOGGLE_DAY"; day: string }
  | { type: "RESET" }
  | { type: "SET_ERRORS"; errors: Record<string, string> };

const initialState: EventFormState = {
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  isRecurring: false,
  frequency: null,
  daysOfWeek: [],
  recurrenceEnd: "",
  errors: {},
};

function reducer(state: EventFormState, action: Action): EventFormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "TOGGLE_DAY":
      return {
        ...state,
        daysOfWeek: state.daysOfWeek.includes(action.day)
          ? state.daysOfWeek.filter((d) => d !== action.day)
          : [...state.daysOfWeek, action.day],
      };
    case "SET_ERRORS":
      return { ...state, errors: action.errors };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default function CreateEventPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!state.title.trim()) errors.title = "Title is required";
    if (!state.startDate) errors.startDate = "Start date is required";
    if (!state.endDate) errors.endDate = "End date is required";

    if (state.isRecurring) {
      if (!state.frequency) errors.frequency = "Select a recurrence frequency";
      if (state.frequency === "WEEKLY" && state.daysOfWeek.length === 0)
        errors.daysOfWeek = "Select at least one day of the week";
    }

    dispatch({ type: "SET_ERRORS", errors });
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const { data } = await axios.post("/api/events", {
        title: state.title,
        description: state.description,
        startDate: state.startDate,
        endDate: state.endDate,
        isRecurring: state.isRecurring,
        frequency: state.frequency,
        daysOfWeek: state.daysOfWeek,
        recurrenceEnd: state.recurrenceEnd || null,
      });

      if (data.success) {
        toast.success("Event created successfully!");
        dispatch({ type: "RESET" });
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Request failed"
        : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const daysList = [
    { value: "MONDAY", label: "Mon" },
    { value: "TUESDAY", label: "Tue" },
    { value: "WEDNESDAY", label: "Wed" },
    { value: "THURSDAY", label: "Thu" },
    { value: "FRIDAY", label: "Fri" },
    { value: "SATURDAY", label: "Sat" },
    { value: "SUNDAY", label: "Sun" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Events</span>
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-indigo-600 dark:from-primary dark:to-indigo-400 bg-clip-text text-transparent mb-2">
            Create New Event
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Fill in the details to schedule your event
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <Calendar className="w-4 h-4 text-primary" />
                Event Title
              </label>
              <input
                type="text"
                placeholder="Enter event title"
                value={state.title}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "title",
                    value: e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
              {state.errors.title && (
                <p className="flex items-center gap-1 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {state.errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                placeholder="Add event description (optional)"
                value={state.description}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "description",
                    value: e.target.value,
                  })
                }
                rows={4}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
              />
            </div>

            {/* Date Range */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Clock className="w-4 h-4 text-primary" />
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={state.startDate}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_FIELD",
                      field: "startDate",
                      value: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
                {state.errors.startDate && (
                  <p className="flex items-center gap-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {state.errors.startDate}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={state.endDate}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_FIELD",
                      field: "endDate",
                      value: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
                {state.errors.endDate && (
                  <p className="flex items-center gap-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {state.errors.endDate}
                  </p>
                )}
              </div>
            </div>

            {/* Recurring Toggle */}
            <div className="p-5 bg-gradient-to-r from-primary/5 to-indigo-500/5 dark:from-primary/10 dark:to-indigo-500/10 rounded-2xl border-2 border-primary/20">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={state.isRecurring}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_FIELD",
                        field: "isRecurring",
                        value: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 dark:bg-slate-700 rounded-full peer-checked:bg-primary transition-colors"></div>
                  <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-md"></div>
                </div>
                <div className="flex items-center gap-2">
                  <Repeat className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Recurring Event
                  </span>
                </div>
              </label>
            </div>

            {/* Recurrence Settings */}
            {state.isRecurring && (
              <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-blue-50/50 dark:from-slate-900/50 dark:to-slate-800/50 rounded-2xl border-2 border-dashed border-primary/30">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Frequency
                  </label>
                  <select
                    value={state.frequency ?? ""}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_FIELD",
                        field: "frequency",
                        value: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  >
                    <option value="">Select Frequency</option>
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                  </select>
                  {state.errors.frequency && (
                    <p className="flex items-center gap-1 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {state.errors.frequency}
                    </p>
                  )}
                </div>

                {state.frequency === "WEEKLY" && (
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Days of Week
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {daysList.map((day) => (
                        <label
                          key={day.value}
                          className="relative cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={state.daysOfWeek.includes(day.value)}
                            onChange={() =>
                              dispatch({ type: "TOGGLE_DAY", day: day.value })
                            }
                            className="sr-only peer"
                          />
                          <div className="px-4 py-2.5 bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 rounded-xl peer-checked:bg-primary peer-checked:border-primary peer-checked:text-white text-gray-700 dark:text-gray-300 font-medium transition-all hover:border-primary/50 peer-checked:shadow-lg peer-checked:shadow-primary/25">
                            {day.label}
                          </div>
                        </label>
                      ))}
                    </div>
                    {state.errors.daysOfWeek && (
                      <p className="flex items-center gap-1 text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {state.errors.daysOfWeek}
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Recurrence End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={state.recurrenceEnd}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_FIELD",
                        field: "recurrenceEnd",
                        value: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Event...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Create Event
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
