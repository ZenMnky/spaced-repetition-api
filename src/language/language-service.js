const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id })
  },
  getHead(db, user_id){
    return db
    .raw("SELECT word.original AS next_word, language.total_score AS total_score, word.correct_count AS word_correct_count, word.incorrect_count AS word_incorrect_count FROM language JOIN word ON language.head = word.id WHERE language.user_id = ??", user_id)
  }
}

module.exports = LanguageService
