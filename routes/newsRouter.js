const express = require('express');
const { getAllNews, addNews, updateNews, deleteNews } = require('../controllers/newsControllers');
const router = express.Router();
const checkLogin = require('../middlewares/checkLogin');
const { getNewsById } = require('../controllers/newsControllers');
const {createNews} = require('../controllers/newsControllers');




router.get('/', getAllNews);


//private routes

router.post('/add',checkLogin, addNews);
router.put('/update', checkLogin, updateNews);
router.delete('/delete', checkLogin, deleteNews);
router.get('/:id', getNewsById);
router.post('/', createNews);




module.exports = router;