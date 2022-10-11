import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { useState } from "react";
import dayjs from "dayjs";

function App() {
  const [numberPage, setNumberPage] = useState(0);
  const [numberSize, setNumberSize] = useState(0);
  const [dateFrom, setDateFrom] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    Promise.all(
      urls.map(async (url) => {
        return await postData(url, {
          ...body,
          fromDate: dayjs(dateFrom).format("DD/MM/YYYY"),
          toDate: dayjs(dateTo).format("DD/MM/YYYY"),
        });
      })
    )
      .then((arrResponse) => {
        arrResponse.forEach((res, index) => {
          const blobFile = new Blob([res.data]);
          folder.file(`${index}.xlsx`, blobFile);
        });
        zip
          .generateAsync({ type: "blob" })
          .then((blob) => saveAs(blob, "Excell"))
          .catch((e) => console.log(e));
      })
      .finally(() => setLoading(false));
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
        {/* <input
          type="number"
          onChange={(event) => {
            setNumberPage(event.target.value);
          }}
          value={numberPage}
        /> */}
        <div style={{ display: "flex", marginBottom: 10 }}>
          <div style={{ marginRight: 10 }}>
            <div>Ngày bắt đầu</div>
            <input
              type="date"
              onChange={(event) => {
                setDateFrom(event.target.value);
              }}
              value={dateFrom}
            />
          </div>
          <div>
            <div>Ngày kết thúc</div>
            <input
              type="date"
              onChange={(event) => {
                setDateTo(event.target.value);
              }}
              value={dateTo}
            />
          </div>
        </div>

        {loading ? (
          <div>loading........</div>
        ) : (
          <button onClick={fetchApi}>Download</button>
        )}
      </header>
    </div>
  );
}

export default App;
