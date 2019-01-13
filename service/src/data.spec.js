const { expect } = require('chai');
const data = require('./data');

describe('data', () => {
  it('initialize should import the data from the sampleData file OR read an existing not empty DB', (done) => {
    data.initialize();
    const resdb = data.db.prepare('SELECT * FROM meter_reads ORDER BY cumulative').all();
    expect(resdb[0]).to.be.an('object');
    done();
  });
});
