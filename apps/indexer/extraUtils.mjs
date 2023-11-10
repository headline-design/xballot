const bodyParser = require("body-parser");
const path = require("path");

//dotenv.config()
//format: {appId:{round: 1:[]}}

function saveFile(name, body) {
    let newPath = "data/db/" + name + ".txt";

    //let newPath = path.resolve(newPathBase)

    fs.writeFile(newPath, body, (err) => {
      if (err) {
        console.log("Error saving");
      } else {
        console.log("It's saved!");
        console.log("Path: ", newPath);
      }
    });
  }

  function loadFile(name) {
    let newPath = "/data/db/" + name + ".txt";

    if (fs.existsSync(newPath)) {
      let fileContents = fs.readFileSync(newPath);
      let obj = JSON.parse(fileContents.toString());
      //console.log(obj)
      gmaeWorld = obj;
      console.log("Loaded database");
      return obj;
    } else {
      console.log("No database found. Will be created on next backup.");
      return {};
    }
  }

  loadFile("backup");

  async function getDomains() {
    try {
      let data = await fetch(
        "https://xballot-registrar-mainnet.onrender.com/index/daos"
      );
      let dataJSON = await data.json();
      let keys = Object.keys(dataJSON);

      keys.forEach((key, i) => {
        keys[i] = parseInt(key);
      });
      domains = keys;
      return keys;
    } catch (e) {
      return [];
    }
  }

  const cors = require("cors");
app.use(cors(), express.json());