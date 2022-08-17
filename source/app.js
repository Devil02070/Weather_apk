//weather apk
const express = require('express');
const app = express();

//call api
var requests = require('requests');


const fs = require('fs');
const homefile = fs.readFileSync('templates/Home.hbs','utf-8');

const replaceval = (tempval, orgval) => {
    let temperature = tempval.replace("{{current_temp}}", orgval.main.temp);
    temperature = temperature.replace("{{min_temp}}", orgval.main.temp_min);
    temperature = temperature.replace("{{max_temp}}", orgval.main.temp_max);
    temperature = temperature.replace("{{city}}", orgval.name);
    temperature = temperature.replace("{{country}}", orgval.sys.country);
    temperature = temperature.replace("{{temp_status}}", orgval.weather.main);
    return temperature;
    // return min_temperature;
};
const path = require("path");
const hbs = require("hbs");
// app.use(express.static('public'))
// app.use('/static', express.static(path.join(__dirname, 'public')))

const temp_path = path.join(__dirname,'../templates/');
const static_path = path.join(__dirname, '../public/');

app.use(express.static(static_path));
app.set('view engine', 'hbs' );
app.set('views', temp_path);
// app.use()
console.log(static_path);
console.log(temp_path);


app.get('/',(req,res)=>{
    requests('https://api.openweathermap.org/data/2.5/weather?q=Mandi&appid=17f98f7cd992c0e8e04e830b752538a7')
    .on('data', (api_data)=>{
        const objdata = JSON.parse(api_data);
        const arrdata = [objdata]
        // console.log(arrdata);
        // console.log(arrdata[0].weather);
        const getRealTimeData = arrdata.map((val) => replaceval(homefile, val)).join("");
        // console.log(getrealtimedata)
        res.write(getRealTimeData);
    })
    .on('end', (err)=> {
        if(err){
            console.log('connection closed due to errors', err)
        };
        console.log('end');
        res.end();
    });
    // res.status(200).render("Home");
})

app.get("/quotes",(req,res)=>{
    res.send('hello');
})










const port = process.env.PORT || 3000;




app.listen(port, ()=>{
    console.log('App running ar port 3000');
})