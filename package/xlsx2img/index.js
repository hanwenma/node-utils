const path = require("path");
const fs = require("fs");
const AdmZip = require("adm-zip");
const { ensureDirExistence } = require("../../utlis");

function xlsx2img({ input, output }) {
  // 1.压缩文件
  const zipPath = path.join(__dirname, "copy.zip");
  fs.copyFileSync(input, zipPath);

  // 2.解压文件
  const admzip = new AdmZip(zipPath);
  const extractPath = path.join(__dirname, "extract");
  admzip.extractAllTo(extractPath, true); // 第二个参数表示需要覆盖

  // 4.将图片文件夹提取出来：/xl/media
  ensureDirExistence(output); // 确保目录存在
  fs.cpSync(path.join(extractPath, "./xl/media"), output, { recursive: true });

  // 5. 删除临时文件
  fs.unlinkSync(zipPath);
  fs.rmSync(extractPath, { recursive: true });
}

module.exports = {
  xlsx2img,
};
