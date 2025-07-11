// GenreDeleteModal.js
import React from "react";

export default function GenreDeleteModal({ show, onClose, onConfirm, genre }) {
  if (!show || !genre) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Delete Genre
        </h2>
        <p className="text-sm text-gray-700 mb-4">
          Are you sure you want to delete <strong>{genre.name}</strong>?
        </p>
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
