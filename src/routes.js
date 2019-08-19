
const express = require('express')
const router = express.Router()

const {
  check,
  validationResult,
} = require('express-validator/check')

const { matchedData } = require('express-validator/filter')

router.get('/', (req, res) => {
  res.render('index')
})

router.get('/contact', (req, res) => {
  res.render('contact', {
    data: {},
    errors: {}
  })
})

router.post('/contact', [
  check('message')
    .isLength({ min: 1 })
    .withMessage('Message is required')
    .trim(),
  check('email')
    .isEmail()
    .withMessage('That email doesn‘t look right')
    .trim()
    .normalizeEail()
], (req, res) => {
  const errors = validationResult(req)
  res.render('contact', {
    data: req.body, //Should this be matchedData(req) ?
    errors: errors.mapped()
  })

  const data = matchedData(req) // data is the sanitized input
  console.log('Sanitized:', data)
})

module.exports = router
