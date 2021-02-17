const express = require('express')
const bodyParser = express.json();
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const { LinkedList } = require('./linked-list');

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

      res
        .status(200)
        .json(head.rows[0])

      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .route('/guess')
  .post(bodyParser, async (req, res, next) => {
    // destructure 
    const { guess } = req.body;
    
    // validate
    if (!guess){
      return res.status(400).send(`Missing 'guess' in request body`)
    }

    const getWords = async () => {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )
      
      return await words;
    }

    let getWordsResult = await getWords();
    
    const getHeadWord = await getWordsResult[0];
    let { translation } = await getHeadWord;

    console.log('getHeadWord: ', await getHeadWord)

    // build linked list
    const linkedListOfWords = new LinkedList();
    let words = await getWords();
    words.forEach( wordNode => {
      linkedListOfWords.insertLast(wordNode);
    });
    
    const updateWords = async () => {
      const allWords = await linkedListOfWords.getAll();
      await allWords.forEach(async wordNode => {
        // update words
        req.app.get('db'),
        wordNode.id,
        wordNode
      })
    }
    
    const getUpdatedNextWord = async () => {
      await updateWords();
      const newNextWord = await linkedListOfWords.head.next.value;
      return await newNextWord;
    }

    const updatedNxtWord = await getUpdatedNextWord();
    // // check guess
    console.log('guess: ', guess);
    console.log('translation: ', translation);
    console.log('getUpdatedNextWord: ', await updatedNxtWord);
   


    res.json({ guess })
    next();
  })

module.exports = languageRouter
