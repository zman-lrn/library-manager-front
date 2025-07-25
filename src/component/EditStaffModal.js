const EditStaffModal = ({ staff, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    username: staff.username,
    email: staff.email,
    phone: staff.phone,
    role: staff.role,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(staff.id, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-950">Edit Staff</h2>
          <button
            className="text-gray-600 hover:text-red-500 text-2xl"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <label className="block font-medium mb-1">Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-1 py-2"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-1 py-2"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-1 py-2"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Role:</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="admin">Admin</option>
              <option value="librarian">Librarian</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            className="px-4 py-2 bg-gray-950 text-white rounded"
            onClick={handleSubmit}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
