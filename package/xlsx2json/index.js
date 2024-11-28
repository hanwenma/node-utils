const xlsx2json = require("xlsx-to-json");
const path = require("path");
const fs = require("fs");
const { ensureDirExistence } = require("../../utlis");

// 处理语言 xlsx
function handleLang(result, { input, output, targetDirectory }) {
  // 用于判断是【中 -> 英】还是【英 -> 中】
  const ChineseReg = new RegExp("[\\u4E00-\\u9FFF]+");

  // 确保目录存在
  ensureDirExistence(targetDirectory);

  // 目标文件路径
  const targetEnPath = path.join(targetDirectory, "./en-US.json"),
    targetZhPath = path.join(targetDirectory, "./zh-CN.json");

  // 读取已有的目标文件，用于去重
  const lastZhContent = fs.readFileSync(targetZhPath, "utf8"),
    lastEnContent = fs.readFileSync(targetZhPath, "utf8"),
    lastZhJson = JSON.parse(lastZhContent),
    lastEnJson = JSON.parse(lastEnContent);

  result.forEach((item) => {
    const Contents = Object.keys(item).map((key) => item[key]);

    // 表格列数据是倒序的，此处取表格第一列的值作为 key
    const key = Contents[1];
    if (key) {
      // 此处判断可混杂【中 -> 英】和【英 -> 中】的情况
      const isZh2eEn = ChineseReg.test(key);

      if (isZh2eEn) {
        lastZhJson[key] = key;
        lastEnJson[key] = Contents[0];
      } else {
        lastEnJson[key] = key;
        lastZhJson[key] = Contents[0];
      }
    }
  });

  // 删除无用文件
  fs.unlinkSync(output);

  // 创建或覆盖文件
  try {
    fs.writeFileSync(targetZhPath, JSON.stringify(lastZhJson));
    fs.writeFileSync(targetEnPath, JSON.stringify(lastEnJson));
    console.log(`
==================================================================================================

翻译内容转换成功，请查看【${targetDirectory}】下的【zh-CN.json、en-US.json】文件

==================================================================================================
    `);
  } catch (error) {
    console.log("翻译内容转换异常：", error);
  }
}

function xlsxToJson(
  option = {
    input: path.join(__dirname, `./lang.xlsx`),
    output: path.join(__dirname, "./i18n.json"),
    targetDirectory: path.join(__dirname, "../src/lang"),
  },
  callback
) {

  // 不传入 output 需要生成默认的输出路径
  if (!option.output) {
    const inputPaths = option.input.split("/");
    const fileName = inputPaths.pop().split(".")[0];
    option.output = path.join(inputPaths.join("/"), `${fileName}.json`);
  }

  xlsx2json(
    {
      input: option.input,
      output: option.output,
    },
    function (err, result) {
      if (err) {
        console.error(err);
        return;
      }

      callback && setTimeout(() => callback(result, option), 2000);
    }
  );
}

module.exports = { xlsxToJson, handleLang };
