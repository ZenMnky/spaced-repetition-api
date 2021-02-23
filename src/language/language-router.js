const express = require('express');
const { requireAuth } = require('../middleware/jwt-auth');
const LanguageService = require('./language-service');
const LinkedList = require('./linked-list');


const languageRouter = express.Router();

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getLanguage(
        req.app.get('db'),
        req.user.id,
      );

      if (!language) {
        return res.status(404).json({
          error: `You don't have any languages`,
        });
      }

      req.language = language;
      next();
    } catch (error) {
      next(error);
    }
  });

languageRouter
  .route('/')
  .get(async (req, res, next) => {
    try {
      const words = await LanguageService.getWords(
        req.app.get('db'),
        req.language.id,
      );

      res.json({
        language: req.language,
        words,
      });
      next();
    } catch (error) {
      next(error);
    }
  });

languageRouter
  .route('/head')
  .get(async (req, res, next) => {
    try {
      const words = await LanguageService.getWords(
        req.app.get('db'),
        req.language.id,
      );

      const headWord = words.find((node) => node.id === req.language.head);

      res.status(200).json({
        nextWord: headWord.original,
        totalScore: req.language.total_score,
        wordCorrectCount: headWord.correct_count,
        wordIncorrectCount: headWord.incorrect_count,
      });
      next();
    } catch (error) {
      next(error);
    }
  });

languageRouter
  .route('/guess')
  .post(async (req, res, next) => {
    // validate
    if (!req.body || !req.body.guess) {
      return res
        .status(400)
        .json({ error: `Missing 'guess' in request body` });
    }

    const { body } = req;

    const getWords = async () => {
      const words = await LanguageService.getWords(
        req.app.get('db'),
        req.language.id,
      );
      return await words;
    };

    const headWordId = req.language.head;
    const words = await getWords();
    /** Example data returned from 'getWords()':
     *
     * An array with 8 objects
     * words:
     *      [
              {
                id: 4,
                language_id: 1,
                original: 'ssain',
                translation: 'signature',
                next: 5,
                memory_value: 1,
                correct_count: 2,
                incorrect_count: 2
              },
              {
                id: 5,
                language_id: 1,
                original: 'hompi',
                translation: 'homepage',
                next: 3,
                memory_value: 2,
                correct_count: 2,
                incorrect_count: 2
              },
              {
                id: 3,
                language_id: 1,
                original: 'seutaendeu',
                translation: 'desk lamp',
                next: 8,
                memory_value: 2,
                correct_count: 3,
                incorrect_count: 3
              },
              {
                id: 8,
                language_id: 1,
                original: 'seutateueob',
                translation: 'startup',
                next: 7,
                memory_value: 1,
                correct_count: 0,
                incorrect_count: 0
              },
              {
                id: 7,
                language_id: 1,
                original: 'gaebalja',
                translation: 'developer',
                next: 6,
                memory_value: 4,
                correct_count: 2,
                incorrect_count: 1
              },
              {
                id: 6,
                language_id: 1,
                original: 'geonbae',
                translation: 'cheers',
                next: 7,
                memory_value: 1,
                correct_count: 0,
                incorrect_count: 0
              },
              {
                id: 1,
                language_id: 1,
                original: 'waisyeocheu',
                translation: 'collared dress shirt',
                next: 2,
                memory_value: 2,
                correct_count: 1,
                incorrect_count: 0
              },
              {
                id: 2,
                language_id: 1,
                original: 'noteu',
                translation: 'notebook',
                next: null,
                memory_value: 8,
                correct_count: 3,
                incorrect_count: 1
              }
            ]
     */

    // search through the word objects we just got
    // find the object whose id property is equivalent to
    // the id of the head word, represented by 'headWordId'
    const headWord = {};
    await Object.assign(headWord, words.find((node) => node.id === headWordId));
    /** Example of what is stored in headWord
     * headWord:  {
            id: 4,
            language_id: 1,
            original: 'ssain',
            translation: 'signature',
            next: 5,
            memory_value: 1,
            correct_count: 2,
            incorrect_count: 4
          }
     */

    // build the linked list, populated with the words we just retrieved
    const wordsLinkedList = new LinkedList();
    words.forEach(((node) => {
      wordsLinkedList.insert(node);
    }));

    /** Example data of wordsLinkedList post build
       *  LinkedList {
            head: _Node {
              value: {
                id: 5,
                language_id: 1,
                original: 'hompi',
                translation: 'homepage',
                next: 4,
                memory_value: 2,
                correct_count: 2,
                incorrect_count: 2
              },
              next: _Node { value: [Object], next: [_Node] }
            }
          }
       */

    // HTTP PUT for each of the word nodes in the linked list
    // updates the words in the DB with w/e modifications were made to them
    // at the time the function is called
    const updateWords = async () => {
      const words = await wordsLinkedList.all();
      words.forEach(async (node) => {
        await LanguageService.updateWords(
          req.app.get('db'),
          node.id,
          node,
        );
      });
    };

    // update words in the db first with updateWords()
    // then grab the updated array of word objects
    // find the word object whose id is equivalent
    // to the id stored in value stored in head of the wordsLinkedList
    const getNextWord = async () => {
      await updateWords();
      const newWords = await getWords();
      return await newWords.find((node) => node.id === wordsLinkedList.head.value.id);
    };

    /** Example data returned by getNextWord()
     * getNextWord:  {
          id: 5,
          language_id: 1,
          original: 'hompi',
          translation: 'homepage',
          next: 4,
          memory_value: 1,
          correct_count: 2,
          incorrect_count: 3
        }
     */

    if (body.guess === headWord.translation) {
      try {
        await wordsLinkedList.correct();
        await LanguageService.updateTotalScore(
          req.app.get('db'),
          req.user.id,
          req.language.total_score + 1,
        );
        const nextWord = await getNextWord();
        await LanguageService.updateHead(
          req.app.get('db'),
          req.user.id,
          nextWord.id,
        );

        return res
          .status(200)
          .json({
            nextWord: nextWord.original,
            totalScore: req.language.total_score + 1,
            wordCorrectCount: headWord.correct_count + 1,
            wordIncorrectCount: headWord.incorrect_count,
            answer: headWord.translation,
            isCorrect: true,
          });
      } catch (error) {
        next(error);
      }
    } else {
      try {
        await wordsLinkedList.incorrect();
        const nextWord = await getNextWord();
        await LanguageService.updateHead(
          req.app.get('db'),
          req.user.id,
          nextWord.id,
        );

        console.log('nextWord: ', nextWord)

        return res
          .status(200)
          .json({
            nextWord: nextWord.original,
            totalScore: req.language.total_score,
            wordCorrectCount: headWord.correct_count,
            wordIncorrectCount: headWord.incorrect_count + 1,
            answer: headWord.translation,
            isCorrect: false,
          });
      } catch (error) {
        next(error);
      }
    }
  });

module.exports = languageRouter;
