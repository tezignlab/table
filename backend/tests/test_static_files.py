from fastapi.testclient import TestClient
from run import app

client = TestClient(app)


def test_avatar():
    response = client.get("/api/static/avatars/0.png")
    assert response.status_code == 200
