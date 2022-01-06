const express = require('express');
const app = express();

app.get('/',function(요청,응답){
  응답.send('여기는 나의 작업용 페이지입니다.');
})
;
app.listen(443, function(){
  console.log('Listening at 80');
});