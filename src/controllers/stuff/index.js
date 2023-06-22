const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../../shared/config");
const { Stuff } = require("../../../models");
const { NotFoundError, UnauthorizedError } = require("../../shared/error");

/**
 * Post stuff
 * 1. Yangi stuff qo'shishni faqat admin va super_admin qila olishi kerak
 * @param {express.Request} req
 * @param {express.Response} res
 */
const postStuff = async (req, res, next) => {
  const { first_name, last_name, role, username, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await Stuff.create({
      first_name,
      last_name,
      role,
      username,
      password: hashedPassword,
    });

    res.status(201).json({
      user: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get list of stuff
 * 1. Login qilgan hamma xodimlar ko'ra olishi mumkin
 * @param {express.Request} req
 * @param {express.Response} res
 */
const getStuff = async (req, res, next) => {
  try {
    const {
      role,
      q,
      offset = 0,
      limit = 5,
      sort_by = "id",
      sort_order = "desc",
    } = req.query;

    const query = {
      attributes: ["id", "first_name", "last_name", "role", "username"],
      where: {},
      order: [[sort_by, sort_order]],
      offset: Number(offset),
      limit: Number(limit),
    };

    if (role) {
      query.where.role = role;
    }

    if (q) {
      query.where[Op.or] = [
        {
          first_name: {
            [Op.iLike]: `%${q}`,
          },
        },
        {
          last_name: {
            [Op.iLike]: `%${q}`,
          },
        },
      ];
    }

    const { rows, count } = await Stuff.findAndCountAll(query);

    res.status(200).json({
      stuff: rows,
      pageInfo: {
        total: count,
        offset,
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single stuff
 * 1. Login qilgan hamma xodimlar ko'ra olishi mumkin
 * @param {express.Request} req
 * @param {express.Response} res
 */
const showStuff = async (req, res, next) => {
  try {
    const { id } = req.params;
    const stuff = await Stuff.findOne({
      where: { id },
      attributes: ["id", "first_name", "last_name", "role", "username"],
    });

    if (!stuff) {
      throw new NotFoundError("Xodim topilmadi");
    }

    res.status(200).json({
      stuff,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login stuff
 * Xodim tizimga kirish uchun login qilishi mumkin
 * @param {express.Request} req
 * @param {express.Response} res
 */
const loginStuff = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const existing = await Stuff.findOne({
      where: { username },
    });
    if (!existing) {
      throw new UnauthorizedError();
    }

    // const match = await bcrypt.compare(password, existing.password);

    // if (!match) {
    //   return res.status(401).json({
    //     error: 'Username yoki password xato.',
    //   });
    // }

    const token = jwt.sign(
      { id: existing.id, role: existing.role },
      config.jwt.secret,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update stuff
 * 1. Faqat super_admin va admin boshqa xodimlarni ma'lumotlarini tahrirlay oladi
 * @param {express.Request} req
 * @param {express.Response} res
 */
const patchStuff = async (req, res, next) => {
  try {
    const { ...changes } = req.body;
    const { id } = req.params;

    const existing = await Stuff.findOne({ where: { id } });

    if (!existing) {
      throw new NotFoundError("Xodim topilmadi");
    }

    if (changes.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(changes.password, salt);
      changes.password = hashedPassword;
    }

    const update = await Stuff.update(
      { ...changes },
      {
        where: { id },
      }
    );

    res.status(200).json({
      updated: update,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete stuff
 * 1. Faqat super_admin va admin boshqa xodimlarni o'chira oladi
 * @param {express.Request} req
 * @param {express.Response} res
 */
const deleteStuff = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await Stuff.findOne({ where: { id } });

    if (!existing) {
      throw new NotFoundError("Xodim topilmadi");
    }

    const deleted = await Stuff.destroy({ where: { id } });

    res.status(200).json({
      deleted: deleted,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postStuff,
  getStuff,
  showStuff,
  loginStuff,
  patchStuff,
  deleteStuff,
};
