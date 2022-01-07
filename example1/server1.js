var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var db_config = require(__dirname + '/config/database.js');
var conn = db_config.init();
db_config.connect(conn);

app.use(bodyParser.urlencoded({extended:true})); 
app.use(bodyParser.json());

app.post(`/join`, (req, res) => {
  let name = req.body.name;
  let number = req.body.number;
  let nickname = req.body.nickname;
  let password = req.body.password;
  let gender = req.body.gender;

  res.send("post success");

  let sql = "INSERT INTO login VALUES(?, ?, ?, ?, ?)";
  let params = [name, number, nickname, password, gender];


  conn.query(sql, params, function(err,rows,fields) {
    if(err){
      console.log(err);
    }else{
      console.log(rows);
    }
  });
})

app.get('/login', (req, res) =>{
  let user_number = req.query.user_number;
  let sql = "SELECT * from login where number = \'" + user_number + "\';";
  conn.query(sql, function(err,rows,fields) {
    if (err) {
      throw err;
    }
    else{
      if(rows[0] == undefined){
        res.json({
          number: "failed",
          password: "failed"
        });
      }
      else{
      res.json({
        number: rows[0].number,
        password: rows[0].password
      });
      console.log(rows[0].number);
      console.log(rows[0].password);
      }
    }
  });
})


app.listen(80, () => {
  console.log(`서버 실행, 포트 번호 80`);
});