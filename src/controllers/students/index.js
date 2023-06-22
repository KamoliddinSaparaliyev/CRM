const express = require("express");
const { Students } = require("../../../models");
const { NotFoundError, UnauthorizedError } = require("../../shared/error");
const { not } = require("joi");

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
const getStudents = async (req, res, next) => {
  try {
    const {
      q,
      offset = 0,
      limit = 5,
      sort_by = "id",
      sort_order = "desc",
    } = req.query;

    const query = {
      attributes: ["id", "first_name", "last_name"],
      where: {},
      order: [[sort_by, sort_order]],
      offset: Number(offset),
      limit: Number(limit),
    };

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
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
const showStudents = async (req, res, next) => {
  try {
    const { id } = req.params;
    const stuff = await Students.findOne({
      where: { id },
      attributes: ["id", "first_name", "last_name"],
    });

    if (!stuff) {
      throw new NotFoundError("Student topiladi");
    }

    res.status(200).json({
      stuff,
    });
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
const patchStudent = async (req, res, next) => {
  try {
    const { ...changes } = req.body;
    const { id } = req.params;

    const existing = await Students.findOne({ where: { id } });

    if (!existing) {
      throw new NotFoundError("Student topiladi");
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
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await Students.findOne({ where: { id } });

    if (!existing) {
      throw new NotFoundError("Student topiladi");
    }

    const deleted = await Stuff.destroy({ where: { id } });

    res.status(200).json({
      deleted: deleted,
    });
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
const postStudent = async (req, res, next) => {
  const { first_name, last_name } = req.body;
  try {
    const result = await Students.create({
      first_name,
      last_name,
    });

    res.status(201).json({
      user: result,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getStudents,
  showStudents,
  patchStudent,
  deleteStudent,
  postStudent,
};
