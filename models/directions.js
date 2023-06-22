module.exports = (sequelize, DataTypes) => {
  const Directions = sequelize.define(
    "Directions",
    {
      name: { allowNull: false, type: DataTypes.STRING },
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
      modelName: "Directions",
    }
  );
  Directions.associate = (models) => {
    Directions.hasMany(models.Groups, {
      foreignKey: "direction_id",
      targetKey: "id",
    });
    Directions.hasMany(models.Groups, {
      foreignKey: "assistent_teacher_id",
      targetKey: "id",
    });
  };

  return Directions;
};
