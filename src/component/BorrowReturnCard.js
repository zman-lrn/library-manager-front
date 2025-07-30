import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { BookOpen, User, Calendar } from "lucide-react";
import { allbooks, allmembers, BorrowSubmit } from "../axios/axios";

export default function BorrowReturnCard({
  data,
  onSuccess,
  showBorrowModal,
  setShowBorrowModal,
  selectedBook,
  selectedMember,
  setSelectedBook,
  setSelectedMember,
}) {
  const { title, member, status, borrowedDate, dueDate, returnedDate } = data;
  const [borrow, setBorrows] = useState([]);
  const [members, setMember] = useState([]);
  const [err, setErr] = useState("");

  const statusColors = {
    ACTIVE: "text-white bg-gray-900",
    RETURNED: "text-gray-900 bg-gray-200",
    OVERDUE: "text-white bg-red-600",
  };

  const token = localStorage.getItem("token");
  const fetchBooks = async () => {
    const response = await allbooks(token);
    if (response) setBorrows(response.data);
  };
  const fetchmembers = async () => {
    const data = await allmembers(token);

    if (data) {
      setMember(data.data);
      toast.success("Borrow and return data loaded successfully!", {
        toastId: "borrow-success",
      });
    }
  };
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    fetchBooks();
    fetchmembers();
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const [rentDate, setRentDate] = useState(() => {
    return today;
  });

  const [dueDateb, setDueDate] = useState(() => {
    const due = new Date();
    due.setDate(due.getDate() + 10);
    return due.toISOString().split("T")[0];
  });

  const handleBorrowSubmit = async () => {
    if (!selectedBook || !selectedMember || !dueDateb || !rentDate) {
      setErr("Please fill out all fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const payload = {
        book_id: parseInt(selectedBook),
        member_id: parseInt(selectedMember),
        // borrow_date: rentDate, //
        due_date: dueDateb,
      };

      const response = await BorrowSubmit(payload, token);

      if (response.message) {
        console.log(response.statusCode);
        setErr(response.message);
      } else {
        onSuccess();
        toast.success("Book borrowed successfully!");

        await fetchBooks();
        await fetchmembers();
        setShowBorrowModal(false);
        setSelectedBook("");
        setSelectedMember("");
        setRentDate(today);
        setDueDate(
          new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0]
        );
        setErr("");
      }
    } catch (error) {
      console.error("Error submitting borrow record:", error);
      setErr("Failed to submit borrow record. Please try again.");
    }
  };

  return (
    <>
      <div className="rounded-lg border bg-white shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="font-semibold text-lg flex items-center text-gray-950">
                <BookOpen className="mr-2 h-5 w-5" />
                {title}
              </div>
              <div className="text-sm text-gray-700 flex items-center mt-1">
                <User className="mr-2 h-4 w-4" />
                {member}
              </div>
            </div>
            <div
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[status]}`}
            >
              {status}
            </div>
          </div>
        </div>
        <div className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <div>
                <span className="font-medium">Borrowed:</span>
                <br />
                {borrowedDate}
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <div>
                <span className="font-medium">Due:</span>
                <br />
                {dueDateb}
              </div>
            </div>
            {returnedDate && (
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <div>
                  <span className="font-medium">Returned:</span>
                  <br />
                  {returnedDate}
                </div>
              </div>
            )}
          </div>

          {status === "ACTIVE" && (
            <div className="mt-4">
              <button className="rounded-lg h-9 px-3 bg-gray-950 text-gray-100">
                Mark as Returned
              </button>
            </div>
          )}
        </div>
      </div>
      {console.log("Modal showBorrowModal is", showBorrowModal)}
      {mounted && showBorrowModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-950">
                Borrow Book
              </h2>
              <button
                className="text-gray-600 hover:text-red-500"
                onClick={() => setShowBorrowModal(false)}
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
                  {borrow.map((b, idx) => (
                    <option key={idx} value={b.id}>
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
                    value={dueDateb}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="text-red-500 mt-1">{err}</div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
                onClick={() => setShowBorrowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-gray-950 text-white rounded"
                onClick={handleBorrowSubmit}
              >
                Borrow Book
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
