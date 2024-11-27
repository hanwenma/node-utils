const path = require("path");
const { downloadFile } = require("./package/download");
const { xlsxToJson } = require("./package/xlsx2json");
const airlineData = require("./mock/test.json");

downloadFile({
    linkList: airlineData.map((item) => {
        const code = item.code;
        return {
            url: `https://static.tripcdn.com/packages/flight/airline-logo/latest/airline_logo/3x/${code.toLowerCase()}.webp`,
            name: `${code}.png`,
        };
    }),
    output: path.resolve(__dirname, "./mock/tripAirlineLogo"),
});