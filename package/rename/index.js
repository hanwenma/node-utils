const fs = require("fs");
const { ensureDirExistence } = require("../../utlis");

// 根据数据进行文件映射
function dataMappingFile({ inputDir, outDir, data, dataKey }) {
  // 读取目录下的所有文件
  fs.readdir(inputDir, (err, files) => {
    // 按文件名排序（若其中有数字则优先按数字顺序排序）
    files = files
      .map((fileName) => {
        let index = fileName;

        // 提取文件名中的数字
        const nums = fileName.match(/\d+(\.\d+)?/g);
        if (nums.length) {
          index = parseFloat(
            nums.length > 1 ? nums.shift() + "." + nums.join("") : nums.join("")
          );
        }

        return {
          index,
          fileName,
        };
      })
      .sort((a, b) => a.index - b.index);

      console.log("files = ", files)

    // 重命名文件
    const tasks = files.map(({ fileName }, index) => {
      const ext = fileName.split(".").pop();

      const oldPath = `${inputDir}/${fileName}`;
      const newPath = `${outDir}/${data[index][dataKey]}.${ext}`;

      // 确保目录存在
      ensureDirExistence(outDir);

      return new Promise((resolve, reject) => {
        fs.rename(oldPath, newPath, function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });

    // 批量执行重命名操作
    Promise.allSettled(tasks).then((results) => {
      const rejectedItem = results.find((v) => v.status === "rejected");
      if (rejectedItem) {
        throw rejectedItem.reason;
      } else {
        console.log(`
==================================================================================================

数据和文件关联成功，请查看【${outDir}】下的文件

==================================================================================================
        `);
      }
    });
  });
}

module.exports = {
  dataMappingFile,
};
