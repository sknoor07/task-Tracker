import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db= new pg.Client({
  user:"postgres",host:"localhost",database:"world",password:"@toxiZ07",port:5432,
});

db.connect();


let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  try{
    const result=  await db.query("Select * from permalist order by id asc");
    if(result){
      items=result.rows;
    }
    }catch(err){
      console.log(err);
  }
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  console.log(item);
  try{
    await db.query("Insert into permalist (task) values ($1) ",[item]);
    res.redirect("/");
  }catch(err){
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const itemId= req.body.updatedItemId;
  try{
    await db.query("update permalist set task =($1) where id=$2",[item,itemId]);
    res.redirect("/");
  }catch(err){
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  const itemId= req.body.deleteItemId;
  try{
    await db.query("delete from permalist where id=$1",[itemId]);
    res.redirect("/");
  }catch(err){
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
