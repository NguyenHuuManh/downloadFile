import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { useState } from "react";

function App() {
  var zip = new JSZip();
  const [numberPage, setNumberPage] = useState(0);
  const baseURL =
    "https://wfs-api.mcredit.com.vn/wfsloan-service/api/v1/web-service/operation/export/user_register/vtp";
  const body = {
    fromDate: "07/10/2022",
    toDate: "07/10/2022",
    username: "operation_wfs",
    password: "Wfs@12345",
  };
  const postData = async (url = "", data = {}) => {
    const response = await axios.post(url, data, {
      responseType: "arraybuffer",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  };

  const fetchApi = async () => {
    const zip = new JSZip();
    const folder = zip.folder("project");
    const urls = [];
    for (let index = 0; index < numberPage; index++) {
      urls.push(`${baseURL}?page=${index + 1}&size=6`);
    }
    Promise.all(
      urls.map(async (url) => {
        return await postData(url, body);
      })
    ).then((arrResponse) => {
      arrResponse.forEach((res, index) => {
        console.log(
          res.headers.get("content-disposition"),
          "===response.headers==="
        );
        console.log(
          res.headers["content-disposition"],
          "===response.headers1==="
        );
        console.log(
          res.headers.get["Content-Disposition"],
          "===response.headers2==="
        );

        const blobFile = new Blob([res.data]);
        folder.file(`${index}.xlsx`, blobFile);
      });
      zip
        .generateAsync({ type: "blob" })
        .then((blob) => saveAs(blob, "Excell"))
        .catch((e) => console.log(e));
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>Nhập số trang</div>
        <input
          type="number"
          onChange={(event) => {
            setNumberPage(event.target.value);
          }}
          value={numberPage}
        />
        <button onClick={fetchApi}>Download</button>
      </header>
    </div>
  );
}

export default App;
