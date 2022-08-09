const { Model, DataTypes } = require('sequelize'); //import Model class and DataTypes from Sequelize
const sequelize = require('../config/connection');

//create our User model
//User inherits all functionality the Model class has
class User extends Model{}

//.init method to initialize model's data and configuration, passing in 2 objects as arguments
//define table columns and configuration
User.init(
    {
        //id INTEGER NOT NULL PRIMARY KEY AUTO INCREMENT
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        //username STRING NOT NULL
        username:{
            type: DataTypes.STRING,
            allowNull: false
        },
        //email STRING NOT NULL UNIQUE VALIDATE EMAIL
        email:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        //password STRING NOT NULL UNIQUE VALIDATE PASSWORD
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                //password must be at least 4 characters long
                len: [4]
            }
        }
    },
    {
        //table configuration options go here (https://sequelize.org/v5/manual/models-definition.html#configuration))

        //pass in our imported sequelize connection (direct connection to our database)
        sequelize,

        //don't automatically create createdAt/updatedAt timestamp fields
        timestamps: false,

        //don't pluralize name of database table
        freezeTableName: true,

        //use underscores instead of camel-casing (i.e. 'comment_text' and not 'commentText;)
        underscored: true,

        //make it so our model name stays lowercase in the database
        modelName: 'user'

    }
);

module.exports = User;