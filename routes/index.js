const routes = require('express').Router()
const notificationRoute = require('./notification')

routes.use(notificationRoute)

module.exports = routes