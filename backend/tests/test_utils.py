from utils import UUIDUtils


def test_uuid_utils():
    uuid = UUIDUtils.uuid()
    assert len(uuid) == 32
