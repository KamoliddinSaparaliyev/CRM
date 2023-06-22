module.exports = (sequelize, DataTypes) => {
  const Groups = sequelize.define(
    "Groups",
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
      modelName: "Groups",
    }
  );
  Groups.associate = (models) => {
    Groups.belongsTo(models.Directions, {
      foreignKey: "direction_id",
      targetKey: "id",
      constrains: false,
    });
    Groups.belongsTo(models.Stuff, {
      foreignKey: "teacher_id",
      targetKey: "id",
      constrains: false,
      onDelete: "SET NULL",
    });
    Groups.belongsTo(models.Stuff, {
      foreignKey: "assistent_teacher_id",
      targetKey: "id",
      constrains: false,
      onDelete: "SET NULL",
    });
    Groups.belongsToMany(models.Students, {
      through: "Groups_Students",
      foreignKey: "group_id",
      type: DataTypes.INTEGER,
      timestamps: false,
      onDelete: "CASCADE",
    });
  };

  return Groups;
};
