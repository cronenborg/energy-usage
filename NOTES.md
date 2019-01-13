###Candidate Name: 
Gianpaolo Papa

###Tasks: 
2 and 3

###Time:
3 hours

###Notes:
####Task 2:
* The RESTful API is simplified with no structured MVC pattern: all the routes and controllers are on index.js
* I had to change the sqlite library with 'better-sqlite3' because the already installed library is not working correctly with async/await patterns
* I added the library 'koa-bodyparser' for parsing the body of a HTTP POST request to read the passed JSON

How to call the meter reading list GET API:
>curl --request GET \
>  --url http://localhost:3000/mr/list


How to call the meter reading POST API (example):

>curl --request POST \
>  --url http://localhost:3000/mr \
>  --header 'content-type: application/json' \
>  --data '{
>	"cumulative": 20950,
>	"reading_date": "2018-05-29T00:00:00.000Z",
>	"unit": "kWh"
>}'
 

####Task 3:
* I added a new route 'GET /mr/monthlyusage' on the API to get the calculated monthly energy usages

How to call the monthly usage GET API:

>curl --request GET \
>  --url http://localhost:3000/mr/monthlyusage


* Updated the React frontend to fetch remote data from APIs, using 'axios' and ReactDOM.render to make changes on the DOM
