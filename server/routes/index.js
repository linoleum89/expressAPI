const express = require('express');
const router = express.Router();
const models = require('../models/index');
const Promise = require('bluebird');
const { coroutine } = Promise;

router.get('/users', (req, res) => {
    // return coroutine(function* () {
    //     const users = yield models.User.findAll({});
    //     if (users) {
    //         users.map((user) => {
    //             const city = yield models.City.findOne({
    //                 where: { id: user.cityId },
    //                 attributes: ['city', 'state']
    //             });

    //             return {
    //                 id: user.id,
    //                 first_name: user.first_name,
    //                 last_name: user.last_name,
    //                 city: city.city,
    //                 state: city.state
    //             };
    //         });
    //         res.json(users);
    //     } else {
    //         res.sendStatus(404);
    //     }
    // })();


    return coroutine(function* () {
        return yield models.User.findAll({});
    })().map((user) => {
        return coroutine(function* () {
            const city = yield models.City.findOne({
                where: { id: user.cityId },
                attributes: ['city', 'state']
            });
            return {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                city: city.city,
                state: city.state
            };
        })();
    }).then((results) => {
        res.json(results);
    });
});


router.post('/users', (req, res) => {
    return coroutine(function* () {

        if (req.body) {
            req.body.city = req.body.city.replace(/\b\w/g, l => l.toUpperCase()); //Chihuahua
            req.body.state = req.body.state.toUpperCase(); //CUU
        }

        const city = yield models.City.findOne({
            where: {city: req.body.city, state: req.body.state},
            attributes: ['id']
        });

        if (!city && !city.id) { 
            res.sendStatus(500);
        }
        
        const user = yield models.User.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            cityId: city.id
        });

        res.json({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            city: req.body.city,
            state: req.body.state
        });
    })();
});

router.delete('/user/:id', (req, res) => {
    return coroutine(function* () {
        const user = yield models.User.destroy({
            where: {
                id: req.params.id
            }
        });

        if (user) {
            res.json(user);
        }
    })();
});

router.put('/user/:id', (req, res) => {
    return coroutine(function* () {
        const user = yield models.User.find({
            where: {
                id: req.params.id
            }
        });

        if (req.body.city && req.body.state) {
            req.body.city = req.body.city.replace(/\b\w/g, l => l.toUpperCase());
            req.body.state = req.body.state.toUpperCase();

            const city = yield models.City.findOne({
                where: { city: req.body.city, state: req.body.state },
                attributes: ['id']
            });
                
            if (city && city.id) {
                console.log('id es ', city.id);
                yield user.updateAttributes({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    cityId: city.id
                });

                res.json(user);
            } else {
                res.sendStatus(500);
            }
        } else {
            yield user.updateAttributes({
                first_name: req.body.first_name,
                last_name: req.body.last_name
            });
            res.json(user);
        }
    })();
});

router.post('/cities', function (req, res) {
    models.City.create({
        city: req.body.city,
        state: req.body.state
    }).then(function (city) {
        res.sendStatus(200);
    });
});

module.exports = router;

