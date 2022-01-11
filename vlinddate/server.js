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
  let sql = "SELECT * from survey where number = \'" + user_number + "\';";
  conn.query(sql, function(err,rows,fields) {
    if (err) {
      throw err;
    }
    else{
      if(rows[0] == undefined){
        res.json({
          number: "failed",
          password: "failed",
          filename: "failed",
          nickname: "failed",
          name: "failed"
        });
      }
      else{
      res.json({
        number: rows[0].number,
        password: rows[0].password,
        filename: rows[0].filename,
        nickname: rows[0].nickname,
        name: rows[0].name
      });
      console.log(rows[0].number);
      console.log(rows[0].password);
      }
    }
  });
})

app.post(`/survey_insert`, (req, res) => {
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

  let sql = "INSERT INTO survey VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  let params = [name, number, nickname, password, gender, filename, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, 3];
  conn.query(sql, params, function(err, rows, fields) {
    if (err)
      throw err;
    else{
      console.log(rows)
    }
  });
  res.send("succeed");
});



app.get(`/survey_match`, (req, res) => {
  let number = req.query.user_number;
  let name, nickname, password, gender, filename, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, heart_num; 
  let sql0 = "select * from survey where number = \'" + number + "\';";
  let params0 = ['woman', number, number, number, number, number, number];
  conn.query(sql0, function(err, rows, field){
    if (err)
      throw err;
    else{
      name = rows[0].name;
      number = rows[0].number;
      nickname = rows[0].nickname;
      password = rows[0].password;
      gender = rows[0].gender;
      filename = rows[0].filename;
      q1 = rows[0].q1;
      q2 = rows[0].q2;
      q3 = rows[0].q3;
      q4 = rows[0].q4;
      q5 = rows[0].q5;
      q6 = rows[0].q6;
      q7 = rows[0].q7;
      q8 = rows[0].q8;
      q9 = rows[0].q9;
      q10 = rows[0].q10;
      heart_num = rows[0].heart_num;
      if(gender == "woman")
        params0 = ['man', number, number, number, number, number, number];
      let sql = "select * from survey where gender = ? and number not in (select send from `match` where receive = ?) and number not in (select receive from `match` where send = ?) and number not in (select send from final where receive = ?) and number not in (select receive from final where send = ?) and number not in (select send from fail where receive = ?) and number not in (select receive from fail where send = ?)" ;
      conn.query(sql, params0, function(err, rows, fields){
          if (err)
            throw(err);
          else{
            console.log(3)
            console.log(rows);
            console.log(4)
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
            console.log(val);
            console.log(arr)
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
            console.log(rows[i1])
            console.log(rows[i2])
            console.log(rows[i3])
            
            res.json({
              nickname1: rows[i1].nickname,
              filename1: rows[i1].filename,
              number1: rows[i1].number,
              nickname2: rows[i2].nickname,
              filename2: rows[i2].filename,
              number2: rows[i2].number,
              nickname3: rows[i3].nickname,
              filename3: rows[i3].filename,
              number3: rows[i3].number,
              heart_num: heart_num
            })
          }
        });
  }
  });
});




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

  let sql = "INSERT INTO survey VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  let params = [name, number, nickname, password, gender, filename, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, 1];
  conn.query(sql, params, function(err, rows, fields) {
    if (err)
      throw err;
    else{
      console.log(rows);
    }
  });

  let sql0 = "select * from survey where gender = ? and number not in (select send from `match` where receive = ?) and number not in (select receive from `match` where send = ?) and number not in (select send from final where receive = ?) and number not in (select receive from final where send = ?) and number not in (select send from fail where receive = ?) and number not in (select receive from fail where send = ?)" ;

  let params0 = ["man", number, number, number, number, number, number];
  if(gender === "man")
    params0 = ["woman", number, number, number, number, number, number];
    
  conn.query(sql0, params0, function(err, rows, fields){
    if (err)
      throw(err)
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
        number1: rows[i1].number,
        nickname2: rows[i2].nickname,
        filename2: rows[i2].filename,
        number2: rows[i2].number,
        nickname3: rows[i3].nickname,
        filename3: rows[i3].filename,
        number3: rows[i3].number,
        heart_num: 1
      })
    }
  });
  
})

