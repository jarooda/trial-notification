const route = require('express').Router()
const { NotificationController } = require('../controllers')

route.post('/notification', NotificationController.sendNotification)

module.exports = route