const fs = require('fs');
var csv = require("fast-csv");

const DATE_KEY='date'; // todo: set this in .env. use dotenv

!async function () {
    const stream = fs.createReadStream("data/raw.csv");
    var writeStream = fs.createWriteStream("data/result.csv");
    const objectsArray = [];
    let counter = 0;
    csv
        .fromStream(stream, { headers: true })
        .on("data", function (data) {
            try {
                counter++;
                const ISOdate = new Date(data[DATE_KEY]).toISOString();
                const updatedObject = Object.assign(data, { date: ISOdate });
                objectsArray.push(updatedObject);
            } catch (e) {
                console.error(`Error for ${JSON.stringify(data)}`)
            }

        })
        .on("end", function () {
            csv
                .write(
                    objectsArray,
                    { headers: true })
                .pipe(writeStream);
            console.log("done", counter);
        });
}();