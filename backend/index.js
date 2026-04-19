
/* 
    Referenced: https://www.geeksforgeeks.org/reactjs/how-to-connect-mongodb-with-reactjs/
    https://www.youtube.com/watch?v=H8Sh9_n1MPA
    https://medium.com/@sergio13prez/connecting-to-mongodb-atlas-d1381f184369
    https://www.w3schools.com/tags/tag_li.asp
    https://cheerio.js.org/
*/
const dns = require("node:dns");
dns.setDefaultResultOrder("ipv4first");

require("dotenv").config({path: __dirname + "/.env"});
const connectDB = require("./server/db");
const app = require("./server/app");

const PORT = process.env.PORT || 5000;

(async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})();
