from fastapi.testclient import TestClient
from run import app

client = TestClient(app)


def test_login():
    form = {
        'username': 'table',
        'password': 'password',
    }
    response = client.post("/api/v1/login", data=form)
    assert response.status_code == 200
    assert response.json() == {
        "code": 101000,
        "message": "User not found",
        "data": None
    }
