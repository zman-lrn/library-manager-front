import React, { useState, useEffect } from "react";
import { addGenre, updateGenre } from "../axios/axios";

export default function GenreModal({
  show,
  onClose,
  onSuccess,
  editData = null,
}) {
  const [genre, setGenre] = useState({ name: "" });
  const [err, setErr] = useState("");

  useEffect(() => {
    if (editData) {
      setGenre({ name: editData.name });
    } else {
      setGenre({ name: "" });
    }
    setErr("");
  }, [editData]);

  const handleSubmit = async () => {
    const trimmedName = genre.name.trim();
    if (!trimmedName) {
      setErr("Please enter a genre name.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      let response;

      if (editData) {
        response = await updateGenre(editData.id, { name: trimmedName }, token);
      } else {
        response = await addGenre({ name: trimmedName }, token);
      }

      if (response && (response.status === 200 || response.status === 201)) {
        onSuccess(response.data);
        onClose();
        setGenre({ name: "" });
      }
    } catch (error) {
      setErr("An error occurred while saving the genre.");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-950">
            {editData ? "Edit Genre" : "Add Genre"}
          </h2>
          <button
            className="text-gray-600 hover:text-red-500"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          {editData
            ? "Update the genre name below."
            : "Enter the name for the new genre."}
        </p>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Genre Name
          </label>
          <input
            type="text"
            className="w-full border rounded px-1 py-2 mt-1"
            value={genre.name}
            onChange={(e) => setGenre({ ...genre, name: e.target.value })}
          />
        </div>

        {err && <p className="text-red-600 text-sm mt-2 text-center">{err}</p>}

        <div className="flex justify-end gap-2 mt-6">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-gray-950 text-white rounded"
            onClick={handleSubmit}
          >
            {editData ? "Update Genre" : "Create Genre"}
          </button>
        </div>
      </div>
    </div>
  );
}
