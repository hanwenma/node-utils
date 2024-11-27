const request = require("request");
const fs = require("fs");
const path = require("path");
const { ensureDirExistence } = require("../../utlis");

function writeFile({ name, content }) {
  return new Promise((resolve, reject) =>
    fs.writeFileSync(
      path.join(process.cwd(), "/" + name),
      content,
      "utf8",
      (error) => {
        resolve();
        if (error) {
          console.log("发生异常：", error);
          reject(error);
        }
      }
    )
  );
}

function downloadFile({ linkList, output }) {
  // 确保文件目录存在
  ensureDirExistence(output);

  // 失败合集
  const failedInfos = [],
    successInfos = [];

  // 请求完成个数
  let finishCount = 0;

  console.log("start download...");

  // 下载完成
  const onFinish = () => {
    if (finishCount === linkList.length - 1) {
      console.log(`
==========================================================================      
      【文件下载完成】：
        【总下载】数为【${linkList.length}】
        【下载成功】数为【${linkList.length - failedInfos.length}】个
        【下载失败】数为【${failedInfos.length}】个
        ${
          failedInfos.length
            ? "【下载失败详情】可见【 downloadFaild.json 】文件；【下载成功详情】可见【 downloadSuccess.json 】文件"
            : ""
        }
==========================================================================`);

      if (failedInfos.length) {
        const infoData = [
          {
            name: "downloadFaild.json",
            content: JSON.stringify(failedInfos),
          },
          {
            name: "downloadSuccess.json",
            content: JSON.stringify(successInfos),
          },
        ];

        Promise.allSettled(
          infoData.map((item) => {
            return writeFile(item);
          })
        ).then(() => {
          process.exit();
        });
      }
    }
  };

  //   循环下载文件
  for (const { url, name } of linkList) {
    request.get(url, (error, response, body) => {
      finishCount++;

      if (error || response.statusCode !== 200) {
        failedInfos.push({ url, name });
      } else {
        successInfos.push({ url, name });
        request(url).pipe(fs.createWriteStream(path.join(output, name)));
      }

      onFinish();
    });
  }
}

module.exports = {
  downloadFile,
};
