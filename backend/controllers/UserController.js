import User from "../models/UserModel.js";

// Ambil semua catatan milik user yang sedang login
export const getUsers = async (req, res) => {
  try {
    const response = await User.findAll({
      where: {
        userId: req.userId, // Hanya ambil milik user login
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Ambil satu catatan berdasarkan ID dan pastikan milik user login
export const getUserById = async (req, res) => {
  try {
    const response = await User.findOne({
      where: {
        id: req.params.id,
        userId: req.userId, // Pastikan data milik user login
      },
    });

    if (!response) {
      return res.status(404).json({ msg: "Note not found or unauthorized" });
    }

    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Tambahkan catatan baru dengan userId dari token
export const createUser = async (req, res) => {
  try {
    const { name, title, isi_notes } = req.body;

    if (!name || !title || !isi_notes) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    await User.create({
      name,
      title,
      isi_notes,
      userId: req.userId, // Ambil dari token
    });

    res.status(201).json({ msg: "User Created" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Update catatan milik user yang sedang login
export const updateUser = async (req, res) => {
  try {
    const { name, title, isi_notes } = req.body;

    const user = await User.findOne({
      where: {
        id: req.params.id,
        userId: req.userId, // Pastikan hanya bisa update miliknya sendiri
      },
    });

    if (!user) {
      return res.status(404).json({ msg: "Note not found or unauthorized" });
    }

    user.name = name || user.name;
    user.title = title || user.title;
    user.isi_notes = isi_notes || user.isi_notes;

    await user.save();
    res.status(200).json({ msg: "User Updated" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Hapus catatan milik user yang sedang login
export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: {
        id: req.params.id,
        userId: req.userId, // Pastikan hanya bisa hapus miliknya sendiri
      },
    });

    if (!deleted) {
      return res.status(404).json({ msg: "Note not found or unauthorized" });
    }

    res.status(200).json({ msg: "User Deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
