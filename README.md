
## Nest.js - member-api server
- github - [https://github.com/develjsw](https://github.com/develjsw)

### member-api 구성

| 위치                              | 설명                                 |
|---------------------------------|------------------------------------|
| member-api                      | 프로젝트 최상단                           |
| member-api > dockerfile         | dockerfile                         |
| member-api > docker-compose.yml | docker-compose.yml |
| member-api > secret             | DB 접속 정보 등 secret file             |
| member-api > src > config       | 환경별 설정 파일, redis-api endpoint 파일   |

### 특이사항

mysql AWS RDB → docker image 사용으로 변경

### docker 실행
~~~
[ 1번 방식 - dockerfile (** RDB 사용시에만 아래 명령어로 진행 **) ]

# member-api 프로젝트로 위치 이동
$ cd /d/www/nest-msa-api/member-api

# 도커 이미지 빌드 (local)
$ docker build -t member-api -f ./dockerfile/Dockerfile-local .

# 도커 컨테이너 실행
$ docker run -d --name member-api -p 3001:8001 member-api

----------------------------------------------------------------
** 문제 발생 시 확인 (docker gui tool을 활용해도 됨) **

# 종료된 컨테이너 재실행
$ docker start member-api

# 컨테이너 로그 확인 
$ docker logs member-api

# 컨테이너 접속하여 정상 실행중인지 확인
$ docker ps
$ docker exec -it <container_id> bash
~~~
~~~
[ 2번 방식 - dockerfile + docker-compose.yml ]

# member-api 프로젝트로 위치 이동
$ cd /d/www/nest-msa-api/member-api

# 이미지 빌드 및 컨테이너 백그라운드로 실행 (local)
$ docker-compose -f docker-compose-local.yml up -d --build
~~~

### docker container ip 확인
~~~
[ 1번 방식 ]

# docker network 조회
$ docker network ls

# 위에서 조회한 값 중에 내가 설정한 네트워크 값으로 조회
$ docker network inspect <docker network name>
ex) docker network inspect member-api_msa-api-network
→ containers에 표시되어 있는 IP를 통해 확인 가능하며, 해당 아이피는 외부 접근이 아닌 container끼리 통신할 때 사용
~~~
~~~
[ 2번 방식 ]

# 컨테이너 접속 (쉘 종류에 따라 사용 가능한 명령어 차이 존재)
$ docker exec -it <container id> </bin/sh | /bin/bash | bash>
ex) docker exec -it a4e61eccfb72 /bin/sh

# 아이피 조회
$ ip addr
~~~
~~~
[ 3번 방식 ]

# 특정 container의 docker network 정보 확인
$ docker inspect "{{ .NetworkSettings }}" <container id>
→ NetworkSettings.Networks.<설정한 네트워크>.IPAddress를 통해 container ip 확인
~~~

### docker container 통신 확인
1. host ↔ api container 통신
    - [ 1번 방식 ] : browser에서 localhost:3001로 접속하여 확인
    - [ 2번 방식 ] : host CLI(cmd/powershell/git bash)에서 아래 명령어 실행
   ~~~
   # host에서 curl 명령어를 통해 확인
   $ curl http://localhost:3001
   ~~~ 
2. api container ↔ db container 통신
   ~~~
   # 컨테이너 접속 (쉘 종류에 따라 사용 가능한 명령어 차이 존재)
   $ docker exec -it <container id> </bin/sh | /bin/bash | bash>
   ex) docker exec -it a4e61eccfb72 /bin/sh
   
   # 'api 컨테이너 내부'에서 '호스트명:db 컨테이너 포트'에 연결되는지 확인
   $ telnet host.docker.internal:3306
   ~~~
3. api container ↔ api container 통신  
   컨테이너 사이의 네트워크가 서로 다른 경우 기본적으로 통신 불가  
   다만, host.docker.internal (docker에서 host의 localhost와 같은 개념으로 Linux OS를 제외한 OS에서 바로 사용 가능한 키워드)를 통해 통신 가능       
   <br>
   localhost를 사용하지 못하고 'host.docker.internal:외부 포트'를 통해 통신하는 이유는
   container마다 localhost가 존재하기 때문   
   <br>
   (참고 : 같은 네트워크 안에 있는 container들 사이의 통신은 docker network inspect <container id> 명령어를 통해 확인 가능한 ip로 통신 가능. 단, ip를 알고 있어야 한다는 단점 존재)   
   ~~~
   # member-api container에 접속
   $ docker exec -it <container id> /bin/sh
   ex) docker exec -it a4e61eccfb72 /bin/sh
   
   # 네트워크가 다른 api container와 통신 
   $ curl http://host.docker.internal:외부 포트
   ex) curl http://host.docker.internal:3002 # goods-api와 통신 
   ex) curl http://host:docker.internal:3003 # payment-api와 통신 
   ex) curl http://host:docker.internal:9001 # redis-api와 통신 
   ~~~
   
### DB 접속 확인
host에서 DB client tool을 사용하여 docker-compose.yml 파일에서 설정한 ports 값, environment의 MYSQL_USER, MYSQL_PASSWORD값으로 접속 확인   
ex)   
- host : localhost,   
- port : 33061,   
- user : admin,   
- password : test1234//  

### 컨테이너 오케스트레이션 사용 예정
(Docker Swarm 또는 Kubernetes)