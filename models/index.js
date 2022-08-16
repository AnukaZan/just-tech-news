const User = require('./User');
const Post = require('./Post');

//id in User to link to user_id in Post 
User.hasMany(Post, {
    foreignKey: 'user_id'
});


Post.belongsTo(User, {
    foreignKey: 'user_id'
})

module.exports = { User, Post };

//importing User model and exporting an object with it as a property 