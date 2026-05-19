import platform
import time
import sys

_start_time = time.time()


def get_runtime_info():
    return {
        "python": sys.version.split()[0],
        "platform": platform.system().lower(),
        "arch": platform.machine(),
        "server": "uvicorn",
        "port": 8000,
        "uptime_seconds": int(time.time() - _start_time),
    }
