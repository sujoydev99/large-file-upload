import React, { useEffect, useState } from "react";
import axios from "axios";
const Main = () => {
  const cancelTokenSource = axios.CancelToken.source();

  const [selectedFile, setselectedFile] = useState({});
    const [name, setname] = useState("");
  const [uploadPercent, setuploadPercent] = useState(0);
  
  
  const fileselect = async (e) => {
    let myfile = e.target.files[0];
    console.log(myfile);
    await setselectedFile(myfile);
    await setname(myfile.name);
  };
  const upload = async (e) => {

    let headers = {
      size: selectedFile.size.toString(),
      "x-file-id": selectedFile + "-" + selectedFile.lastModified,
      name: name,
    };
    axios
      .get("http://localhost:5000/file/status", { headers: headers })
      .then((res) => {
        if (res.data.status === "file is present") {
          alert(res.data.status);
          return;
        }
        let uploadedBytes = res.data.uploaded;
        console.log("uploaded bytes", uploadedBytes);
        let headers2 = {
          size: selectedFile.size.toString(),
          "x-file-id": selectedFile + "-" + selectedFile.lastModified,
          "x-start-byte": uploadedBytes.toString(),
          name: name,
          "content-type": "multipart/form-data",
        };

        axios
          .post(
            "http://localhost:5000/file/upload",
            selectedFile.slice(uploadedBytes, selectedFile.size + 1),
            {
              headers: headers2,
              onUploadProgress: function (progressEvent) {
                var percentCompleted = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                setuploadPercent(percentCompleted);
                console.log(percentCompleted);
              },
                         }
          )
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
      });
  };

  return (
    <div>
      <input type="file" name="submit" onChange={fileselect} />
      <input type="submit" name="upload" onClick={upload} />
      <p>{uploadPercent}/100</p>
      
    </div>
  );
};

export default Main;
