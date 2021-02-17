const express = require('express')
const bodyParser = express.json();
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')

const languageRouter = express.Router()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )
      
      res.json({
        language: req.language,
        words,
      })
      
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    try {
      const head = await LanguageService.getHead(
        req.app.get('db'),
        req.user.id
      )

      res.json(head.rows[0])
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .route('/guess')
  .post(bodyParser, async (req, res, next) => {
    const { guess } = req.body;

    if (!guess){
      return res.status(400).send(`Missing 'guess' in request body`)
    }
    res.json({ guess })
  })

module.exports = languageRouter
