const path = require("path");
const { xlsxToJson } = require("./package/xlsx2json");

xlsxToJson({
  input: path.join(__dirname, `./mock/test.xlsx`),
});
