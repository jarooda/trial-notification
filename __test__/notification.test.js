const app = require('../index')
const request = require('supertest')
const callbackUrlExpect200 = 'https://webhook.site/97950da8-797b-47d1-8510-ff6591aa6bb8'
const callbackUrlExpect404 = 'https://webhook.site/97950da8-797b-47d1-8510-ff6591aa6bb81'
const callbackUrlExpect401 = 'https://jarooda-kanban-db.herokuapp.com/'

describe('Send a Notification', () => {
  test('Error because callback URL is typo or wrong', (done) => {
    request(app)
      .post(`/notification?callbackURL=${callbackUrlExpect404}`)
      .send({
        payment_id: "123123123",
        payment_code: "XYZ123",
        amount: 50000,
        paid_at: "2013-10-17 07:41:33.866Z",
        external_id: "order-123",
        customer_id: "customer-123"
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) throw done(err)
        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('error', `Callback URL not Found`)
        done()
      })
  })

  test('Error because callback URL give status response beside 200', (done) => {
    request(app)
      .post(`/notification?callbackURL=${callbackUrlExpect401}`)
      .send({
        payment_id: "123123123",
        payment_code: "XYZ123",
        amount: 50000,
        paid_at: "2013-10-17 07:41:33.866Z",
        external_id: "order-123",
        customer_id: "customer-123"
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) throw done(err)
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('error', `There is an error with Callback URL`)
        done()
      })
  })

  test('Success', (done) => {
    request(app)
      .post(`/notification?callbackURL=${callbackUrlExpect200}`)
      .send({
        payment_id: "123123123",
        payment_code: "XYZ123",
        amount: 50000,
        paid_at: "2013-10-17 07:41:33.866Z",
        external_id: "order-123",
        customer_id: "customer-123"
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) throw done(err)
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('message', `Notification Delivered`)
        done()
      })
  })
})