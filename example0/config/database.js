var mysql = require('mysql');
var db_info = {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'kimyun0802!',
    database: 'VlindDate'
}

module.exports = {
    //DB와 서버간의 연결 객체를 반환하는 'init()' 함수와 실제로 데이터 교환을 위해 연결을 시키는 'connect()'함수로 구성됨.
    //createConnection()에는 DB에 대한 정보(db_info)를 매개변수로 넣어주어야 한다.
    init: function () {
        return mysql.createConnection(db_info);
    },
    connect: function(conn) {
        conn.connect(function(err) {
            if(err) console.error('mysql connection error : ' + err);
            else console.log('mysql is connected successfully!');
        });
    }
}