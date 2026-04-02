import {
  getAllMenus,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
} from "../services/menuService.js";

export const getMenus = async (req, res, next) => {
  try {
    const { category, available } = req.query;
    const filters = {
      ...(category && { category }),
      ...(available !== undefined && { isAvailable: available === "true" }),
    };
    const menus = await getAllMenus(filters);
    res.status(200).json({
      success: true,
      count: menus.length,
      data: menus,
    });
  } catch (error) {
    next(error);
  }
};

export const getMenu = async (req, res, next) => {
  try {
    const menu = await getMenuById(req.params.id);
    res.status(200).json({
      success: true,
      data: menu,
    });
  } catch (error) {
    next(error);
  }
};

export const addMenu = async (req, res, next) => {
  try {
    const menu = await createMenu(req.body);
    res.status(201).json({
      success: true,
      data: menu,
    });
  } catch (error) {
    next(error);
  }
};

export const editMenu = async (req, res, next) => {
  try {
    const menu = await updateMenu(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: menu,
    });
  } catch (error) {
    next(error);
  }
};

export const removeMenu = async (req, res, next) => {
  try {
    await deleteMenu(req.params.id);
    res.status(200).json({
      success: true,
      message: "Menu deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
