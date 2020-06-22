import { app, BrowserWindow, screen } from "electron";
import * as path from "path";
import * as url from "url";
import axios from "axios";
import * as fs from "fs";
import * as csv from "csv-parser";
import * as util from "util";

let win: BrowserWindow = null;

const args = process.argv.slice(1),
  serve = args.some((val) => val === "--serve");

function createWindow(): BrowserWindow {
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: serve ? true : false,
    },
  });

  if (serve) {
    require("devtron").install();
    win.webContents.openDevTools();

    require("electron-reload")(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`),
    });
    win.loadURL("http://localhost:4200");
  } else {
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, "dist/index.html"),
        protocol: "file:",
        slashes: true,
      })
    );
  }

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

try {
  app.allowRendererProcessReuse = true;

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on("ready", () => setTimeout(createWindow, 400));

  // Quit when all windows are closed.
  app.on("window-all-closed", () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });
} catch (e) {
  // Catch Error
  // throw e;
} finally {
  downloadCSV()
    .then((d) => {
      const data: Array<{}> = [];
      const readPath = path.resolve(
        __dirname,
        "src",
        "assets",
        "csv",
        "listings.csv"
      );
      const writePath = path.resolve(
        __dirname,
        "src",
        "assets",
        "json",
        "listings.json"
      );
      fs.createReadStream(readPath)
        .pipe(csv())
        .on("data", (row) => {
          data.push(row);
        })
        .on("end", () => {
          try {
            fs.writeFileSync(writePath, JSON.stringify(data, null, 2));
          } catch {
            console.log("unable to write listings.json file");
          }
        });
    })
    .catch((e) => console.log("unable to download listings.csv for NSE"));
}

async function downloadCSV() {
  const url =
    "https://www1.nseindia.com/corporates/datafiles/LDE_EQUITIES_MORE_THAN_5_YEARS.csv";
  const pathName = path.resolve(
    __dirname,
    "src",
    "assets",
    "csv",
    "listings.csv"
  );
  console.log("path name -- ", pathName);
  const writer = fs.createWriteStream(pathName);
  const response = await axios({
    url: url,
    method: "GET",
    responseType: "stream",
  });
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}
