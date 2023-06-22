const express = require("express");
const { Groups, Groups_Students } = require("../../../models");
const { Sequelize } = require("sequelize");
const {
  NotFoundError,
  UnauthorizedError,
  BadReqqustError,
} = require("../../shared/error");

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
const postGroup = async (req, res, next) => {
  try {
    const { name, teacher_id, assistent_teacher_id, direction_id } = req.body;

    if (teacher_id) {
      const existing = await Groups.findOne({ where: { id: teacher_id } });

      if (!existing || existing.role !== "teacher") {
        throw new BadReqqustError(" not found");
      }
    }
    if (direction_id) {
      const existing = await Groups.findOne({ where: { id: direction_id } });

      if (!existing) {
        throw new BadReqqustError(" not found");
      }
    }

    if (assistent_teacher_id) {
      const existing = await Groups.findOne({
        where: { id: assistent_teacher_id },
      });

      if (!existing || existing.role !== "assistent_teacher") {
        throw new BadReqqustError(" not found");
      }
    }

    const result = await Groups.create({
      name,
      teacher_id,
      assistent_teacher_id,
      direction_id,
    });
    res.status(201).json({
      group: result,
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
const getGroups = async (req, res, next) => {
  try {
    const {
      q,
      offset = 0,
      limit = 5,
      sort_by = "id",
      sort_order = "desc",
    } = req.query;

    const query = {
      attributes: ["id", "name", "teacher_id", "assistent_teacher_id"],
      where: {},
      order: [[sort_by, sort_order]],
      offset: Number(offset),
      limit: Number(limit),
    };

    if (q) {
      query.where({
        name: {
          [Op.iLike]: `%${q}`,
        },
      });
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

const showGroup = async (req, res, next) => {
  try {
    const { id } = req.params;

    const group = await Groups.findOne({
      where: { id },
      includes: [
        {
          model: Stuff,
          as: "teacher",
          attributes: ["id", "first_name", "last_name", "role", "username"],
        },
        {
          model: Stuff,
          as: "assistent",
          attributes: ["id", "first_name", "last_name", "role", "username"],
        },
        {
          model: Direction,
          as: "direction",
          attributes: ["id", "name"],
        },
        {
          model: Students,
          as: "students",
          attributes: ["id", "first_name", "last_name"],
          through: { attributes: [] },
        },
      ],
      attributes: [
        "id",
        "name",
        [
          Sequelize.literal(`CASE
        WHEN teacher.id IS NULL THEN NULL
        ELSE json_build_object(
          'id', teacher.id,
          'first_name', teacher.first_name,
          'last_name', teacher.last_name,
          'role', teacher.role,
          'username', teacher.username)
        END as teacher`),
        ],
        [
          Sequelize.literal(`CASE
        WHEN assistent.id IS NULL THEN NULL
        ELSE json_build_object(
          'id', assistent.id,
          'first_name', assistent.first_name,
          'last_name', assistent.last_name,
          'role', assistent.role,
          'username', assistent.username)
        END as assistent`),
        ],
        [
          Sequelize.literal(`CASE
        WHEN groups.direction_id IS NULL THEN NULL
        ELSE json_build_object(
            'id', directions.id,
            'name', directions.name)
        END as direction`),
        ],
        [
          Sequelize.literal(`CASE
        WHEN Students.id IS NULL THEN '[]'
        ELSE json_agg(
          json_build_object(
            'id', students.id,
            'first_name', students.first_name,
            'last_name', students.last_name))
        END as students`),
        ],
      ],
      group: [
        "Groups.id",
        "teacher.id",
        "assistent.id",
        "students.id",
        "direction.id",
      ],
    });

    if (!group) {
      throw new NotFoundError(" not found");
    }

    res.status(201).json({
      group,
    });
  } catch (error) {
    next(error);
  }
};

const patchGroup = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await Groups.findOne({ where: { id } });

    if (!existing) {
      throw new BadReqqustError("Not found");
    }
    const updated = await Groups.update(req.body, { where: { id } });

    res.status(200).json({
      updated: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteGroup = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await Groups.fiindOne({ where: { id } });

    if (!existing) {
      throw new NotFoundError("Not found");
    }

    const deleted = await Groups.destroy({ where: { id } });

    res.status(200).json({
      deleted: deleted,
    });
  } catch (error) {
    next(error);
  }
};

const addStudent = async (req, res, next) => {
  try {
    const { id, student_id } = req.params;

    await Groups_Students.create({ group_id: id, student_id });

    res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
};

const removeStudent = async (req, res, next) => {
  try {
    const { id, student_id } = req.params;

    const existing = await Groups_Students.findOne({
      where: { group_id: id, student_id },
    });

    if (!existing) {
      throw new NotFoundError(
        `${id}-yoki ${student_id} idle group yoki student  topilmadi`
      );
    }
    res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postGroup,
  getGroups,
  showGroup,
  patchGroup,
  deleteGroup,
  addStudent,
  removeStudent,
};
