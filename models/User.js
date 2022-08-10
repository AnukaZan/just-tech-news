const { Model, DataTypes } = require('sequelize'); //import Model class and DataTypes from Sequelize
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

//create our User model
//User inherits all functionality the Model class has
class User extends Model{
    //set up method to run on instance data (per user) to check password
    checkPassword(loginPw){
        return bcrypt.compareSync(loginPw, this.password); //(plainTextPassword, hash)
    }
}

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
        hooks: {
            //before creating the user data, hash the password 10 times and then return the new data.
           async beforeCreate(newUserData){
            newUserData.password = await bcrypt.hash(newUserData.password, 10);
            return newUserData;
           },

           async beforeUpdate(updatedUserData){
            updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
            return updatedUserData;
           }
        },

        //configuration options go here (https://sequelize.org/v5/manual/models-definition.html#configuration))

        sequelize, //pass in our imported sequelize connection (direct connection to our database)

        timestamps: false, //don't automatically create createdAt/updatedAt timestamp fields

        freezeTableName: true,  //don't pluralize name of database table

        underscored: true,  //use underscores instead of camel-casing (i.e. 'comment_text' and not 'commentText;)
       
        modelName: 'user'  //make it so our model name stays lowercase in the database

    }
);

module.exports = User;