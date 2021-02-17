const axios = require('axios')
const { Notification } = require('../models')

class NotificationController {

  static async sendCallbackURL (url, payload) {
    try {
      const response = await axios.post(url, payload)
      return response.status

    } catch (error) {
      return error.response?.status
    }

  }

  static async sendNotification (req, res, next) {
    const { callbackURL } = req.query
    const { payment_id, payment_code, amount, paid_at, external_id, customer_id } = req.body
    const payload = {
      payment_id,
      payment_code,
      amount,
      paid_at,
      external_id,
      customer_id
    }

    try {
      const response = await NotificationController.sendCallbackURL(callbackURL, payload)
      const status = response === 200 ? "Success" : "Failed"

      await Notification.create({
        payment_id,
        status
      })
      
      if (status === "Success") {
        res.status(200).json({message: "Notification Delivered"})
      } else {
        if (response === 404) {
          throw {
            status: 404,
            message: "Callback URL not Found"
          }
        } else {
          throw {
            status: 400,
            message: "There is an error with Callback URL"
          }
        }
      }

    } catch (error) {
      next(error)
    }
  }
}

module.exports = NotificationController