app.post(`/heart_num`, (req, res) => {
  let heart_num = req.body.heart_num;
  let send_number = req.body.send_number;
  let receive_number = req.body.receive_number;
  let gender, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10


  let sql0 = "update survey set heart_num = ? where number = ?";
  let params0 = [heart_num, send_number];
  console.log('!!!!!!!!!')
  console.log(heart_num);
  console.log(send_number);
  console.log(receive_number);

  conn.query(sql0, params0, function(err, rows, fields){
    if (err)
      throw err;
    else{
      let sql = "insert into `match` values(?, ?)";
      let params = [send_number, receive_number];
      conn.query(sql, params, function(err, row2, fields){
        if(err)
          throw err;
        else{
          let sql1 = "select * from survey where number = \'" + send_number + "\';";
          conn.query(sql1, function(err, row1, field){
            if (err)
              throw err;
            else{
              gender = row1[0].gender;
              q1 = row1[0].q1;
              q2 = row1[0].q2;
              q3 = row1[0].q3;
              q4 = row1[0].q4;
              q5 = row1[0].q5;
              q6 = row1[0].q6;
              q7 = row1[0].q7;
              q8 = row1[0].q8;
              q9 = row1[0].q9;
              q10 = row1[0].q10;
              let params2 = ['woman', send_number, send_number, send_number, send_number, send_number, send_number];
              if(gender == "woman")
                params2 = ['man', send_number, send_number, send_number, send_number, send_number, send_number];

              let sql2 = "select * from survey where gender = ? and number not in (select send from `match` where receive = ?) and number not in (select receive from `match` where send = ?) and number not in (select send from final where receive = ?) and number not in (select receive from final where send = ?) and number not in (select send from fail where receive = ?) and number not in (select receive from fail where send = ?)" ;
              conn.query(sql2, params2, function(err, rows, fields){
                if (err)
                  throw(err);
                else{
                  console.log(3)
                  console.log(rows);
                  console.log(4)
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
                  console.log(val);
                  console.log(arr)
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
                  console.log(rows[i1])
                  console.log(rows[i2])
                  console.log(rows[i3])
                  
                  res.json({
                    nickname1: rows[i1].nickname,
                    filename1: rows[i1].filename,
                    number1: rows[i1].number,
                    nickname2: rows[i2].nickname,
                    filename2: rows[i2].filename,
                    number2: rows[i2].number,
                    nickname3: rows[i3].nickname,
                    filename3: rows[i3].filename,
                    number3: rows[i3].number,
                    heart_num: heart_num
                  })
                }
              });
            }
          });

        }
      });

    }
  });

});

app.post(`/nickname_change`, (req, res) => {
  let new_nickname = req.body.new_nickname;
  let number = req.body.number;

  let sql = "update survey set nickname = ? where number = ? ;"
  let params = [new_nickname, number];

  conn.query(sql, params, function(err, rows, field){
    if (err)
      throw err;
    else{
      res.send("succeed");
    }
  });
});

app.post(`/password_change`, (req, res) => {
  let new_password = req.body.new_password;
  let number = req.body.number;

  let sql = "update survey set nickname = ? where number = ? ;"
  let params = [new_password, number];

  conn.query(sql, params, function(err, rows, field){
    if (err)
      throw err;
    else{
      res.send("succeed");
    }
  });
});

app.get(`/message_send`, (req, res) => {
  let user_number = req.query.user_number;
  let sql0 = "select receive from `match` where send = ?";
  let parmas0 = [user_number];
  let result = [];
  conn.query(sql0, parmas0, function(err, row0, field){
    if(err)
      throw err;
    else{
      let n = row0.length;
      for(let i = 0; i < n; i++){
        let receive_number = row0[i].receive;
        let sql = "select nickname from survey where number = ?"
        let params = [receive_number];
        conn.query(sql, params, function(err, rows, field){
          if(err)
            throw(err);
          else{
            result.push({
              nickname: rows[0].nickname,
              user_number: receive_number
            });
          }
        })
      }
    setTimeout(function(){ 
      res.send(result);
    }, 10);
    }
  })

});


