const express = require('express');
const router = express.Router();

// MODELOS
const visitors = require('../models/visits');
const phishingCtrl = require('../controllers/phishing.controller');

// VISITAS
router.get('/', async (req, res) => {

    const visits = await visitors.updateOne( { _id: "ID" }, { $inc: { "visits": 1} })

    const counter = await visitors.findOne( { _id: "ID" }, "visits")

    res.json(counter)

});

// PETICIONES
router.get('/pwnedPhishing', phishingCtrl.pwnedPhishing);
router.get('/pwnedVector', phishingCtrl.pwnedVector);
router.get('/getPhishingUsers', phishingCtrl.getPhishingUsers);
router.get('/getVectorUsers', phishingCtrl.getVectorUsers);
router.post('/send', phishingCtrl.sendEmail);

module.exports = router;