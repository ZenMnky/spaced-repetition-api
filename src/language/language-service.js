const LanguageService = {
  getLanguage(db, user_id) {
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
      .first();
  },

  getWords(db, language_id) {
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
      .where({ language_id });
  },

  updateWords(db, id, data) {
    return db
      .from('word')
      .update({
        next: data.next,
        correct_count: data.correct_count,
        incorrect_count: data.incorrect_count,
        memory_value: data.memory_value,
      })
      .where({ id });
  },

  updateHead(db, user_id, head) {
    return db
      .from('language')
      .update({ head })
      .where('language.user_id', user_id);
  },

  updateTotalScore(db, user_id, total_score) {
    return db
      .from('language')
      .update({ total_score })
      .where('language.user_id', user_id);
  },

};

module.exports = LanguageService;
