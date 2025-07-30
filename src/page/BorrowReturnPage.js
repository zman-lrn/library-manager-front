import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BorrowReturnHeader from "../component/BorrowReturnHeader";
import BorrowReturnCard from "../component/BorrowReturnCard";
import BorrowBookModal from "../component/BorrowBookModal";
import { allborrowsReturn, ReturnBorrowedBook } from "../axios/axios";

export default function BorrowReturnPage() {
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedReturnBook, setSelectedReturnBook] = useState("");
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [allBorrowed, setallBorrowed] = useState([]);
  const [err, setErr] = useState("");

  const refreshBorrowRecords = async () => {
    await fetchBorrowRecords();
  };
  function toDateOnly(date) {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  const fetchBorrowRecords = async () => {
    const token = localStorage.getItem("token");
    const response = await allborrowsReturn(token);
    if (response) {
      setallBorrowed(response.data);
    }
    console.log(response.data);

    if (response?.data) {
      const mapped = response.data.map((record) => {
        let status = "ACTIVE";

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const due = new Date(record.due_date);
        due.setHours(0, 0, 0, 0);

        const returned = record.return_date;

        if (returned) {
          status = "RETURNED";
        } else if (today > due) {
          status = "OVERDUE";
        } else {
          status = "ACTIVE";
        }

        return {
          id: record.id,
          title: record.book.title,
          member: record.member.name,
          status,
          borrowedDate: record.borrow_date,
          dueDate: record.due_date,
          returnedDate: record.return_date,
        };
      });
      setBorrowRecords(mapped);
    }
  };
  useEffect(() => {
    fetchBorrowRecords();
  }, []);
  const processedBorrowRecords = allBorrowed.map((item) => {
    const dueDate = new Date(item.due_date);
    const returnDate = item.return_date ? new Date(item.return_date) : null;
    const today = new Date();

    let status = "RETURNED";
    if (!returnDate) {
      status = dueDate < today ? "OVERDUE" : "ACTIVE";
    }

    return {
      id: item.id,
      title: item.book.title,
      author: item.book.author,
      memberName: item.member.name,
      dueDate: item.due_date,
      status: status,
    };
  });

  const returnBook = async () => {
    console.log("selectedReturnBook", selectedReturnBook);

    const token = localStorage.getItem("token");
    try {
      const response = await ReturnBorrowedBook(selectedReturnBook, token);
      console.log("Response:", response.message);

      if (response && response.status === 201) {
        toast.success("Book returned successfully!");
        await fetchBorrowRecords();
        setShowReturnModal(false);
      } else {
        console.log(response.status);

        setErr(response?.message || "Failed to return the book.");
        setShowReturnModal(false);
        setSelectedReturnBook("");
      }
    } catch (error) {
      setErr("An error occurred while submitting the book.");
    }
  };

  return (
    <main className="flex-1 overflow-auto p-6 space-y-6">
      <BorrowReturnHeader
        selectedBook={selectedBook}
        selectedMember={selectedMember}
        setShowBorrowModal={setShowBorrowModal}
        setSelectedBook={setSelectedBook}
        setSelectedMember={setSelectedMember}
        setShowReturnModal={setShowReturnModal}
      />

      <div className="grid gap-4">
        {borrowRecords.map((item, index) => (
          <BorrowReturnCard
            key={index}
            data={item}
            onSuccess={refreshBorrowRecords}
            showBorrowModal={showBorrowModal}
            setShowBorrowModal={setShowBorrowModal}
            selectedBook={selectedBook}
            selectedMember={selectedMember}
            setSelectedBook={setSelectedBook}
            setSelectedMember={setSelectedMember}
          />
        ))}
      </div>
      {showBorrowModal && (
        <BorrowBookModal
          onClose={() => setShowBorrowModal(false)}
          onSuccess={refreshBorrowRecords}
          selectedBook={selectedBook}
          selectedMember={selectedMember}
          setSelectedBook={setSelectedBook}
          setSelectedMember={setSelectedMember}
        />
      )}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-950">
                Return Book
              </h2>
              <button
                className="text-gray-600 hover:text-red-500"
                onClick={() => setShowReturnModal(false)}
              >
                &times;
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Select a borrowed book to mark as returned.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Book to Return
                </label>
                <select
                  className="w-full border rounded px-3 py-2 mt-1"
                  value={selectedReturnBook}
                  onChange={(e) => setSelectedReturnBook(e.target.value)}
                >
                  <option value="">Select Book to Return</option>
                  {allBorrowed.map((record) => {
                    const dueDate = new Date(record.due_date);
                    const formattedDueDate = dueDate.toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    );

                    // Compute status
                    const returnDate = record.return_date
                      ? new Date(record.return_date)
                      : null;
                    const today = new Date();
                    const status = returnDate
                      ? "RETURNED"
                      : dueDate < today
                      ? "OVERDUE"
                      : "ACTIVE";

                    return (
                      <option key={record.id} value={record.id}>
                        {`${record.book.title} by ${record.book.author} | ${record.member.name} | Due: ${formattedDueDate} (${status})`}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {/* <strong>Return Date:</strong> {formattedToday} */}
            </p>
            {err && (
              <p className="text-red-600 text-sm mb-3 text-center">{err}</p>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
                onClick={() => setShowReturnModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-gray-950 text-white rounded"
                onClick={returnBook}
              >
                Return Book
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
