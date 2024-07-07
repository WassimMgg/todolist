import express from "express";
import bodyParser from "body-parser";
import pg from "pg"; 

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "todo",
  password: "29052003",
  port: 5433,
})

db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async(req, res) => {
  let result = await db.query("SELECT * FROM items");
  const items = result.rows; 
  console.log(items);  
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
  await db.query("INSERT INTO items (item) VALUES ($1)", [item])
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const id = req.body.updatedItemId; 
  const title = req.body.updatedItemTitle; 
  await db.query("UPDATE items SET item = $1 WHERE id = $2; ", [title , id]); 
  res.redirect("/"); });
  
app.post("/delete",async (req, res) => {
  const id = req.body.deleteItemId; 
  await db.query("DELETE FROM items WHERE id = $1 ", [id]); 
  res.redirect("/"); 
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
