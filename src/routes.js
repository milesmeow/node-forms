
const express = require('express')
const router = express.Router()

const {
  check,
  validationResult,
} = require('express-validator/check')

const { matchedData } = require('express-validator/filter')

const multer = require('multer')
const upload = multer({
  storage: multer.memoryStorage()
})


router.get('/', (req, res) => {
  res.render('index')
})

router.get('/contact', (req, res) => {
  res.render('contact', {
    data: {},
    errors: {},
    csrfToken: req.csrfToken(), // generate a CSRF token
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
  if (!errors.isEmpty()) {
    return res.render('contact', {
      data: req.body,
      errors: errors.mapped(),
      csrfToken: req.csrfToken(), // also generate in the validation error response
    })
  }

  if (req.file) {
    console.log('Uploaded: ', req.file)
    //Homework: Upload file to S3
  }


  const data = matchedData(req)
  console.log('Sanitized: ', data)
  // Homework: send sanitized data in an email or persist in a db


  // A “flash message” is the name given to this kind of one-time-only
  // message we want to persist across a redirect and then disappear.
  // The express-flash middleware adds req.flash(type, message) which we can use in our route handlers
  // The express-flash middleware adds messages to req.locals which all views have access to
  req.flash('success', 'Thanks for the message! I‘ll be in touch :)')
  res.redirect('/')
})

module.exports = router