app.get(`/message_receive`, (req, res) => {
  let user_number = req.query.user_number;
  let sql0 = "select send from `match` where receive = ?";
  let parmas0 = [user_number];
  let result = [];
  conn.query(sql0, parmas0, function(err, row0, field){
    if(err)
      throw err;
    else{
      let n = row0.length;
      for(let i = 0; i < n; i++){
        let send_number = row0[i].send;
        let sql = "select nickname, filename from survey where number = ?"
        let params = [send_number];
        conn.query(sql, params, function(err, rows, field){
          if(err)
            throw(err);
          else{
            result.push({
              nickname: rows[0].nickname,
              filename: rows[0].filename,
              user_number: send_number,

            });
          }
        })
      }
    setTimeout(function(){ 
      res.send(result);
    }, 10);
    }
  })

});

app.post(`/match_success`, (req, res) =>{
  let send_number = req.body.send_number;
  let receive_number = req.body.receive_number;
  let sql0 = "delete from `match` where (receive = ? and send = ?) or (receive = ? and send = ?);";
  let params0 = [receive_number, send_number, send_number, receive_number];
  conn.query(sql0, params0, function(err, row0, field){
    if(err)
      throw(err)
    else{
      let sql = "insert into final values (?, ?, ?, ?);";
      let n = Math.floor(Math.random()*10);
      let params = [send_number, receive_number, n, n];
      conn.query(sql, params, function(err, rows, field){
        if(err)
          throw(err)
        else{
          let sql1 = "select nickname from survey where number = ?;";
          let params1 = [send_number];
          conn.query(sql1, params1, function(err, row1, field){
            if(err)
              throw(err)
            else{
              let sql2 = "select nickname from survey where number = ?;";
              let params2 = [receive_number];
              conn.query(sql2, params2, function(err, row2, field){
                if(err)
                  throw(err)
                else{
                  res.json({
                    send_number: row1[0].nickname,
                    receive_number: row2[0].nickname,
                    n: String(n)
                  });
                }
              })
            }
          }) 
        }
      });
    }
  });
});

app.post(`/match_fail`, (req, res) =>{
  let send_number = req.body.send_number;
  let receive_number = req.body.receive_number;
  let sql0 = "delete from `match` where (receive = ? and send = ?) or (receive = ? and send = ?);";
  let params0 = [receive_number, send_number, send_number, receive_number];
  conn.query(sql0, params0, function(err, row0, field){
    if(err)
      throw(err)
    else{
      let sql = "insert into fail values (?, ?);";
      let params = [send_number, receive_number];
      conn.query(sql, params, function(err, rows, field){
        if(err)
          throw(err)
        else
          res.send("fail_success");
      });
    }
  });
});

app.get(`/match_check`, (req, res) => {
  let user_number = req.query.user_number;
  let sql = "select * from final where send = ?";
  let params = [user_number];
  conn.query(sql, params, function(err, rows, field){
    if(err)
      throw(err)
    else{
      if(rows[0] == undefined){
        res.json({
          send_number: "failed",
          receive_number: "failed",
          n: "failed",
          result: "failed"
        });
      }
      else{
        let sql1 = "select nickname from survey where number = ?;";
        let params1 = [user_number];
        conn.query(sql1, params1, function(err, row1, field){
          if(err)
            throw(err)
          else{
            let sql2 = "select nickname from survey where number = ?;";
            let params2 = [rows[0].receive];
            conn.query(sql2, params2, function(err, row2, field){
              if(err)
                throw(err)
              else{
                res.json({
                  send_number: row1[0].nickname,
                  receive_number: row2[0].nickname,
                  n: String(rows[0].place),
                  result: "success"
                });
              }
            })
          }
        });
      } 
    }
  });

})


const inputSend = (callback, user_number) => {
  callback(user_number);
}

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