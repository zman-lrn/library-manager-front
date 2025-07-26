import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Plus, Eye, SquarePen, Trash2, Search } from "lucide-react";
import { addBook } from "../axios/axios";
import { allbooks } from "../axios/axios";
import { editBooks } from "../axios/axios";
import { deleteBooks } from "../axios/axios";

export default function Books() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [books, setBooks] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editBookIndex, setEditBookIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [err, setErr] = useState("");
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    published_year: "",
    available_copies: "",
    genre_id: "",
  });

  const [editBook, setEditBook] = useState({
    title: "",
    author: "",
    published_year: "",
    available_copies: "",
    genre_id: "",
  });
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);

    const fetchBooks = async () => {
      const data = await allbooks(token);
      if (data) {
        const booksWithStatus = data.data.map((book) => ({
          ...book,
          status: book.available_copies > 0 ? "Available" : "Out of Stock",
        }));

        setBooks(booksWithStatus);

        toast.success("Books loaded successfully!");
      }
    };
    fetchBooks();
  }, []);
  const submitBook = async () => {
    const cleanedBook = {
      ...newBook,
      published_year: parseInt(newBook.published_year),
      available_copies: parseInt(newBook.available_copies),
      genre_id: parseInt(newBook.genre_id),
    };

    const token = localStorage.getItem("token");
    if (!token) {
      setErr("Authorization token is missing.");
      return;
    }

    try {
      const response = await addBook(cleanedBook, token);
      console.log("Response:", response.message);

      if (response && response.status === 201) {
        setBooks((prevBooks) => [...prevBooks, response.data]);
        setShowAddModal(false);
        setNewBook({
          title: "",
          author: "",
          published_year: "",
          available_copies: "",
          genre_id: "",
        });
        toast.success("Book add successfully!");
      } else {
        setErr(response.message[0]);
      }
    } catch (error) {
      setErr("An error occurred while submitting the book.");
    }
  };
  async function handelEditBook() {
    const token = localStorage.getItem("token");
    const bookId = editBook.id;

    const updatedData = {
      title: editBook.title,
      author: editBook.author,
      published_year: parseInt(editBook.published_year),
      available_copies: parseInt(editBook.available_copies),
      genre_id: parseInt(editBook.genre_id),
    };
    console.log(updatedData);

    try {
      const response = await editBooks(bookId, updatedData, token);
      console.log("Response message:", response?.message);

      if (response && response.status === 200) {
        const updatedBooks = [...books];
        updatedBooks[editBookIndex] = {
          ...response.data,
          status:
            response.data.available_copies > 0 ? "Available" : "Out of Stock",
        };

        setBooks(updatedBooks);
        setShowEditModal(false);
        setErr("");
        toast.success("Book updated successfully!");
      } else {
        console.error("Failed to update book.");
        setErr(response?.message);
      }
    } catch (error) {
      console.error("Edit failed:", error);
      setErr(error.response.data.message);

      if (error.response && error.response.data?.message) {
        setErr(error.response.data.message);
      } else {
        // setErr(response?.message);
      }
    }
  }
  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    setShowDeleteModal(true);
  };
  const confirmDeleteBook = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await deleteBooks(bookToDelete.id, token);

      if (response.status === 200) {
        setBooks(books.filter((b) => b.id !== bookToDelete.id));
        setShowDeleteModal(false);
        setBookToDelete(null);
        setErr("");
        toast.success("Book deleted successfully!");
      } else {
        setErr("Failed to delete the book.");
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setErr("Book not found.");
      } else {
        setErr("An unexpected error occurred.");
      }
      console.error("Delete failed:", error);
    }
  };
  const filteredBooks = books.filter((book) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      book.title.toLowerCase().includes(lowerSearch) ||
      book.author.toLowerCase().includes(lowerSearch) ||
      (book.genre?.name?.toLowerCase().includes(lowerSearch) ?? false)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Books</h1>
          <p className="text-gray-600">Manage your library's book collection</p>
        </div>
        <button
          className="inline-flex items-center gap-2 text-gray-100 bg-gray-950 px-4 py-2 rounded-md text-sm font-medium cursor-pointer "
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="h-4 w-4" />
          Add Book
        </button>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-5 transform text-gray-400 h-5 w-5 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex h-10 w-[98%] rounded-md border border-input bg-background py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10"
          placeholder="Search books by title, author, or genre..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {filteredBooks.map((book, index) => (
          <div
            key={index}
            className="w-full sm:max-w-md md:max-w-sm lg:max-w-md xl:max-w-2xl mx-auto rounded-lg border mb-3 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="text-lg font-semibold text-gray-900">
                    {book.title}
                  </div>
                  <div className="text-sm text-gray-500">by {book.author}</div>
                </div>
                <div
                  className={`text-xs font-semibold text-white px-2.5 py-0.5 rounded-full ${
                    book.status === "Available" ? "bg-gray-950" : "bg-red-500"
                  }`}
                >
                  {book.status}
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Genre:</span> {book.genre?.name}
                </p>
                <p>
                  <span className="font-medium">Published:</span>{" "}
                  {book.published_year}
                </p>
                <p>
                  <span className="font-medium">Available Copies:</span>{" "}
                  {book.available_copies}
                </p>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  className="action-button"
                  onClick={() => {
                    setSelectedBook(book);
                    setShowModal(true);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  className="action-button"
                  onClick={() => {
                    setEditBookIndex(index);
                    setEditBook(book);
                    setShowEditModal(true);
                  }}
                >
                  <SquarePen className="h-4 w-4" />
                </button>
                <button
                  className="action-button"
                  onClick={() => handleDeleteClick(book)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showModal && selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-950">
                {selectedBook.title}
              </h2>

              <button
                className="text-gray-600 hover:text-red-500"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>

            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-medium">Author:</span>{" "}
                {selectedBook.author}
              </p>
              <p>
                <span className="font-medium">Genre:</span>{" "}
                {selectedBook.genre_id}
              </p>
              <p>
                <span className="font-medium">published_year:</span>{" "}
                {selectedBook.published_year}
              </p>
              <p>
                <span className="font-medium">Available Copies:</span>{" "}
                {selectedBook.available_copies}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                {selectedBook.status}
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
                onClick={() => {
                  const cleanedBook = {
                    ...newBook,
                    published_year: parseInt(newBook.published_year),
                    available_copies: parseInt(newBook.available_copies),
                    status:
                      parseInt(newBook.available_copies) > 0
                        ? "Available"
                        : "Out of Stock",
                  };

                  setBooks((prevBooks) => [...prevBooks, cleanedBook]);
                  setShowAddModal(false);
                  setNewBook({
                    title: "",
                    author: "",
                    published_year: "",
                    available_copies: "",
                    genre_id: "",
                  });
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-950">
                Add New Book
              </h2>
              <button
                className="text-gray-600 hover:text-red-500"
                onClick={() => setShowAddModal(false)}
              >
                &times;
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Enter the details for the new book.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-1 py-2 mt-1"
                  value={newBook.title}
                  onChange={(e) =>
                    setNewBook({ ...newBook, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Author
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-1 py-2 mt-1"
                  value={newBook.author}
                  onChange={(e) =>
                    setNewBook({ ...newBook, author: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Published year
                </label>
                <input
                  type="number"
                  className="w-full border rounded px-1 py-2 mt-1"
                  value={newBook.published_year}
                  onChange={(e) =>
                    setNewBook({ ...newBook, published_year: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Available Copies
                </label>
                <input
                  type="number"
                  className="w-full border rounded px-1 py-2 mt-1"
                  value={newBook.available_copies}
                  onChange={(e) =>
                    setNewBook({ ...newBook, available_copies: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Genre
                </label>
                <select
                  className="w-full border rounded px-1 py-2 mt-1"
                  value={newBook.genre_id}
                  onChange={(e) =>
                    setNewBook({ ...newBook, genre_id: e.target.value })
                  }
                >
                  <option value="">Select Genre</option>
                  <option value="2">Fiction</option>
                  <option value="4">Adventure</option>
                  <option value="5">Romance</option>
                  <option value="7">Fantasy</option>
                  <option value="9">Biography</option>
                </select>
              </div>
            </div>
            {err && (
              <p className="text-red-600 text-sm mt-2 text-center">{err}</p>
            )}
            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-gray-950 text-white rounded"
                onClick={submitBook}
              >
                Create Book
              </button>
            </div>
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-950">Edit Book</h2>
              <button
                className="text-gray-600 hover:text-red-500"
                onClick={() => setShowEditModal(false)}
              >
                &times;
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Update the book details.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-1 py-2 mt-1"
                  value={editBook.title}
                  onChange={(e) =>
                    setEditBook({ ...editBook, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Author
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-1 py-2 mt-1"
                  value={editBook.author}
                  onChange={(e) =>
                    setEditBook({ ...editBook, author: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Published Year
                </label>
                <input
                  type="number"
                  className="w-full border rounded px-1 py-2 mt-1"
                  value={editBook.published_year}
                  onChange={(e) =>
                    setEditBook({ ...editBook, published_year: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Available Copies
                </label>
                <input
                  type="number"
                  className="w-full border rounded px-1 py-2 mt-1"
                  value={editBook.available_copies}
                  onChange={(e) =>
                    setEditBook({
                      ...editBook,
                      available_copies: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Genre
                </label>
                <select
                  className="w-full border rounded px-3 py-2 mt-1"
                  value={editBook.genre_id}
                  onChange={(e) =>
                    setEditBook({ ...editBook, genre_id: e.target.value })
                  }
                >
                  <option value="">Select Genre</option>
                  <option value="2">Fiction</option>
                  <option value="4">Adventure</option>
                  <option value="5">Romance</option>
                  <option value="7">Fantasy</option>
                  <option value="9">Biography</option>
                </select>
              </div>
            </div>
            {err && (
              <p className="text-red-600 text-sm mt-2 text-center">{err}</p>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-gray-950 text-white rounded"
                onClick={handelEditBook}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete{" "}
              <strong>{bookToDelete?.title}</strong>?
            </p>

            {err && (
              <p className="text-red-600 text-sm mb-3 text-center">{err}</p>
            )}

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
                onClick={() => {
                  setShowDeleteModal(false);
                  setBookToDelete(null);
                  setErr("");
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={confirmDeleteBook}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
