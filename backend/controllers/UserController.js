import User from "../models/UserModel.js";

export const getUsers = async(req, res) => {
    try {
        const response = await User.findAll();
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Internal Server Error" });
    }
}

export const getUserById = async(req, res) => {
    try {
        const response = await User.findOne({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const createUser = async(req, res) => {
    try {
        const { name, title, isi_notes } = req.body;

        // Validasi payload
        if (!name || !title || !isi_notes) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        await User.create({ name, title, isi_notes });
        res.status(201).json({ msg: "User Created" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Internal Server Error" });
    }
}

export const updateUser = async(req, res) => {
    try {
        const { name, title, isi_notes } = req.body;

        // Cari pengguna berdasarkan ID
        const user = await User.findOne({
            where: {
                id: req.params.id,
            },
        });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Update hanya field yang diberikan
        user.name = name || user.name;
        user.title = title || user.title;
        user.isi_notes = isi_notes || user.isi_notes;

        await user.save();
        res.status(200).json({ msg: "User Updated" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Internal Server Error" });
    }
}

export const deleteUser = async(req, res) => {
    try {
        await User.destroy({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "User Deleted"});
    } catch (error) {
        console.log(error.message);
    }
}