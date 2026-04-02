import Menu from "../models/Menu.js";
import { logger } from "../utils/logger.js";

export const getAllMenus = async (filters = {}) => {
  const query = { ...filters };
  if (filters.category) query.category = filters.category;
  if (filters.isAvailable !== undefined)
    query.isAvailable = filters.isAvailable;

  const menus = await Menu.find(query).sort({ category: 1, name: 1 }).lean(); // Fast read-only
  return menus;
};

export const getMenuById = async (id) => {
  const menu = await Menu.findById(id).lean();
  if (!menu) throw new Error(`Menu not found with id ${id}`);
  return menu;
};

export const createMenu = async (menuData) => {
  const menu = await Menu.create(menuData);
  logger.info(`Menu created: ${menu._id}`);
  return menu;
};

export const updateMenu = async (id, updateData) => {
  const menu = await Menu.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true },
  ).lean();
  if (!menu) throw new Error(`Menu not found with id ${id}`);
  logger.info(`Menu updated: ${id}`);
  return menu;
};

export const deleteMenu = async (id) => {
  const menu = await Menu.findByIdAndDelete(id);
  if (!menu) throw new Error(`Menu not found with id ${id}`);
  logger.info(`Menu deleted: ${id}`);
  return { success: true, message: "Menu deleted successfully" };
};
