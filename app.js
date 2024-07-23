if(process.env.NODE_ENV!== "production"){
  require('dotenv').config();
}
// require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const session = require("express-session")
const flash = require("connect-flash")
const passport=require('passport');
const LocalStrategy=require('passport-local');
const app = express();
const path = require("path");
const User =require('./models/user');

const userRoutes=require('./routes/users');
const campgroundRoutes=require('./routes/campgrounds')
const reviewRoutes=require('./routes/reviews');
const mongoSanitize=require('express-mongo-sanitize')
const helmet=require('helmet');
const MongoStore=require('connect-mongo');
const dbUrl= process.env.DB_URL || "mongodb://127.0.0.1:27017/Campgrounds";    

//express starting up
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
  // useCreateIndex:true,
  // userFindAndModify:false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));  //url and text inputs only
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')));

const secret = process.env.SECRET || 'SeriouslySecret';
// const store=new MongoStore({
//   url:dbUrl,
//   secret:'SeriouslySecret',
//   touchAfter:24*60*60
// })

// store.on("error",function (e){
//   console.log("Session store error",e)
// });

//SessionSetting
const sessionConfig = {
  name:'Pikachu',
  secret,
  resave: false,
  saveUninitialized:true,
  cookie:{
    httpOnly:true,
    // secure:true,
    expires: Date.now() + 1000 * 60 *60 *24 *7,
    maxAge: 1000 * 60 *60 *24 *7
  }
}
app.use(session({
  sessionConfig,
  secret,
  resave:false,
  saveUninitialized:false,
  store: MongoStore.create({
    mongoUrl:dbUrl,
    secret,
    touchAfter:24*60*60
  })
}))
app.use(flash())
// app.use(helmet({
//   contentSecurityPolicy:false
// }))

// const scriptSrcUrls = [
//   "https://stackpath.bootstrapcdn.com/",
//   "https://api.tiles.mapbox.com/",
//   "https://api.mapbox.com/",
//   "https://kit.fontawesome.com/",
//   "https://cdnjs.cloudflare.com/",
//   "https://cdn.jsdelivr.net/",
//   "https://getbootstrap.com/",
// ];
// const styleSrcUrls = [
//   "https://getbootstrap.com/",
//   "https://kit-free.fontawesome.com/",
//   "https://stackpath.bootstrapcdn.com/",
//   "https://api.mapbox.com/",
//   "https://api.tiles.mapbox.com/",
//   "https://fonts.googleapis.com/",
//   "https://use.fontawesome.com/",
// ];
// const connectSrcUrls = [
//   "https://api.mapbox.com/",
//   "https://a.tiles.mapbox.com/",
//   "https://b.tiles.mapbox.com/",
//   "https://events.mapbox.com/",
// ];
// const fontSrcUrls = [];
// app.use(
//   helmet.contentSecurityPolicy({
//       directives: {
//           defaultSrc: [],
//           connectSrc: ["'self'", ...connectSrcUrls],
//           scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//           styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//           workerSrc: ["'self'", "blob:"],
//           childSrc: ["blob:"],
//           objectSrc: [],
//           imgSrc: [
//               "'self'",
//               "blob:",
//               "data:",
//               "https://res.cloudinary.com/drzwwcagk/",
//               "https://images.unsplash.com/",
//           ],
//           fontSrc: ["'self'", ...fontSrcUrls],
//       },
//   })
// );

//To remove data ,use;
app.use(mongoSanitize({
  replaceWith:'_'
}));

//Passport startup
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Global variable
app.use((req,res,next)=>{
  console.log(req.query)
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

//Routes using
app.use('/',userRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);

//Error prevention
app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something went wrong!";
  res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 3002; // Change the port number
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// Quick jacking attack filter --- helmet used