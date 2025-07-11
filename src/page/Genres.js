import React, { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import GenreAddModal from "../component/GenreAddModal";
import GenreModal from "../component/GenreAddModal";
import GenreDeleteModal from "../component/GenreDeleteModal";
import { gestGenre, deleteGenreById } from "../axios/axios";

export default function Genres() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [genres, setGenres] = useState([]);
  const [genre, setGenre] = useState([]);
  const filteredGenres = genre.filter((genre) =>
    genre.name.toLowerCase().includes(search.toLowerCase())
  );
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
    const fetchGeners = async () => {
      const data = await gestGenre(token);
      setGenre(data.data);
    };
    fetchGeners();
  }, []);
  console.log(genre);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);

  const handleEdit = (genre) => {
    setSelectedGenre(genre);
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    console.log(selectedGenre);

    await deleteGenreById(selectedGenre.id, token);
    setGenres((prev) => prev.filter((g) => g.id !== selectedGenre.id));
    setShowDeleteModal(false);
    setSelectedGenre(null);
  };
  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Genres</h1>
            <p className="text-gray-600">Manage book genres (Admin Only)</p>
          </div>
          <button
            className="inline-flex items-center justify-center gap-2  rounded-md text-sm font-medium bg-gray-950 text-gray-100 h-10 px-4 py-2"
            onClick={() => setShowModal(true)}
          >
            <Plus className="h-4 w-4" />
            Add Genre
          </button>
        </div>
        <GenreAddModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={(newGenre) => setGenre((prev) => [...prev, newGenre])}
        />
        <div className="relative">
          <Search className="absolute left-3 top-5 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base pl-10 "
            placeholder="Search genres..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredGenres.map((genre) => (
            <div
              key={genre.id}
              className="rounded-lg border bg-card shadow-lg hover:shadow-md "
            >
              <div className="flex flex-col space-y-1.5 p-6 pb-3">
                <div className="flex justify-between items-center">
                  <div className="font-semibold tracking-tight text-lg text-gray-950">
                    {genre.name}
                  </div>
                  <div className="flex space-x-1">
                    <button onClick={() => handleEdit(genre)} className="...">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedGenre(genre);
                        setShowDeleteModal(true);
                      }}
                      className="..."
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-0">
                <div className="text-sm text-gray-700">
                  Genre ID: {genre.id}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <GenreModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={(updated) => {
          setGenres((prev) =>
            prev.map((g) => (g.id === updated.id ? updated : g))
          );
        }}
        editData={selectedGenre}
      />

      <GenreDeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        genre={selectedGenre}
      />
    </main>
  );
}
