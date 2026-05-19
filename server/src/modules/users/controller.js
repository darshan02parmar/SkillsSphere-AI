import User from "../../database/models/User.js";
import AppError from "../../utils/AppError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import fs from "fs";
import path from "path";
import { buildAvatarFileUrl } from "../../utils/uploadPaths.js";

/**
 * @desc    Update user profile details
 * @route   PUT /api/users/me
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  if (!name || name.trim().length < 2) {
    return next(new AppError("Please provide a valid name (at least 2 characters)", 400));
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { name: name.trim() },
    { new: true, runValidators: true }
  ).select("-password -__v");

  if (!updatedUser) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: updatedUser,
  });
});

/**
 * @desc    Upload / replace profile photo
 * @route   PUT /api/users/me/avatar
 * @access  Private
 */
export const uploadAvatar = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("No image file provided", 400));
  }

  // Delete the old avatar from disk if it was a local upload
  const currentUser = await User.findById(req.user._id);
  if (
    currentUser?.profilePic &&
    (currentUser.profilePic.includes("/uploads/avatars/") ||
      currentUser.profilePic.includes("/api/files/avatars/"))
  ) {
    const oldFilename = path.basename(currentUser.profilePic.split("?")[0]);
    const oldPath = path.join(process.cwd(), "src", "uploads", "avatars", oldFilename);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
  const profilePic = `${baseUrl}${buildAvatarFileUrl(req.file.filename)}`;

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { profilePic },
    { new: true }
  ).select("-password -__v");

  if (!updatedUser) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Profile photo updated",
    user: updatedUser,
  });
});

/**
 * @desc    Remove profile photo
 * @route   DELETE /api/users/me/avatar
 * @access  Private
 */
export const removeAvatar = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) return next(new AppError("User not found", 404));

  // Delete file from disk if it's a local upload
  if (
    user.profilePic &&
    (user.profilePic.includes("/uploads/avatars/") ||
      user.profilePic.includes("/api/files/avatars/"))
  ) {
    const filename = path.basename(user.profilePic);
    const filePath = path.join(process.cwd(), "src", "uploads", "avatars", filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  user.profilePic = null;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile photo removed",
    user: { ...user.toObject(), password: undefined, __v: undefined },
  });
});

/**
 * @desc    Delete user account completely
 * @route   DELETE /api/users/me
 * @access  Private
 */
export const deleteProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  await User.findByIdAndDelete(req.user._id);

  res.status(200).json({
    success: true,
    message: "Account deleted successfully",
  });
});