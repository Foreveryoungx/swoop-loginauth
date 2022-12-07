require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require('morgan');

const cookieSession = require("cookie-session");

const dbConfig = require("./app/config/db.config");

const app = express();
const corsOptions = {
     origin : "*",
};
app.use(morgan("dev"));

app.use(cors(corsOptions));
//parse request

app.use(express.json());
//parse request of content-type - application/x-www-form-urlencoded

app.use(express.urlencoded({ extended: true }));

app.use(cookieSession({
    name : "session",
    secret: "COOKIE_SECRET",
    httpOnly: true
})
);
/********** DataBase Connection **********/
const db = require("./app/models")
const Role = db.role;

db.mongoose
    .connect(`mongodb+srv://${dbConfig.username}:${dbConfig.password}@cluster0.sgtwfyw.mongodb.net/SwoopUser?retryWrites=true&w=majority`, {
    useNewUrlParser : true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connect to MongoDB");
    initial();
}).catch ((err) => {
    console.error("Connection error", err);
    process.exit();
});

/********** Routes **********/
app.get("/", (req, res) => {
    res.json({ Title: "Swoop API application.", message:"Routes to access for this API is signup,login, signout will be POST request", signup:"https://swoop-login-auth.vercel.app/api/auth/sigup", login: "https://swoop-login-auth.vercel.app/api/auth/signin", signout: "https://swoop-login-auth.vercel.app/api/auth/signout" });
});
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

/********** Listen for Request on Port **********/
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

/********** FN's **********/
function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if(!err && count === 0) {
            new Role({
                name: "user"
            }).save(err => {
                if(err) {
                    console.log("error", err);
                }
                console.log("added 'user' to roles collection");
            });

            new Role({
                name: "driver"
            }).save(err => {
                if(err) {
                    console.log("error", err);
                }
                console.log("added 'driver' to roles collection");
            });

            new Role({
                name: "admin"
            }).save(err => {
                if(err) {
                    console.log("error", err);
                }
                console.log("added 'admin' to roles collection");
            });
        }
    });
}