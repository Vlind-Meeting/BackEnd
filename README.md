# BackEnd# Server.js

## Overview

서버는 Nodejs-express를 사용하여 구현했으며 database로는 mysql을 사용했다. 대부분의 request-response는 post, get방식으로 처리했다. 

기본적으로 client에서 request가 들어오면 mysql database에서 필요한 정보를 select, insert, delete 혹은 update하여 결과를 response했다. 

서버에서 request를 처리하는 과정을 그대로 설명하기 보다는 database안에 존재하는 table을 설명하면서 client와 server가 어떻게 request-response하는 지 설명하도록 하겠다.

## Mysql Table 종류

- login
- survey
- match
- final
- fail

## login

![Untitled 1](https://user-images.githubusercontent.com/81549602/148946553-9aafd2d8-b408-4d0c-99f6-aee788558121.png)


login table은 위처럼 user의 name, number, nickname, password, gender로 구분된다. 

사용자가 처음에 회원가입을 하면 정보가 login table에 저장되고, 이후에 로그인을 하면 login table로부터 정보를 불러와 회원이 맞는지 확인한다. 

## Survey

![Untitled 1](https://user-images.githubusercontent.com/81549602/148946620-686327da-cfd8-4a7d-8c8f-3c99ec2c58f1.png)

survey table은 name, number, nickname, password, gender, filename q1, ..., q10, heart_num으로 구성된다.

filename은 사용자의 녹음 파일의 경로를 의미한다.

q1, ..., q10은 사용자가 survey에 응답한 결과 값이다.

heart_num은 사용자가 이성에게 매칭 신청을 보낼 수 있는 하트 개수를 의미하며 최대 1개이다.

사용자가 처음에 회원가입하여 survey를 작성하면 위 survey table에 정보가 등록된다. 이 정보는 이후 사용자와 최적의 매칭 상대를 RMSE 알고리즘을 통해 추론하는 과정에서 사용된다.

그리고 사용자가 이성에게 매칭 요청을 보내는 경우, heart_num이 1에서 0으로 감소하며 더이상 매칭 신청을 보낼 수 없게 된다.

## match

![Untitled](Server%20js%20086c52b473914607a1c607714dda9776/Untitled%202.png)

match table은 send, receive로 구성된다. 

사용자가 이성에게 매칭 신청을 보내는 경우, (사용자의 id, 이성의 id)가 match table에 추가된다. 즉, 사용자가 매칭을 send한 사람, 이성이 매칭을 receive한 사람이 되는 것이다.

반대로 사용자가 이성으로부터 매칭 신청을 받으면, (이성의 id, 사용자의 id)가 match table에 추가된다. 즉, 사용자가 매칭을 receive한 사람, 이성의 매칭을 send한 사람이 된다.

## final

![Untitled](Server%20js%20086c52b473914607a1c607714dda9776/Untitled%203.png)

final table은 send, receive, place, place_url로 구성된다.

매칭 신청을 받은 사람이 매칭 요청을 수락하면 final table에 매칭이 성공한 커플이 추가된다. 그 때, send가 매칭을 요청한 사람, receive가 매칭 요청을 받은 사람이다. 

place는 매칭된 커플이 처음으로 만날 장소의 id이며, place_url도 매칭된 커플이 처음으로 만날 장소 url의 id이다.

매칭이 성립되는 순간 send, receive, place, place_url이 final table에 추가된다.

## fail

![Untitled](Server%20js%20086c52b473914607a1c607714dda9776/Untitled%204.png)

fail table은 send, receive로 구성된다.

매칭 신청을 받은 사람이 매칭 요청을 거절하면 fail table에 두 명의 id가 추가된다. 그 때, send가 매칭을 요청한 사람, receive가 매칭 요청을 받은 사람이다.

매칭이 거절되는 순간 send, receive가 fail table에 추가된다.
