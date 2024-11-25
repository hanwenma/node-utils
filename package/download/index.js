const request = require('request');
const fs = require("fs");
const path = require("path");
const { ensureDirExistence } = require("../../utlis");

function downloadFile({ linkList, output }) {
  // 确保文件目录存在
  ensureDirExistence(output);

  //   循环下载文件
  for (const { url, name } of linkList) {
    request(url).pipe(fs.createWriteStream(path.join(output, name)));
  }
}

module.exports = {
  downloadFile,
};
