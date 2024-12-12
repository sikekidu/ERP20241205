module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('project_requirements', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      project_name: {
        type: Sequelize.STRING
      },
      requirement_description: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.STRING
      },
      col_1_1: {
        type: Sequelize.DATE
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('project_requirements');
  }
};
