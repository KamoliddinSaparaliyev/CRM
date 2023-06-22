const { Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Students = sequelize.define(
    "Students",
    {
      first_name: { allowNull: false, type: DataTypes.STRING },
      last_name: { allowNull: false, type: DataTypes.STRING },
      created_at: {
        type: "TIMESTAMP",
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      updated_at: {
        type: "TIMESTAMP",
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
    },
    {
      timestamps: false,
      sequelize,
      modelName: "Students",
    }
  );
  Students.associate = (models) => {
    Students.belongsToMany(models.Groups, {
      through: "Groups_Students",
      foreignKey: "student_id",
      type: DataTypes.INTEGER,
      timestamps: false,
    });
  };

  return Students;
};
