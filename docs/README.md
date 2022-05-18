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
  <a href="https://nextjs.org/">
    <img src="https://img.shields.io/badge/Next.js-2D333B?style=for-the-badge&logo=Next.js&logoColor=61dafb"/> 
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=fff"/> 
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
<img width="800" src="https://user-images.githubusercontent.com/595772/169161995-152216ba-bdc7-43f9-a049-21268e28542d.png">
</p>

<p align="center">
<img height="500" src="https://user-images.githubusercontent.com/595772/169162001-5158fd26-50a5-4b03-a74c-5486f005618a.jpeg">
<img height="500" src="https://user-images.githubusercontent.com/595772/169162002-c38bfee2-6fec-4bf7-9d9c-f6b790b16122.jpeg">
</p>


## About

TABLE serves as a full-stack web and mobile application boilerplate to jump start your project. 

TABLE powers the creative advertising showcase platform [NaoDong.IO](https://naodong.io/) and its universal native apps for [Android and iOS](https://naodong.io/download-app).

TABLE has implemented the following basic functionalities:

- user registration and authentication
- search via ElasticSearch
- like and save 
- dynamic loading and scrolling

## Quick Start

Get the source code from [https://github.com/tezignlab/table](https://github.com/tezignlab/table)

You can setup Table on a local computer via a few simple steps:

Clone the repo and switch to the folder:

```shell
git clone https://github.com/tezignlab/table.git
cd table
```

Start [docker](https://www.docker.com/products/docker-desktop) and run all services using the following command:

```shell
docker-compose up --build --force-recreate
```

This creates two new data folders: `data_es` and `data_mongo`. Also make sure ES container can read and write `data_es`:

```shell
# without permissions, elasticsearch will fail to start
chmod a+rw data_es
```

Load the sample data (choose from English or Chinese data):

```shell
# English data
docker exec table_apiserver python3 init.py

# Chinese data
# docker exec table_apiserver bash -c "export DATA_LANG=zh && python3 init.py"
```

Open [http://localhost:8000](http://localhost:8000) with your browser to see Table web application.

## Development

### Start Local Database  

Run MongDB and ElasticSearch on localhost with docker-compose:

```shell
docker-compose -f docker-compose.dev.yml up -d

# without permissions, elasticsearch will fail to start
chmod a+rw data_es/
```

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

```shell
pytest
```

`pytest` will run all files of the form `test_*.py` or `*_test.py` in the current directory and its subdirectories.

### Run Frontend Web Application Server

```shell
cd frontend/

# install packages
yarn

# run
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the web app.

Run the tests with:

```shell
yarn test
```

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

Initial core development team includes [Jinggang Zhuo](https://github.com/zhuojg), [Yuandong Yang](https://github.com/AnoyiX), and [Feifei Ying](https://github.com/faye1225) with contributions from other [members](https://github.com/tezignlab/table/blob/main/CONTRIBUTORS.md).
