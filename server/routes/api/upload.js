const express = require("express");
const router = express.Router();
const fs = require("fs");
let uploads = {};

router.post("/upload", (req, res, next) => {
  try {
    let fileId = req.headers["x-file-id"];
    let startByte = parseInt(req.headers["x-start-byte"], 10);
    let name = req.headers["name"];
    let fileSize = parseInt(req.headers["size"], 10);
    console.log("file Size", fileSize, fileId, startByte);
    if (uploads[fileId] && fileSize == uploads[fileId].bytesReceived) {
      res.end();
      return;
    }

    console.log(fileSize);

    if (!fileId) {
      res.writeHead(400, "No file id");
      res.end(400);
    }
    console.log(uploads[fileId]);
    if (!uploads[fileId]) uploads[fileId] = {};

    let upload = uploads[fileId];

    let fileStream;

    if (!startByte) {
      upload.bytesReceived = 0;
      let name = req.headers["name"];
      fileStream = fs.createWriteStream(`./name/${name}`, {
        flags: "w",
      });
    } else {
      if (upload.bytesReceived != startByte) {
        res.writeHead(400, "Wrong start byte");
        res.end(upload.bytesReceived);
        return;
      }
      // append to existing file
      fileStream = fs.createWriteStream(`./name/${name}`, {
        flags: "a",
      });
    }

    req.on("data", function (data) {
      //console.log("bytes received", upload.bytesReceived);
      upload.bytesReceived += data.length;
    });

    req.pipe(fileStream);

    // when the request is finished, and all its data is written
    fileStream.on("close", function () {
      console.log(upload.bytesReceived, fileSize);
      if (upload.bytesReceived == fileSize) {
        console.log("Upload finished");
        delete uploads[fileId];

        // can do something else with the uploaded file here
        res.send({ status: "uploaded" });
        res.end();
      } else {
        // connection lost, we leave the unfinished file around
        console.log("File unfinished, stopped at " + upload.bytesReceived);
        res.writeHead(500, "Server Error");
        res.end();
      }
    });

    // in case of I/O error - finish the request
    fileStream.on("error", function (err) {
      console.log("fileStream error", err);
      res.writeHead(500, "File error");
      res.end();
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/status", (req, res) => {
  console.log("came");

  let fileId = req.headers["x-file-id"];
  let name = req.headers["name"];
  let fileSize = parseInt(req.headers["size"], 10);
  console.log("name", name);
  if (name) {
    try {
      let stats = fs.statSync("name/" + name);
      console.log(stats.isFile());
      if (stats.isFile()) {
        console.log(
          `fileSize is ${fileSize} and already uploaded file size ${stats.size}`
        );
        if (fileSize == stats.size) {
          res.send({ status: "file is present", uploaded: stats.size });
          return;
        }
        if (!uploads[fileId]) uploads[fileId] = {};
        console.log(uploads[fileId]);
        uploads[fileId]["bytesReceived"] = stats.size;
        console.log(uploads[fileId], stats.size);
      }
    } catch (er) {}
  }
  let upload = uploads[fileId];
  if (upload) res.send({ uploaded: upload.bytesReceived });
  else res.send({ uploaded: 0 });
});

module.exports = router;
