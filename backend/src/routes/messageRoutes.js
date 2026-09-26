const express = require('express');
const router = express.Router();
const {
  createMessage,
  getMessages,
  getMessage,
  markAsRead,
  deleteMessage
} = require('../controllers/messageController');

const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authoriz');
const { PERMISSIONS } = require('../seeds/constants');

// Public route to send a message
router.post('/', createMessage);

// Admin-only routes to manage messages
router.use(protect);
router.use(authorize(PERMISSIONS.VIEW_DASHBOARD));

router.route('/')
  .get(getMessages);

router.route('/:id')
  .get(getMessage)
  .delete(deleteMessage);

router.route('/:id/read')
  .put(markAsRead);

module.exports = router;
