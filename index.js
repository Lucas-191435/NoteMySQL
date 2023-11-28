const express = require("express");
const exphbs = require("express-handlebars");
const mysql = require("mysql");

const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());
app.use(express.static("public"));

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "nodemysql",
});

conn.connect(function (err) {
  if (err) {
    console.log("entrou no erro");
    console.log(err);
  } else {
    console.log("Conectou ao MySQL");
    // Agora que a conexão foi estabelecida, podemos iniciar o servidor
    app.listen(3000, () => {
      console.log("Servidor Express funcionando na porta 3000");
    });
  }
});

app.get("/", (req, res) => {
  res.render("home");
});

app.post("/books/insertbook", (req, res) => {
  const { title, pageqty } = req.body;
  console.log(req.body);
  const sql = `INSERT INTO books (title, pageqty) VALUES ('${title}', '${pageqty}')`;
  conn.query(sql, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/books");
    }
  });
});

app.get("/books", (req, res) => {
  const sql = "SELECT * FROM books";
  conn.query(sql, function (err, data) {
    if (err) {
      console.log(err);
    }
    const books = data;
    res.render("books", { books });
  });
});

app.get("/books/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM books WHERE id = " + id;
  conn.query(sql, function (err, data) {
    if (err) {
      console.log(err);
    }
    const book = data[0];
    res.render("book", { book });
  });
});

app.get("/books/edit/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM books WHERE id = " + id;
  conn.query(sql, function (err, data) {
    if (err) {
      console.log(err);
    }
    const book = data[0];
    res.render("editbook", { book });
  });
});

app.post("/books/updatebook", (req, res) => {
  const { id, title, pageqty } = req.body;
  const sql =
    `UPDATE books SET title = '${title}', pageqty = '${pageqty}' WHERE id = ` +
    id;

  conn.query(sql, function (err, data) {
    if (err) {
      console.log(err);
      return;
    }

    res.render("books");
  });
});



app.post("/books/remove/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM books WHERE id = " + id;
  conn.query(sql, function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect("/books");
  });
});