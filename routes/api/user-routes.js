const router = require('express').Router();
const { User } = require('../../models');

// GET /api/users
router.get('/', (req, res) => {
    //SELECT * FROM users 
    User.findAll({
        attributes:{ exclude: ['password']} //don't return password
    }) 
    .then(dbUserData => res.json(dbUserData)) //then turn data into JSON {}
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET /api/users/1
router.get('/:id', (req, res) => {
    User.findOne({ //SELECT * FROM users WHERE id = ?
        where: {
            id: req.params.id // ? = get from link 
        },
        attributes:{
            exclude: ['password']
        }
    })
    .then(dbUserData => {
        if (!dbUserData){
            res.status(404).json({ message: 'No user found with this id '});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// POST /api/users
router.post('/', (req, res) => {
    //INSERT INTO users (username, email, password) VALUES (?,?,?)
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/login', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        if (!dbUserData){
            res.status(400).json({ message: "No user with that email address! "});
            return;
        }

        const validPassword = dbUserData.checkPassword(req.body.password)

        if(!validPassword){
            res.status(400).json({ message: 'Incorrect password '});
            return;
        }

        res.json({ user: dbUserData, message: 'You are now logged in!'});

    });
});

// PUT /api/users/1
router.put('/:id', (req, res) => {
    //UPDATE users SET username=?, email=?, password=? WHERE id = 1 

    //req.body - PUT request containing new data for the update
    //req.params.id = where we want new data to be used

    User.update(req.body, { 
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData[0]){
            res.status(404).json({ message: 'No user found with this id '});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

//DELETE /api/users/1
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData){
            res.status(404).json({ message: 'No user found with this id '});
            return;
        }
        res.json(dbUserData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

module.exports = router;