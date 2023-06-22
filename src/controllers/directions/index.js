const express = require("express");
const { Directions } = require("../../../models");

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const getDirections = async (req, res, next) => {
  try {
    const {
      q,
      offset = 0,
      limit = 5,
      sort_by = "id",
      sort_order = "desc",
    } = req.query;

    const query = {
      attributes: ["id", "name"],
      where: {},
      order: [[sort_by, sort_order]],
      offset: Number(offset),
      limit: Number(limit),
    };

    if (q) {
      query.where = {
        name: {
          [Op.iLike]: `%${q}`,
        },
      };
    }

    const { rows, count } = await Directions.findAndCountAll(query);

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
 * @param {express.NextFunction} next
 */
const showDirection = async (req, res, next) => {
  try {
    const { id } = req.params;

    const direction = await Directions.findOne({ where: { id } });

    if (!direction) {
      return res.status(404).json({
        error: "Direction not found",
      });
    }

    res.status(200).json({
      direction,
    });
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const patchDirection = async (req, res, next) => {
  try {
    const { ...changes } = req.body;
    const { id } = req.params;

    const existing = await Directions.findOne({ where: { id } });

    if (!existing) {
      return res.status(404).json({
        error: `${id}-idli direction topilmadi`,
      });
    }

    const updated = await Directions.update({ ...changes }, { where: { id } });

    res.status(200).json({
      updated: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const deleteDirection = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await Directions.findOne({ where: { id } });

    if (!existing) {
      return res.status(404).json({
        error: `${id}-idle direction topilmadi`,
      });
    }

    const deleted = await Directions.destroy({ where: { id } });

    res.status(200).json({
      deleted: deleted,
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const postDirection = async (req, res, next) => {
  try {
    const { name } = req.body;

    const result = await Directions.create({ name });

    res.status(201).json({
      direction: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDirections,
  showDirection,
  patchDirection,
  deleteDirection,
  postDirection,
};
