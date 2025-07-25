import React, { useEffect, useState } from "react";
import { AlertTriangle, TrendingUp, Book, Timer, Repeat } from "lucide-react";
import { overdue, popularGenres, totalBorrows } from "../axios/axios";

export default function Report() {
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [popularGenre, setPopularGenres] = useState([]);
  const [totalborrwed, setTotalborrwed] = useState([]);

  useEffect(() => {
    const fetchOverdueBooks = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await overdue(token);

        if (response && response.status === 200) {
          setOverdueBooks(response.data);
        } else {
          console.error("Failed to fetch overdue books");
        }
      } catch (error) {
        console.error("Error fetching overdue books:", error);
      }
    };
    const fetchpopularGenres = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await popularGenres(token);

        if (response && response.status === 200) {
          setPopularGenres(response.data);
        } else {
          console.error("Failed to fetch overdue books");
        }
      } catch (error) {
        console.error("Error fetching overdue books:", error);
      }
    };
    const fetchtotalBorrows = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await totalBorrows(token);

        if (response && response.status === 200) {
          setTotalborrwed(response.data);
        } else {
          console.error("Failed to fetch overdue books");
        }
      } catch (error) {
        console.error("Error fetching overdue books:", error);
      }
    };
    fetchtotalBorrows();
    fetchOverdueBooks();
    fetchpopularGenres();
  }, []);
  console.log("popularGenre", popularGenre);

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Library analytics and reports</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-lg border bg-card text-card-foreground shadow-lg">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="text-2xl font-semibold flex items-center text-gray-900">
                <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                Overdue Books
              </div>
              <div className="text-sm text-muted-foreground text-gray-700">
                Books that are past their due date
              </div>
            </div>
            <div className="p-6 pt-0 space-y-4">
              {overdueBooks.map((book, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-3 bg-red-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-pretty text-gray-900">
                      {book.book?.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      Member: {book.member?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Due: {book.due_date}
                    </p>
                  </div>
                  <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-gray-300 bg-rose-600">
                    Overdue
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-lg">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="text-2xl font-semibold flex items-center text-gray-900">
                <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
                Popular Genres
              </div>
              <div className="text-sm text-muted-foreground text-gray-600">
                Most borrowed book genres
              </div>
            </div>
            <div className="p-6 pt-0 space-y-4">
              {popularGenre.map((genre, idx) => {
                const percentage = (genre.borrow_count / 45) * 100;
                return (
                  <div
                    key={genre.genre_name}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500 font-medium">
                        #{idx + 1}
                      </span>
                      <span className="font-medium text-gray-700">
                        {genre.genre_name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        {genre.borrow_count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Borrows This Month"
            value={totalborrwed.totalBorrowsThisMonth}
            change="+12%"
            icon={<Book />}
          />
          <StatCard
            title="Average Borrow Duration"
            value={`${totalborrwed.averageBorrowDuration} days`}
            change="-2 days"
            icon={<Timer />}
          />
          <StatCard
            title="Return Rate"
            value={`${totalborrwed.returnRate}%`}
            change="+1.2%"
            icon={<Repeat />}
          />
        </div>
      </div>
    </main>
  );
}

function StatCard({ title, value, change, icon }) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-lg">
      <div className="p-6 flex justify-between items-center pb-2">
        <div className="text-sm font-medium tracking-tight text-gray-950">
          {title}
        </div>
        <div className="text-muted-foreground h-4 w-4">{icon}</div>
      </div>
      <div className="p-6 pt-0">
        <div className="text-2xl font-bold text-gray-950">{value}</div>
        <p className="text-xs text-gray-700">{change} from last month</p>
      </div>
    </div>
  );
}
