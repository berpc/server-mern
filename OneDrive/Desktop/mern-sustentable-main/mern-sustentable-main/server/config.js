const mongoose = require("mongoose");
const API_VERSION = "v1";
const IP_SERVER = "localhost";
const PORT_DB = 27017;
const NAME_DB = "web-db";

function connectDB (module){
    var connection = mongoose.createConnection(
        `mongodb://${IP_SERVER}:${PORT_DB}/${NAME_DB}`,
        { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false },
        (err, res) => {
            if (err) {
                throw err;
            } else {
                console.log("Conexión " + module + " a DB -> OK"); //revisar esto, no devuelve person, client, supplier
            }
        }
    );
    return connection;
}


module.exports = {
    API_VERSION,
    IP_SERVER,
    PORT_DB,
    connectDB
};