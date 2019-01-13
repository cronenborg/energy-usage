const sampleData = require('../sampleData.json');
const Database = require('better-sqlite3');
const fs = require('fs');
const db = new Database(':memory:', {memory: true});

function initialize() {
    db.prepare('CREATE TABLE IF NOT EXISTS meter_reads (cumulative INTEGER, reading_date TEXT, unit TEXT)').run();
    const { electricity } = sampleData;
    electricity.forEach((data) => {
      const insert = db.prepare('INSERT INTO meter_reads (cumulative, reading_date, unit) VALUES (?, ?, ?)').run(data.cumulative, data.readingDate, data.unit);
    });
}

module.exports = {
  initialize,
  db
};
