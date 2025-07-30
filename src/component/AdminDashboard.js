import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Shield,
  BookOpen,
  ArrowLeftRight,
  Plus,
  Settings,
  ChartColumn,
  Import,
} from "lucide-react";

import RecentActivity from "./RecentActivity";
import { allbooks } from "../axios/axios";
import { allmembers } from "../axios/axios";
import { allborrows } from "../axios/axios";
import { Link } from "react-router-dom";

function ActionButton({ href, label, icon, primary = false, danger = false }) {
  const base =
    "justify-center gap-2 rounded-md text-sm font-medium flex flex-col items-center space-y-2 h-auto p-4";

  const styles = danger
    ? "bg-red-0 text-red-700 border border-red-200 hover:bg-red-100"
    : primary
    ? "bg-gray-50 text-primary-foreground hover:bg-gray-400  "
    : "border border-input bg-transparent bg-gray-50  hover:bg-gray-400 ";

  return (
    <Link to={href} className={`${base} ${styles}`}>
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function StatsCard() {
  const [books, setBooks] = useState([]);
  const [member, setMember] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [overdueBorrow, setOverdueBorrows] = useState([]);
  const now = new Date();
  const overdueBorrows = (borrows?.data || []).filter((borrow) => {
    const dueDate = new Date(borrow.due_date);
    return new Date() > dueDate;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);

    const fetchBooks = async () => {
      const data = await allbooks(token);
      if (data) {
        setBooks(data.data);
        toast.success("Books loaded successfully!");
      }
    };

    const fetchmembers = async () => {
      const data = await allmembers(token);
      if (data) setMember(data.data);
    };
    const fetchallborrows = async () => {
      const data = await allborrows(token);
      const activeBorrows = data.data.filter((borrow) => !borrow.return_date);
      setBorrows(activeBorrows);

      const now = new Date();

      const overdueBorrows = (borrows?.data || []).filter((borrow) => {
        const dueDate = new Date(borrow.due_date);
        return new Date() > dueDate;
      });
      setOverdueBorrows(overdueBorrows);
    };
    fetchBooks();
    fetchmembers();
    fetchallborrows();
    const now = new Date();
  }, []);
  // console.log(books.length);
  // console.log(member);
  // console.log(borrows);
  // console.log(overdueBorrow.length);
  const stats = [
    { label: "Total Books", value: books?.length || 0 },
    { label: "Total Members", value: member?.length || 0 },
    { label: "Overdue Books", value: overdueBorrows?.length || 0 },
    { label: "Active Borrows", value: borrows?.length || 0 },
  ];
  return (
    <>
      {stats.map((stat, index) => (
        <div
          className="rounded-lg border bg-white text-card-foreground shadow-lg"
          key={index}
        >
          <div className="p-6 flex items-center justify-between pb-2">
            <div className="text-sm font-semibold tracking-tight text-gray-950">
              {stat.label}
            </div>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-gray-950">{stat.value}</div>
            <p className="text-xs text-muted-foreground text-gray-600">
              All books in system
            </p>
          </div>
        </div>
      ))}
    </>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="inline-flex items-center rounded-full border border-transparent bg-destructive  text-xs font-semibold px-2.5 py-0.5  text-gray-100 bg-red-500">
            <Shield className="w-3 h-3 mr-1 text-gray-100 bg-red-400" />
            ADMINISTRATOR
          </div>
        </div>
      </div>
      <section>
        <p className="text-gray-600">
          Full system access – Manage all library operations
        </p>
        <div className="rounded-lg border border-red-200 bg-red-50 text-card-foreground shadow-sm mt-4">
          <div className="p-6 pt-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900">
                  Administrator Access
                </h3>
                <p className="text-sm text-red-700">
                  You have full system privileges including delete operations,
                  genre management, and staff administration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard />
      </section>
      <section className="rounded-lg border bg-white text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="text-2xl text-gray-900 font-semibold leading-none tracking-tight">
            Quick Actions
          </div>
          <div className="text-sm text-muted-foreground text-gray-500">
            Administrative and library operations
          </div>
        </div>
        <div className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionButton
              href="/borrow-return"
              primary
              icon={<ArrowLeftRight className="h-6 w-6 " />}
              label="Borrow Book"
            />
            <ActionButton
              href="/borrow-return"
              icon={<ArrowLeftRight className="h-6 w-6" />}
              label="Return Book"
            />
            <ActionButton
              href="/members"
              icon={<Plus className="h-6 w-6" />}
              label="Add Member"
            />
            <ActionButton
              href="/books"
              icon={<Plus className="h-6 w-6" />}
              label="Add Book"
            />
            <ActionButton
              href="/genres"
              danger
              icon={<Settings className="h-6 w-6" />}
              label="Manage Genres"
            />
            <ActionButton
              href="/reports"
              danger
              icon={<ChartColumn className="h-6 w-6" />}
              label="Admin Reports"
            />
          </div>
        </div>
      </section>
      <RecentActivity />
    </div>
  );
}
