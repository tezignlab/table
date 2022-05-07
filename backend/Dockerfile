FROM python:3.9

WORKDIR /root

ADD requirements.txt ./

RUN pip3 install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt

COPY . .

CMD ["uvicorn", "run:app", "--host", "0.0.0.0", "--port", "80", "--no-access-log", "--no-use-colors"]
