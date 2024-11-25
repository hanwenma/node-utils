const path = require("path");
const { downloadFile } = require("./package/download");
const airlineData = require("./mock/airlineData.json");

downloadFile({
    linkList: airlineData.map((item) => {
        return {
            url: `https://static.tripcdn.com/packages/flight/airline-logo/latest/airline_logo/3x/${item.code.toLowerCase()}.webp`,
            name: `${item.code}.png`,
        };
    }),
    output: path.resolve(__dirname, "./mock/tripAirlineLogo"),
});