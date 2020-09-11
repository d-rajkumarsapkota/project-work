require('dotenv').config()
var express = require('express')
var app = express()
var cors = require('cors')

// parse requests of content-type: application/json
var bodyParser = require('body-parser')
var port = process.env.PORT || 3000

const publicUserRouter = require('./route/public_user_route');
const adminUserRouter = require('./route/admin_user_route');

app.use(bodyParser.json())
// parse requests of content-type: application/x-www-form-urlencoded
//This doesn't work when user is sending raw data in json format
//app.use(bodyParser.urlencoded({ extended: true }));


// ****** allow cross-origin requests code START ****** //
app.use(cors());

// const allowedOrigins = process.env.ALLOWED_ORIGIN.split(',');
// app.use(cors({
//     origin: function (origin, callback) {
//         // allow requests with no origin 
//         // (like mobile apps or curl requests)
//         if (!origin) return callback(null, true);
//         if (allowedOrigins.indexOf(origin) === -1) {
//             var msg = 'The CORS policy for this site does not ' + 'allow access from the specified Origin.';
//             return callback(new Error(msg), false);
//         }
//         return callback(null, true);
//     }
// }));

// ****** allow cross-origin requests code END ****** //


// To allow profile_image to be access by public
// eg:. http://localhost:3000/profile_image/image.jpg
app.use('/profile_image', express.static('profile_image'));

app.use(
  bodyParser.urlencoded({
    extended: false
  })
)

app.use('/api', publicUserRouter);
app.use('/api/emp', adminUserRouter);


// ****** Testing api connection code START ****** //


// app.use('/api/gen-quote', 
//     (req, res) => res.send('Welecome to App') 
// );

// app.get('/api', (req, res) => {
//     res.json({
//         success: 1,
//         message: "Rest api is working"
//     });
// });

// ****** Testing api connection code END ****** //


app.listen(port, 
    () => {
        console.log('Server is running on port: ' + port)
})
