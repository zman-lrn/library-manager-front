import React from "react";
import { ArrowLeftRight } from "lucide-react";

export default function BorrowReturnHeader({
  setShowBorrowModal,
  setShowReturnModal,
}) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Borrow & Return</h1>
        <p className="text-gray-600">
          Manage book borrowing and return operations
        </p>
      </div>
      <div className="flex space-x-2">
        <button
          className="inline-flex items-center justify-center gap-2 py-2 px-2 bg-gray-950 text-gray-100 rounded-md"
          onClick={() => {
            console.log("clicked");
            setShowBorrowModal(true);
          }}
        >
          <ArrowLeftRight className="mr-2 h-4 w-4" />
          Borrow Book
        </button>

        <button
          className="inline-flex items-center justify-center gap-2 py-2 px-2 bg-gray-950 text-gray-100 rounded-md"
          onClick={() => setShowReturnModal(true)}
        >
          <ArrowLeftRight className="h-4 w-4 mr-2" />
          Return Book
        </button>
      </div>
    </div>
  );
}
