const mongoose=require('mongoose');
const cities = require('./cities');
const {places,descriptors}= require('./seedHelpers');
const Campground = require('../models/campground')

mongoose.connect('mongodb://127.0.0.1:27017/Campgrounds',{
    useNewUrlParser:true,
    // useCreateIndex:true,
    useUnifiedTopology:true
});

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
});
const sample = array=>array[Math.floor(Math.random()*array.length)];

const seedDB = async()=>{
    await Campground.deleteMany[{}];
    for(let i =0;i<50;i++)
    {
        const random1000 = Math.floor(Math.random() *1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp=new Campground({
            author: '65e830b8a244435513c9469a',

            location : `${cities[random1000].city},${cities[random1000].state}`,

            title: `${sample(descriptors)} ${sample(places)}`,

            description: 'Just normal days at camps!',

            price ,               

            geometry: {
              type: "Point",
              coordinates:[
                cities[random1000].longitude,
                cities[random1000].latitude
              ]
            },

            images:[
                {
                  url: 'https://res.cloudinary.com/drzwwcagk/image/upload/v1710185227/Yelpcamp/ltke3plogazbkpxdvjn0.jpg',
                  filename: 'Yelpcamp/ltke3plogazbkpxdvjn0',
                },
                {
                  url: 'https://res.cloudinary.com/drzwwcagk/image/upload/v1710185228/Yelpcamp/ebbrjhzgrjmpatyamstz.jpg',
                  filename: 'Yelpcamp/ebbrjhzgrjmpatyamstz',
                },
                {
                  url: 'https://res.cloudinary.com/drzwwcagk/image/upload/v1710185227/Yelpcamp/d1wt2x80wxlrqzebwukz.jpg',
                  filename: 'Yelpcamp/d1wt2x80wxlrqzebwukz',
                }
              ]
        })
        await camp.save();
    }
}

seedDB().then(()=>
{
    mongoose.connection.close();
});

