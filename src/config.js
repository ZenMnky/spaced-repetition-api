module.exports = {
  PORT: process.env.PORT || 8001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DB_URL
    || 'postgresql://dunder-mifflin@localhost:5433/spaced-repetition',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
}
