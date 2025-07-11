import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000";

axios.interceptors.request.use(
  function (req) {
    req.headers["Content-Type"] = "application/json";
    req.withCredentials = true;
    return req;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    const status = response.status;
    return response;
  },
  function (error) {
    const status = error.response?.status;

    return Promise.reject(error);
  }
);

export async function loginUser(credentials) {
  try {
    const response = await axios.post("/auth/login", credentials);
    return response;
  } catch (error) {
    return null;
  }
}
export async function allbooks(token) {
  try {
    const response = await axios.get("/books", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching books:", error);
    return null;
  }
}
export async function allmembers(token) {
  try {
    const response = await axios.get("/members", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching books:", error);
    return null;
  }
}
export async function allborrows(token) {
  try {
    const response = await axios.get("/borrow-records", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching books:", error);
    return null;
  }
}
export async function addBook(credentials, token) {
  try {
    const response = await axios.post("/books", credentials, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Success response:", response);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      return error.response.data;
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    return null;
  }
}
export async function editBooks(bookId, updatedData, token) {
  try {
    const response = await axios.patch(`/books/${bookId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Update success:", response.data);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      return error.response.data;
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    return null;
  }
}
export async function deleteBooks(bookId, token) {
  try {
    const response = await axios.delete(`/books/${bookId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}
export async function allborrowsReturn(token) {
  try {
    const response = await axios.get("/borrow-records", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching books:", error);
    return null;
  }
}

export async function BorrowSubmit(credentials, token) {
  try {
    const response = await axios.post("/borrow-records/borrow", credentials, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Success response:", response);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      return error.response.data;
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    return null;
  }
}
export async function ReturnBorrowedBook(credentials, token) {
  try {
    const response = await axios.post(
      "/borrow-records/return",
      { borrow_record_id: Number(credentials) },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      return error.response.data;
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    return null;
  }
}

export async function editMembers(id, newMember, token) {
  console.log(id, newMember);

  try {
    const response = await axios.patch(`/members/${id}`, newMember, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Update success:", response.data);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      return error.response.data;
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    return null;
  }
}
export async function addMembers(credentials, token) {
  try {
    const response = await axios.post("/members", credentials, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Success response:", response);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      return error.response.data;
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    return null;
  }
}

export async function deleteMembers(id, token) {
  try {
    const response = await axios.delete(`/members/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function apiAddStaff(credentials, token) {
  try {
    const response = await axios.post("/staff", credentials, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Success response:", response);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      return error.response.data;
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    return null;
  }
}

export async function overdue(token) {
  try {
    const response = await axios.get("/borrow-records/reports/overdue", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching books:", error);
    return null;
  }
}

export async function popularGenres(token) {
  try {
    const response = await axios.get("/borrow-records/reports/popular-genres", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching books:", error);
    return null;
  }
}

export async function totalBorrows(token) {
  try {
    const response = await axios.get("/borrow-records/reports/summary", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching books:", error);
    return null;
  }
}
export async function addGenre(credentials, token) {
  try {
    const response = await axios.post("/genres", credentials, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Success response:", response);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      return error.response.data;
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    return null;
  }
}
export async function gestGenre(token) {
  try {
    const response = await axios.get("/genres", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Success response:", response);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      return error.response.data;
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    return null;
  }
}

export async function updateGenre(id, data, token) {
  try {
    const response = await axios.patch(`/genres/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Update success:", response.data);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      return error.response.data;
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    return null;
  }
}
export async function deleteGenreById(id, token) {
  console.log(id);

  try {
    const response = await axios.delete(`/genres/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function getProfile(token) {
  try {
    const response = await axios.get("/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching books:", error);
    return null;
  }
}
export async function SignupAPI(credentials, token = null) {
  try {
    const response = await axios.post("/auth/signup", credentials, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return null;
  }
}
