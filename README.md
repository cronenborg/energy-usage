# Bulb Coding Challenge - Meter Readings

## Overview

Thank you for interviewing at Bulb and making the time to complete this coding exercise.

In this challenge, we are looking at the energy usage of a customer. We have built a very basic web application and server that displays and processes the data and we would like you to improve it.

This challenge has three parts,

1.  Improve the look and feel of the application,
2.  Develop a meter reading API,
3.  Change how monthly usage is calculated.

We ask that you do **one** of either task 1 or task 2, **then** do task 3. When choosing between which task to do, pick the one you think will highlight your strengths, as we're hiring for frontend, backend and full stack engineers.

## Tasks

### 1. Improve the look and feel of the application

For this task, we ask you clean up the React application that has been built in the `webapp/` directory. We're looking at how you structure frontend code.

We would like you to:

* Refactor the code to follow general React best practices,
* Write unit tests (we have added [Enzyme](https://github.com/airbnb/enzyme) and [Jest](https://facebook.github.io/jest/) but feel free to use another framework),
* Fetch meter readings from [https://storage.googleapis.com/bulb-interview/meterReadingsReal.json](https://storage.googleapis.com/bulb-interview/meterReadingsReal.json),
* Style the application - if you are familiar with [styled-components](http://styled-components.com/), we would love to see how you use it, if you are not please feel free to use CSS, SASS or LESS. In any case, do not spend more than 15 minutes on improving the application style.

We do **not** want you to spend time on:

* Changing how the application is bundled and run,
* Setting up a new linter (we have added eslint with the [Airbnb configuration](https://github.com/airbnb/javascript)),
* Using Redux (or any other utility library that is not necessary for this very simple case),
* "Over-styling" the application.

**This task should take you roughly 1 hour 45 minutes.**

### or 2. Create a meter reading API

For this task, we ask you to create a new REST API for meter readings, which we've started in `service/`. We're looking at how you structure and architect a service.

We have set up a very basic [Koa server](https://koajs.com/) in the `service/` directory, with a [Koa router](https://github.com/alexmingoia/koa-router). There is also a simple database set up in `service/data.js` that you can use to store anything you need for this task. It automatically imports all the meter readings from the `service/sampleData.json` file. You might want to quickly go over the documentation for [sqlite3](https://github.com/mapbox/node-sqlite3/wiki) to see how to use it.

For the purposes of this exercise, a meter reading is a cumulative number in kilowatt hours (kWh) shown by an electricity meter. To submit a meter reading, you must provide this number that's displayed on the meter, and the date that the reading was taken.

Create a simple RESTful API that can,

* retrieve a list of meter readings from the database,
* add a new meter reading that gets stored in the database,
* write appropriate tests. We have set up Mocha and Chai for this purpose (use `yarn test` to run it), but feel free to change the framework to something that works for you.

Do **not** focus on adding authentication, using a full database solution, dockerising the service, or worry about the number rolling over on the meter.

**This task should take you less than 2 hours.**

### 3. Change how monthly usage is calculated

For this task, we ask that you calculate the monthly electricity usage. This can be done in either the web application, or the API you have created.

We show a chart on the web application, that is supposed to reflect the usage within each calendar month. The way it is currently written means that it shows the usage since the last meter reading.

For the purposes of this exercise, a meter reading is a cumulative number in kilowatt hours (kWh) shown by an electricity meter. They can be entered at any time of the month.

An electricity meter is a device that measures electricity usage. For the purpose of this task a meter has following properties:

* It has a display of 5 digits making up a current cumulative number
* It increments the number according to the current usage of the electricity
* The number can only go up and never resets

Example of a meter: https://community.bulb.co.uk/uploads/editor/n1/yuq5ei46qa2t.jpg

Meter readings are used to calculate energy usage using a simple calculation:

```
  Energy Usage(period t1 -> t2) = MeterReading(t2) - MeterReading(t1)
```

To solve this task, we would like you to:

1.  Estimate the end of month meter readings (by interpolating the closest meter readings, i.e. the ones available just before and just after),
2.  Calculate the energy usage for the month based on the estimated end of month meter readings,

Exposure of this information depends on which task you did above,

* If you did task 1, then the usage data should be shown in the chart, each bar should represent the estimated usage that you have calculated for that month. Use the data that you fetch from [https://storage.googleapis.com/bulb-interview/meterReadingsReal.json](https://storage.googleapis.com/bulb-interview/meterReadingsReal.json),
* If you did task 2, then the usage data must be exposed via an API endpoint that the web application could receive. It should output each month, and the usage within that month. Use the data that you have seeded your database with.

**We think this task should take you about 1 hour, but don't worry if you don't finish it.**

**Tips**

* You can assume there is exactly one meter reading per month,
* The table should still reflect the readings that the user had entered,
* Don't try to interpolate at the edges of the dataset (i.e. if we don't have a meter reading for month M-1, then don't try to estimate the meter reading for month M),
* `EnergyUsage(month M) = MeterReading(last day of month M) - MeterReading(last day of month M-1)`,
* To deal with dates we recommend using [momentjs](https://momentjs.com). This is a great [cheatsheet](https://devhints.io/moment), but some useful tips,

  * Momentjs has a tendency to mutate moment objects.
  * We wrote a few function below that may be handy, feel free to use them.
  * Feel free to use the following functions in your project.

    ```javascript
    /**
     * Check whether a moment object is the end of the month.
     * Ignore the time part.
     * @param {moment} mmt
     */
    function isEndOfMonth(mmt) {
      // startOf allows to ignore the time component
      // we call moment(mmt) because startOf and endOf mutate the momentj object.
      return moment
        .utc(mmt)
        .startOf('day')
        .isSame(
          moment
            .utc(mmt)
            .endOf('month')
            .startOf('day'),
        );
    }

    /**
     * Returns the difference between two moment objects in number of days.
     * @param {moment} mmt1
     * @param {moment} mm2
     */
    function getDiffInDays(mmt1, mm2) {
      return mmt1.diff(mm2, 'days');
    }

    /**
     * Return the number of days between the given moment object
     * and the end of the month of this moment object.
     * @param {moment} mmt
     */
    function getDaysUntilMonthEnd(mmt) {
      return getDiffInDays(moment.utc(mmt).endOf('month'), mmt);
    }
    ```

## Practicalities

* Please add your name and how much time you spent on the exercise to [NOTES](./NOTES.md). Add any other notes explaining your approach.
* We will extend this exercise when you come on-site, so you may want to bring your own laptop if you can (you don't have to though).

## Setup

### Dependencies

The main dependencies are listed below.

For the web application,

* [React](https://reactjs.org/) as web framework
* [Jest](https://facebook.github.io/jest/) and [Enzyme](http://airbnb.io/enzyme/) for testing
* [webpack](https://webpack.js.org/) as bundler
* [webpack-dev-server](https://github.com/webpack/webpack-dev-server) as a local dev server
* [Babel](https://babeljs.io/) as transpiler
* [recharts](http://recharts.org/#/en-US/) for charts

For the service,

* [Koa](https://koajs.com/) as the server framework,
* [Koa Router](https://github.com/alexmingoia/koa-router) for routing,
* [Mocha](https://mochajs.org/) as the test framework,
* [Chai](http://www.chaijs.com/) as the assertion library.

We use [yarn](https://yarnpkg.com/lang/en/docs/install/) to manage dependencies and we run node 8.9.x.

## Commands

For `webapp`,

* `yarn install` - install all dependencies
* `yarn build` - build the code
* `yarn start` - start a developer web server
* `yarn test` - run all unit tests
* `yarn lint` - lint your code

For `server`,

* `yarn install` - install all dependencies
* `yarn start` - start the web server (if you get a port conflict, then use the `PORT` environment variable to change it, ie `PORT=3001 yarn start`)
* `yarn test` - run all unit tests
* `yarn lint` - lint your code
