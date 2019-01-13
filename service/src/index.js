const Koa = require('koa');
const KoaRouter = require('koa-router');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const data = require('./data');
const moment = require('moment');

const PORT = process.env.PORT || 3000;

function getDiffInDays(mmt1, mm2) {
  return mmt1.diff(mm2, 'days');
}

function getDaysUntilMonthEnd(mmt) {
  return getDiffInDays(moment.utc(mmt).endOf('month'), mmt);
}


function createServer() {
  const server = new Koa();
  server.use(bodyParser());
  server.use(cors());

  const router = new KoaRouter();
  router.get('/', (ctx, next) => {
    ctx.status = 403;
    next();
  });

  //// Retrieve a LIST of meter readings
  router.get('/mr/list', (ctx, next) => {
    const rows = data.db.prepare('SELECT * FROM meter_reads ORDER BY reading_date ASC').all();
    ctx.body = {
      result: 1,
      message: 'OK',
      mr: rows,
    };
    next();
  });

  //// Retrieve a List of Monthly Energy usage
  // EnergyUsage(month M) = MeterReading(last day of month M) - MeterReading(last day of month M-1)
  router.get('/mr/monthlyusage', (ctx, next) => {
    const rows = data.db.prepare('SELECT * FROM meter_reads ORDER BY reading_date ASC').all();
    let mu = [];
    let cpm = [];
    let firstMeter = {};
    let lastMeter = {};
    let intMR1 = 0;
    let intMR2 = 0;
    if (rows.length>1) {
      firstMeter = rows[0];
      intMR1 = rows[0].cumulative;
      for (let i = 0; i < rows.length-1; i++) {
        lastMeter = rows[i];
        let chk1 = moment(firstMeter.reading_date,'YYYY-MM-DDTHH:mm:ss.000Z');
        let chk2 = moment(lastMeter.reading_date,'YYYY-MM-DDTHH:mm:ss.000Z');
        let m1 = chk1.format('YYYYMM');
        let m2 = chk2.format('YYYYMM');
        if (m1 < m2) {
          let daysToEndOfMonth = getDaysUntilMonthEnd(chk1);
          let diffDays = getDiffInDays(chk2, chk1);
          let usagePerDay = (lastMeter.cumulative-firstMeter.cumulative)/diffDays;
          intMR2 = Math.round(intMR1+(daysToEndOfMonth*usagePerDay));
          mu.push({
            reading_date: chk1.format('YYYY-MM'),
            days_diff: diffDays,
            days_to_end: daysToEndOfMonth,
            days_from_start: (diffDays-daysToEndOfMonth),
            cumulative: intMR2,
            unit: 'kWh',
          });
          cpm.push({
            reading_date: chk2.format('YYYY-MM'),
            cumulative_first: intMR2,
          });
          firstMeter = rows[i];
          intMR1 = rows[i].cumulative;
        }
      }

      for (let i = 0; i < mu.length-1; i++) {
        for (let a = 0; a < cpm.length-1; a++) {
          let mu_date = moment(mu[i].reading_date,'YYYY-MM').format('YYYY-MM');
          let cpm_date = moment(cpm[a].reading_date,'YYYY-MM').format('YYYY-MM');
          if (mu_date === cpm_date) {
            cpm[a].cumulative_last = mu[i].cumulative;
            cpm[a].energy_usage = (mu[i].cumulative-cpm[a].cumulative_first);
            cpm[a].unit = 'kWh';
          }
        }
      }

      if (cpm.length > 2) {
        cpm[cpm.length-2].cumulative_last = cpm[cpm.length-1].cumulative_first;
        cpm.splice((cpm.length-1), 1);
      }

    }

    ctx.body = {
      result: 1,
      message: 'OK',
      mr: cpm,
      omr: rows,
    };
    next();
  });


  //// Save a new meter reading
  router.post('/mr', (ctx, next) => {
    const jsonBody = ctx.request.body;
    if (typeof(jsonBody.cumulative) == "undefined") {
      ctx.body = {
        result: -99,
        message: 'Error: missing param cumulative',
        mr: [jsonBody],
      };
      next();
    } else if (typeof(jsonBody.reading_date) == "undefined") {
      ctx.body = {
        result: -99,
        message: 'Error: missing param reading_date',
        mr: [jsonBody],
      };
      next();
    } else if (typeof(jsonBody.unit) == "undefined") {
      ctx.body = {
        result: -99,
        message: 'Error: missing param unit',
        mr: [jsonBody],
      };
      next();
    } else {
      const insert = data.db.prepare('INSERT INTO meter_reads (cumulative, reading_date, unit) VALUES (@cumulative, @reading_date, @unit)').run(jsonBody);
      if (insert.changes>0) {
        ctx.body = {
          result: 1,
          message: 'OK',
          mr: [jsonBody],
        };
      } else {
        ctx.body = {
          result: -1,
          message: 'Error: impossible to save the meter reading',
          mr: [jsonBody],
        };
      }
      next();
    }
  });

  server.use(router.allowedMethods());
  server.use(router.routes());

  return server;
}

module.exports = createServer;

if (!module.parent) {
  data.initialize();
  const server = createServer();
  server.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
  });
}
