const Koa = require('koa');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const server = require('./index');
const data = require('./data');


describe('index', () => {
  it('should create an instance of a Koa server', (done) => {
    const instance = server();
    chai.expect(instance).to.be.instanceof(Koa);
    done();
  });
  it('should perform queries on meter_reads table', (done) => {
    const resdb = data.db.prepare('SELECT cumulative FROM meter_reads LIMIT 1').all();
    chai.expect(resdb[0]).to.be.an('object');
    done();
  });
});

describe('/GET /mr/list', () => {
  it('it should GET all the meter readings', (done) => {
    chai.request('http://localhost:3000')
      .get('/mr/list')
      .end((err, res) => {
        chai.expect(res.status).to.be.equal(200);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.mr).to.be.a('array');
        done();
      });
  });
});

describe('/POST /mr', () => {
  it('it should exist and throw a missing param error', (done) => {
    chai.request('http://localhost:3000')
      .post('/mr')
      .end((err, res) => {
        chai.expect(res.status).to.be.equal(200);
        chai.expect(res.body.result).to.be.equal(-99);
        chai.expect(res.body.message).to.be.equal('Error: missing param cumulative');
        done();
      });
  });
});

describe('/GET /mr/monthlyusage', () => {
  it('it should GET the energy usage and the meter readings', (done) => {
    chai.request('http://localhost:3000')
      .get('/mr/monthlyusage')
      .end((err, res) => {
        chai.expect(res.status).to.be.equal(200);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.mr).to.be.a('array');
        done();
      });
  });
});
