// import {RMSE, MBTI} from './matching/matching.js';
// const {RMSE, MBTI}  = require('./matching/matching.cjs');
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

  let sql_check = "SELECT * from login where number = \'" + number + "\';";
  let sql = "INSERT INTO login VALUES(?, ?, ?, ?, ?)";
  let params = [name, number, nickname, password, gender];
  conn.query(sql_check, function(err, rows, fields) {
    if (err)
      throw err;
    else{
      if(rows[0] == undefined){
        conn.query(sql, params, function(err,rows,fields) {
          if(err){
            console.log(err);
          }else{
            console.log(rows);
          }
        });
        res.send("succeed");
      }
      else{
        res.send("failed");
      }
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

app.post(`/survey`, (req, res) => {
  let name = req.body.name;
  let number = req.body.number;
  let nickname = req.body.nickname;
  let password = req.body.password;
  let gender = req.body.gender;
  let filename = req.body.filename;
  let q1 = req.body.q1;
  let q2 = req.body.q2;
  let q3 = req.body.q3;
  let q4 = req.body.q4;
  let q5 = req.body.q5;
  let q6 = req.body.q6;
  let q7 = req.body.q7;
  let q8 = req.body.q8;
  let q9 = req.body.q9;
  let q10 = req.body.q10;

  let sql = "INSERT INTO survey VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  let params = [name, number, nickname, password, gender, filename, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10];
  conn.query(sql, params, function(err, rows, fields) {
    if (err)
      throw err;
    else{
      console.log(rows);
    }
  });

  let sql0 = "select * from survey where gender = ?" ;

  let params0 = ["man"];
  if(gender === "man")
    params0 = ["woman"];
    
  conn.query(sql0, params0, function(err, rows, fields){
    if (err)
      throw(err);
    else{
      console.log(rows);
      let n = rows.length;
      let val = new Array(n);
      let arr = new Array(n);
      let i;
      for(i = 0; i < n ; i++){
        let row = rows[i];
        let v = RMSE(q1, q2, q3, q4, q5, q6, q7, q8, q9, row.q1, row.q2, row.q3, row.q4, row.q5, row.q6, row.q7, row.q8, row.q9) + 0.3*MBTI(q10, row.q10);
        val[i] = v;
        arr[i] = v;
      }
      val.sort(function(a, b) {
        return a - b;
      });
      let m1 = val[0];
      let m2 = val[1];
      let m3 = val[2];
      let i1, i2, i3;
      let j;
      for(j = 0; j < n; j++){
        if(arr[j] === m1)
          i1 = j;
        else if(arr[j] === m2)
          i2 = j;
        else if(arr[j] === m3)
          i3 = j;
      }
      res.json({
        nickname1: rows[i1].nickname,
        filename1: rows[i1].filename,
        nickname2: rows[i2].nickname,
        filename2: rows[i2].filename,
        nickname3: rows[i3].nickname,
        filename3: rows[i3].filename
      })
    }
  });
  
})

app.listen(80, () => {
  console.log(`서버 실행, 포트 번호 80`);
});


const RMSE = (x1, x2, x3, x4, x5, x6, x7, x8, x9, q1, q2, q3, q4, q5, q6, q7, q8, q9) => {
  let result = Math.sqrt((Math.pow(x1-q1,2)*0.999 + Math.pow(x2-q2,2)*0.998 + Math.pow(x3-q3, 2)*0.997
  + Math.pow(x4-q4,2)*1.001 + Math.pow(x5-q5,2)*1.002 + Math.pow(x6-q6, 2)*1.003
  + Math.pow(x7-q7,2)*1.004 + Math.pow(x8-q8,2)*0.996 + Math.pow(x9-q9, 2))*0.995/9);
  return result;
};

const MBTI = (m1, m2) => {
  let arr = [
      [4, 4, 4, 5, 4, 5, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1],
      [4, 4, 5, 4, 5, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1],
      [4, 5, 4, 4, 4, 4, 4, 5, 1, 1, 1, 1, 1, 1, 1, 1],
      [5, 4, 4, 4, 4, 4, 4, 4, 5, 1, 1, 1, 1, 1, 1, 1],
      [4, 5, 4, 4, 4, 4, 4, 5, 3, 3, 3, 3, 2, 2, 2, 2],
      [5, 4, 4, 4, 4, 4, 5, 4, 3, 3, 3, 3, 2, 2, 2, 2],
      [4, 4, 4, 4, 4, 5, 4, 4, 3, 3, 3, 3, 2, 2, 2, 5],
      [4, 4, 5, 4, 5, 4, 4, 4, 3, 3, 3, 3, 2, 2, 2, 2],
      [1, 1, 1, 5, 3, 3, 3, 3, 2, 2, 2, 2, 3, 5, 3, 5],
      [1, 1, 1, 1, 3, 3, 3, 3, 2, 2, 2, 2, 5, 3, 5, 3],
      [1, 1, 1, 1, 3, 3, 3, 3, 2, 2, 2, 2, 3, 5, 3, 5],
      [1, 1, 1, 1, 3, 3, 3, 3, 2, 2, 2, 2, 5, 3, 3, 3],
      [1, 1, 1, 1, 2, 3, 2, 2, 3, 5, 3, 5, 4, 4, 4, 4],
      [1, 1, 1, 1, 2, 3, 2, 2, 5, 3, 5, 3, 4, 4, 4, 4],
      [1, 1, 1, 1, 2, 3, 2, 2, 3, 5, 3, 3, 4, 4, 4, 4],
      [1, 1, 1, 1, 2, 3, 5, 2, 5, 3, 5, 3, 4, 4, 4, 4]
  ]
  let i = trans(m1);
  let j = trans(m2);
  return 6 - arr[i][j];
}
const trans = (m) => {
  if(m === "INFP")
      return 0;
  else if(m === "ENFP")
      return 1;
  else if(m === "INFJ")
      return 2;
  else if(m === "ENFJ")
      return 3;
  else if(m === "INTJ")
      return 4;
  else if(m === "ENTJ")
      return 5;
  else if(m === "INTP")
      return 6;
  else if(m === "ENTP")
      return 7;
  else if(m === "ISFP")
      return 8;
  else if(m === "ESFP")
      return 9;
  else if(m === "ISTP")
      return 10;
  else if(m === "ESTP")
      return 11;
  else if(m === "ISFJ")
      return 12;
  else if(m === "ESFJ")
      return 13;
  else if(m === "ISTJ")
      return 14;
  else if(m === "ESTJ")
      return 15;
  else
      return null;
}