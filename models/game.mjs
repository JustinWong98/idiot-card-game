export default function initGameModel(sequelize, DataTypes) {
  return sequelize.define('game', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
     noOfPlayers: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      gameState: {
        type: DataTypes.JSON,
      },
      gamePhase: {
        type: DataTypes.STRING,
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        }
      },
      player2Id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        }
      },
      player3Id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        }
      },
      player4Id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        }
      },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  }, {
    // The underscored option makes Sequelize reference snake_case names in the DB.
    underscored: true
  });
};