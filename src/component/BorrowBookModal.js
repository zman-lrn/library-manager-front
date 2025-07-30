import React, { useState, useEffect } from "react";
import { allbooks, allmembers, BorrowSubmit } from "../axios/axios";
import { toast } from "react-toastify";

export default function BorrowBookModal({
  onClose,
  onSuccess,
  selectedBook,
  selectedMember,
  setSelectedBook,
  setSelectedMember,
}) {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [err, setErr] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const [rentDate, setRentDate] = useState(today);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 10);
    return d.toISOString().split("T")[0];
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    allbooks(token).then((res) => {
      if (res) setBooks(res.data);
    });

    allmembers(token).then((res) => {
      if (res) setMembers(res.data);
    });
  }, []);

  const handleSubmit = async () => {
    if (!selectedBook || !selectedMember || !dueDate || !rentDate) {
      setErr("Please fill out all fields.");
      return;
    }

    const token = localStorage.getItem("token");
    const payload = {
      book_id: parseInt(selectedBook),
      member_id: parseInt(selectedMember),
      due_date: dueDate,
    };

    try {
      const response = await BorrowSubmit(payload, token);
      if (response.message) {
        setErr(response.message);
      } else {
        toast.success("Book borrowed successfully!");
        onSuccess();
        setSelectedBook("");
        setSelectedMember("");
        setRentDate(today);
        setDueDate(
          new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0]
        );
        setErr("");
        onClose();
      }
    } catch (error) {
      setErr("Failed to submit borrow record. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-950">Borrow Book</h2>
          <button
            className="text-gray-600 hover:text-red-500"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Select a book and member to create a new borrow record.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Book
            </label>
            <select
              className="w-full border rounded px-3 py-2 mt-1 text-sm"
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
            >
              <option value="">Choose book to borrow</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {`${b.title} | ${b.author} | Copies: ${b.available_copies}`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Member
            </label>
            <select
              className="w-full border rounded px-3 py-2 mt-1 text-sm"
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
            >
              <option value="">Choose a member</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} - ({m.email})
                </option>
              ))}
            </select>
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Rent Date
              </label>
              <input
                type="date"
                className="w-full border rounded px-1 py-2 mt-1 text-sm"
                value={rentDate}
                onChange={(e) => {
                  const newRentDate = e.target.value;
                  setRentDate(newRentDate);
                  const due = new Date(newRentDate);
                  due.setDate(due.getDate() + 10);
                  setDueDate(due.toISOString().split("T")[0]);
                }}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Due Date
              </label>
              <input
                type="date"
                className="w-full border rounded px-1 py-2 mt-1 text-sm"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="text-red-500 mt-1">{err}</div>
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
            Borrow Book
          </button>
        </div>
      </div>
    </div>
  );
}
