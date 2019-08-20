
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

  /**
  * Populating File Inputs
  * In case of validation errors, we can’t re-populate file inputs like we did for the text inputs.
  * A common approach to solving this problem involves these steps:

  * uploading the file to a temporary location on the server
  * showing a thumbnail and filename of the attached file
  * adding JavaScript to the form to allow people to remove the selected file or upload a new one
  * moving the file to a permanent location when everything is valid.
  * Because of the additional complexities of working with multipart and file uploads,
  * they’re often kept in separate forms.
  */
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
