"use client";

import { useEffect, useReducer, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
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

type Action =
  | { type: "SET_FIELD"; field: string; value: string | boolean }
  | { type: "SET_EVENT"; event: Event };

function reducer(state: Event, action: Action): Event {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value } as Event;
    case "SET_EVENT":
      return { ...action.event };
    default:
      return state;
  }
}

export default function EditEventPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [event, dispatch] = useReducer(reducer, {
    id: 0,
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    isRecurring: false,
    frequency: "",
  });

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const { data } = await axios.get(`/api/events/${id}`);
        if (data.success) {
          dispatch({ type: "SET_EVENT", event: data.event });
        }
      } catch (error) {
        toast.error("Failed to load event data");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
      dispatch({
        type: "SET_FIELD",
        field: name,
        value: e.target.checked,
      });
    } else {
      dispatch({
        type: "SET_FIELD",
        field: name,
        value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`/api/events/${id}`, event);
      toast.success("Event updated successfully");
      router.push("/");
    } catch (error: unknown) {
      console.log(error);
      toast.error("Failed to update event");
    }
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black text-gray-800 dark:text-gray-100">
        Loading event...
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-10 text-gray-900 dark:text-gray-100">
      <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 p-8 rounded-xl shadow">
        <h1 className="text-3xl font-semibold mb-6 text-center">Edit Event</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="title"
            value={event.title}
            onChange={handleChange}
            placeholder="Event title"
            className="w-full p-3 border rounded-lg dark:bg-zinc-800"
            required
          />
          <textarea
            name="description"
            value={event.description || ""}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-3 border rounded-lg dark:bg-zinc-800"
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Start Date</label>
              <input
                type="datetime-local"
                name="startDate"
                value={event.startDate.slice(0, 16)}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg dark:bg-zinc-800"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">End Date</label>
              <input
                type="datetime-local"
                name="endDate"
                value={event.endDate.slice(0, 16)}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg dark:bg-zinc-800"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isRecurring"
              checked={event.isRecurring}
              onChange={handleChange}
            />
            <label>Recurring Event</label>
          </div>
          {event.isRecurring && (
            <input
              type="text"
              name="frequency"
              value={event.frequency || ""}
              onChange={handleChange}
              placeholder="e.g. weekly, monthly"
              className="w-full p-3 border rounded-lg dark:bg-zinc-800"
            />
          )}
          <button
            type="submit"
            className="w-full bg-primary text-white p-3 rounded-lg hover:bg-blue-700"
          >
            Update Event
          </button>
        </form>
      </div>
    </div>
  );
}
