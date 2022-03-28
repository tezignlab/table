
<br />
<p align="center">
  <img width="240" src="https://user-images.githubusercontent.com/12091906/152910229-6a1187bb-e06a-43a0-acb3-bbbc8c83c8f5.png"/>  
  <br />
  <h2 align="center">TAble - Tezign enAbles</h2>
  <p align="center">an open source full-stack web and mobile application launcher</p>
</p>
<p align="center">
  <a href="https://github.com/tezignlab/table/issues">
    <img src="https://img.shields.io/github/issues/tezignlab/table"/> 
  </a>
  <a href="https://github.com/tezignlab/table/network/members">
    <img src="https://img.shields.io/github/forks/tezignlab/table"/> 
  </a>  
  <a href="https://github.com/tezignlab/table/stargazers">
    <img src="https://img.shields.io/github/stars/tezignlab/table"/> 
  </a>
  <a href="https://github.com/tezignlab/table/LICENSE">
    <img src="https://img.shields.io/github/license/tezignlab/table"/> 
  </a>
</p>
<p align="center">
  <a href="https://reactjs.org/">
    <img src="https://img.shields.io/badge/React-2D333B?style=for-the-badge&logo=React&logoColor=61dafb"/> 
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=fff"/> 
  </a>
  <a href="https://umijs.org/">
    <img src="https://img.shields.io/badge/UmiJS-0170FE?style=for-the-badge&logo=Ant-Design&logoColor=fff"/> 
  </a>
  <a href="https://tailwindcss.com/">
    <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=Tailwind-CSS&logoColor=fff"/> 
  </a>
  <a href="https://www.python.org/">
    <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=Python&logoColor=fff"/> 
  </a>
  <a href="https://fastapi.tiangolo.com/">
    <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=FastAPI&logoColor=fff"/> 
  </a>
  <a href="https://www.mongodb.com/">
    <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=fff"/> 
  </a>
</p>

<p align="center">
<img width="800" src="https://user-images.githubusercontent.com/595772/154817942-3e7f8c43-2591-4f13-a0ae-032751bcda25.png">
</p>

<p align="center">
<img height="500" src="https://user-images.githubusercontent.com/595772/154818228-2297e605-dc73-40b0-8e21-5ccffb7fff6a.jpg">
<img height="500" src="https://user-images.githubusercontent.com/595772/154818230-fcbc5a58-b5d1-4d22-b1a6-73fb622e9224.jpg">
</p>

## Quick Start

Get the source code from [https://github.com/tezignlab/table](https://github.com/tezignlab/table)

You can setup Table on a local computer via a few simple steps:

Clone the repo and switch to the folder:

```
git clone https://github.com/tezignlab/table.git
cd table
```

Start [docker](https://www.docker.com/products/docker-desktop) and run all services using the following command:

```
docker-compose up --build --force-recreate
```

This creates two new data folders: `data_es` and `data_mongo`. 

Load the sample data (choose from English or Chinese data):

```shell
# English data
docker exec -it table_apiserver python3 init.py

# Chinese data
# docker exec -it table_apiserver bash -c "export DATA_LANG=zh && python3 init.py"
```

Open [http://localhost:8000](http://localhost:8000) with your browser to see Table web application.

## Development

### Run Backend Server

This is a [FastAPI](https://github.com/tiangolo/fastapi) project.

```shell
cd backend/

# setup and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# install packages
pip3 install -r requirements.txt

# run
python3 run.py
```

Run the tests with:

```
pytest
```
`pytest` will run all files of the form `test_*.py` or `*_test.py` in the current directory and its subdirectories.


### Run Frontend Web Application Server

The frontend is a [UmiJS](https://umijs.org/) project bootstrapped with [`@umijs/umi-app`](https://github.com/umijs/umi).

```shell
cd frontend/

# install packages
yarn

# run
yarn start
```

Open [http://localhost:8000](http://localhost:8000) with your browser to see the web app.


Run the tests with:

```
yarn test
```

See [UmiJS Plugin Test](https://umijs.org/plugins/best-practice#plugin-test) for more information.

### Run Mobile App

Mobile app is developed using [Expo](https://expo.dev/).

```shell
cd app/

# install packages
yarn

# run
yarn web
```

Install [Expo Go](https://expo.dev/client) on your phone, then scan the QR code using your phone's camera to check the App.


## Team

Table is based on an internal project of [Tezign](https://www.tezign.com/) led by [Ling Fan](https://www.linkedin.com/in/fatflatfloat/), [Zhe Wang](https://www.linkedin.com/in/zhe-wang-7665921b/), and [Harry Wang](https://harrywang.me/). 

Core development team includes [Yuandong Yang](https://github.com/AnoyiX), [Jinggang Zhuo](https://github.com/zhuojg), and [Feifei Ying](https://github.com/faye1225) with contributions from other members, such as Meixi Lu, Zilong Pei, Jing Zhu, Dan Li.





