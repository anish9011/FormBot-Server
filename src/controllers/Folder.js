const Folder = require('../models/Folder');
const Form = require('../models/Form');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const validateFolderData = async (folderId) => {
    if (!ObjectId.isValid(folderId)) {
        throw Object.assign(Error("This is not a valid folder, please check your URL"), { code: 400 });
    }

    const folderdata = await Folder.findById(folderId);
    if (!folderdata) {
        throw Object.assign(Error("This is not a valid folder, please check your URL."), { code: 404 });
    }

    return folderdata;
};



const createFolder = async (req, res, next) => {
    try {
        const userId = req.user; // Directly using req.user as userId
        const { folderName, invitedUser } = req.body;

        if (!folderName) {
            throw Object.assign(new Error("Please enter folder name."), { code: 400 });
        }

        // Create the folder with `req.user` and other details
        await Folder.create({ userId, folderName, invitedUser });

        res.status(200).json({ status: "success", msg: "Folder created successfully." });
    } catch (err) {
        next(err);
    }
};


const updateFolder = async (req, res, next) => {
    try {
        const { invitedUser } = req.body;

        if (!invitedUser) {
            return res.status(400).json({ status: "error", msg: "Invited user ID is required" });
        }

        // Assuming you want to add the invitedUser to a shared list
        const updatedFolders = await Folder.updateMany(
            { userId: req.user },  // This assumes the userId is in req.user
            { $push: { sharedWith: invitedUser } }  // Push the invitedUser to sharedWith array
        );

        if (updatedFolders.modifiedCount === 0) {
            return res.status(404).json({ status: "error", msg: "No folders updated" });
        }

        res.status(200).json({ status: "success", msg: "User invited successfully" });
    } catch (err) {
        console.error("Error in updateFolder:", err);
        next(err);
    }
};




const fetchAllFolder = async (req, res, next) => {
    try {
        const folderdata = await Folder.find({
            $or: [{ userId: req.user }, { invitedUser: req.user }],
        });

        res.status(200).json({ status: "success", data: folderdata });
    } catch (err) {
        next(err);
    }
};


const fetchAllFormByFolder = async (req, res, next) => {
    const { folderId } = req.params;
    try {
        await validateFolderData(folderId);
        const formdata = await Form.find({ folderId });
        res.status(200).json({ status: "success", data: formdata });
    } catch (err) {
        next(err);
    }
};

const deleteFolder = async (req, res, next) => {
    const { folderId } = req.params;
    try {            
        await validateFolderData(folderId);
        await Folder.findByIdAndDelete(folderId);
        await Form.deleteMany({ folderId });
        res.status(200).json({ status: "success", msg: "Folder deleted successfully." });
    } catch (err) {
        next(err);
    }
};

module.exports = { fetchAllFolder, fetchAllFormByFolder, createFolder, deleteFolder ,updateFolder};