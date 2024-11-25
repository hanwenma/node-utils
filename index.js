const path = require("path");
const { dataMappingFile } = require("./package/rename");
const { xlsx2img } = require("./package/xlsx2img");
const airlineData = require("./mock/airlineData.json");

// 文件数据映射
// dataMappingFile({
//     inputDir: path.join(__dirname, "./mock/logo"),
//     outDir: path.join(__dirname, "./mock/newLogo"),
//     data: airlineData,
//     dataKey: 'code'
// });

// 从 Excel 中提取图片
xlsx2img({
    input: path.join(__dirname, "./mock/test.xlsx"),
    output: path.join(__dirname, "./mock/imgaes"),
});
