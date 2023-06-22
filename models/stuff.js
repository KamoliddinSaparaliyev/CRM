module.exports = (sequelize, DataTypes) => {
  const Stuff = sequelize.define(
    "Stuff",
    {
      first_name: { type: DataTypes.STRING },
      last_name: { type: DataTypes.STRING },
      role: {
        type: DataTypes.ENUM,
        values: ["admin", "teacher", "assistent_teacher", "super_admin"],
      },
      username: { type: DataTypes.STRING(10), unique: true },
      password: { type: DataTypes.STRING(300) },
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
      modelName: "Stuff",
    }
  );
  Stuff.associate = (models) => {
    Stuff.hasMany(models.Groups, {
      foreignKey: "teacher_id",
      targetKey: "id",
      constrains: false,
    });
  };
  return Stuff;
};
