import React, { useEffect, useState } from "react";
import { allborrows } from "../axios/axios";
import { ArrowLeftRight } from "lucide-react";

export default function RecentActivity() {
  const [borrows, setBorrows] = useState([]);
  console.log("boooo", borrows);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchAllBorrows = async () => {
      const data = await allborrows(token);
      if (data) setBorrows(data.data);
    };

    fetchAllBorrows();
  }, []);

  return (
    <div className="rounded-lg border bg-white text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h2 className="text-2xl font-semibold text-gray-950">
          Recent Activity
        </h2>
        <p className="text-sm text-gray-600">
          System-wide borrow and return operations
        </p>
      </div>

      <div className="p-6 pt-0">
        <div className="space-y-4">
          {(borrows || []).map((item, index) => {
            const isReturned = item.return_date !== null;
            const type = isReturned ? "returned" : "borrowed";
            const date = isReturned ? item.return_date : item.borrow_date;

            return (
              <div
                key={index}
                className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
              >
                <div
                  className={`p-2 rounded-full ${
                    type === "borrowed"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  <ArrowLeftRight className="h-4 w-4" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium capitalize text-gray-900">
                    {type}: {item.book?.title || "Untitled Book"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Member: {item.member?.name || "Unknown"} •{" "}
                    {new Date(date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
