const express = require('express');
const router = express.Router();
const models = require('../models/index');
const Promise = require('bluebird');

// router.get('/users', (req, res) => {
//     models.User.findAll({}).then((users) => {
//         const promises = [];
//         users.map((user) => {
//             const thePromise = new Promise((resolve) => {
//                 models.City.findOne({
//                     where: {id: user.cityId},
//                     attributes: ['city', 'state']
//                   }).then(city => {
//                         resolve({
//                             id: user.id,
//                             first_name: user.first_name,
//                             last_name: user.last_name,
//                             city: city.city,
//                             state: city.state
//                         });
//                   })
//             })
//             promises.push(thePromise);
//         });

//         Promise.all(promises).then((result) => {
//             res.json(result);
//         });
//     });
// });

router.get('/users', (req, res) => {
    Promise.coroutine(function* () {
        return yield models.User.findAll({});
    })().map((user) => {
        return Promise.coroutine(function* () {
            const city = yield models.City.findOne({
                where: {id: user.cityId},
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

    if (req.body) {
        req.body.city = req.body.city.replace(/\b\w/g, l => l.toUpperCase());
        req.body.state = req.body.state.toUpperCase();
    }

    // const City = Promise.coroutine(function* () {
    //     const result = yield models.City.findOne({
    //         where: {city: req.body.city, state: req.body.state},
    //         attributes: ['id']
    //     });
    //     return result;
    // });

    // console.log(City());
    // res.sendStatus(200);

    models.City.findOne({
        where: {city: req.body.city, state: req.body.state},
        attributes: ['id']
    }).then((city) => {
        if (city && city.id) {
            console.log('id es ', city.id);
            models.User.create({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                cityId: city.id
            }).then((user) => {
                res.json(user);    
            });
        } else {
            res.sendStatus(500);
        }
    });

    // models.User.create({
    //     first_name: req.body.first_name,
    //     last_name: req.body.last_name,
    //     cityId: req.body.cityId
    // }).then(function (user) {
    //     res.send(200);
    // });
});

router.delete('/user/:id', (req, res) => {
    models.User.destroy({
        where: {
          id: req.params.id
        }
      }).then((user) => {
        res.json(user);
      });
});

router.put('/user/:id', (req, res) => {
    console.log(req);
    models.User.find({
        where: {
            id: req.params.id
        }
    }).then((user) => {
        if(user){
        user.updateAttributes({
            //title: req.body.title,
            //complete: req.body.complete
        }).then((user) => {
            res.send(user);
        });
        }
    });
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

