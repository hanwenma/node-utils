const fs = require("fs");
const path = require("path");

// 确保目录存在
function ensureDirExistence(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 确保文件存在
function ensureFileExistence(filePath) {
  // 获取文件目录路径
  const dirPath = path.dirname(filePath);

  // 确保目录存在
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // 确保文件存在
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "", "utf8"); // 创建空文件
  }
}

module.exports = {
  ensureDirExistence,
  ensureFileExistence,
};
