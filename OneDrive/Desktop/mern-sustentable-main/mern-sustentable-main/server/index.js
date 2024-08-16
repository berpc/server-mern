const mongoose = require("mongoose");
const app = require("./app");
const port = process.env.PORT || 3977;
const { API_VERSION, IP_SERVER, PORT_DB, NAME_DB } = require("./config");


mongoose.connect(
    //`mongodb+srv://fray:1234@cluster0-ox2m2.mongodb.net/backend?retryWrites=true&w=majority`, //CONEXIÓN A MONGODB ATLAS
    `mongodb://${IP_SERVER}:${PORT_DB}/web-db`, //CONEXIÓN A LOCALHOST
    { useNewUrlParser: true, useUnifiedTopology: true, 
        //useCreateIndex: true, 
        //useFindAndModify: false 
    },
    (err, res) => {
        if (err) {
            throw err;
        } else {
            console.log("La conexión a la base de datos web-db es correcta.");
            app.listen(port, () => {
                console.log("###########################");
                console.log("######## API REST #########");
                console.log("###########################");
                console.log(`http://${IP_SERVER}:${port}/api/${API_VERSION}/`);
                console.log("");
            });
        }
    }
);
