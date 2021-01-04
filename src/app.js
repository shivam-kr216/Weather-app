const path = require('path')
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

//console.log(__dirname);
//console.log(path.join(__dirname, '../public'));

const app = express();

//DEFINING PATH FOR EXPRESS CONFIG
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials'); 

//BY DEFAULT IT IS LOOKING FOR VIEWS FOLDER SO WE CAN MAKE THAT AND IN THAT CASE THERE IS NO NEED TO GIVE PATH
//SETUP HANDLEBAR ENGINE AND VIEWS LOCATION
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath);

//SET STATIC DIRECTORY TO SERVE
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    //IT IS INDEX.HBS FILE IN VIEWS FOLDER
    res.render('index', {
        title: 'Weather App',
        name: 'Shivam Kumar'
    });
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Shivam Kumar'
    });
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Shivam Kumar'
    });
})

app.get('/products', (req, res) => {
    //req.query is used to fetch data from url when data is passed in url
    if(!req.query.search){
        //response will be sent only once to the the here without return in the first res.send we are 
        //sending request twice but after writing return it will be sent only once
        return res.send({
            error: 'You must provide a search term!'
        });
    }
    console.log(req.query.search);
    res.send({
        products: []
    });
})

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: 'You must provide an address!'
        });
    }
    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if(error){
            return res.send({error});
        } 
        forecast(latitude, longitude, (error, forecastData) => {
            if(error){
                return res.send({error}); 
            }
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })

        });

    //res.send({
    //    address: req.query.address
    //});
    })
})

app.get('/help/*', (req, res) => { 
    res.render('4O4', {
        title: '4O4 help',
        name: 'Shivam Kumar',
        errorMsg: 'Help article Not Found!'
    })
})

app.get('*', (req, res) => {
    res.render('4O4', {
        title: '4O4 Error',
        name: 'Shivam Kumar',
        errorMsg: 'Page Not Found!'
    })
})

//When we send object as response it will automatically convert that to json
//Static pages IN PUBLIC FOLDER

//app.get('', (req, res) => {
//    res.send();
//})

//app.get('/help', (req, res) => {
//    res.send({
//        name: 'Shivam',
//        age: 21
//    });
//})

//app.get('/about', (req, res) => {
//    res.send('<h1>About page!<h1>');
//})

//app.get('/title', (req, res) => {
//    res.send({
//        forcast: 'It is sunny',
//        location:'Dhanbad'
//    });
//})


app.listen(3000, () => {
    console.log('Server is up on port 3000')
})