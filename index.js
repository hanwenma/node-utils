
const path = require('path');
const {dataMappingFile} = require('./package/rename');
const airlineData = require('./mock/airlineData.json');

dataMappingFile({
    inputDir: path.join(__dirname, "./mock/logo"), 
    outDir: path.join(__dirname, "./mock/newLogo"),
    data: airlineData, 
    dataKey: 'code'
});