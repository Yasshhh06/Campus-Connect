const express = require('express');
const router = express.Router();
const { createItem, getItems, getItemById, getMyItems, claimItem, deleteItem } = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.single('image'), createItem);
router.get('/', getItems);
router.get('/user/me', protect, getMyItems);
router.get('/:id', getItemById);
router.put('/:id/claim', protect, claimItem);
router.delete('/:id', protect, deleteItem);

module.exports = router;
