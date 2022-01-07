var express = require('express');
var app = express();
//아래 config 폴더 안의 database.js 파일을 불러오기 위한 것
var db_config = require(__dirname + '/config/database.js');
var conn = db_config.init();
db_config.connect(conn);

/* app.set(key, value)는 express 인스턴스에 변수들을 저장할 수 있다.
app.use는 미들웨어 함수로 앱이 요청을 수신할 때마다 실행된다.
미들웨어 함수는 req(요청) 객체, res(응답) 객체, 그리고 어플리케이션 요청-응답 사이클 도중 그 다음의 미들웨어 함수에 대한 엑세스 권한을 갖는 함수이다.
즉, 요청-응답 사이클 중간에 목적에 맞게 실행되는 거쳐가는 함수들이다.
이 미들웨어들을 어떨 때 사용하면 편리하냐면 페이지를 렌더링할 때 사용자 인증을 앞서 거친 후에 렌더링하고 싶을 때 사용자 인증 미들웨어를 작성하고 앞에 삽입하게 되면 편리하다.
app.use('/user/:id', function(req, res, next){})의 경우, /user/:id 경로에 마운트되는 미들웨어 함수가 표시되어 있습니다.
이 함수는 /user/:id 경로에 대한 모든 유형의 HTTP 요청에 대해 실행된다.*/

app.set('port', process.env.PORT || 80);



app.get('/login', (req, res) => {
  conn.query('SELECT * from login', (error, rows) => {
    if (error) throw error;
    console.log('User info is: ', rows);
    res.send(rows);
  });
});

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});

