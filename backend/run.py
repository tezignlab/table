import os
import uvicorn
from fastapi import FastAPI
from starlette.responses import JSONResponse

from api import *
from config import conf
from exception import *
from models import Response
from db import es
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(**conf['application'])

# Config CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Config router
app.include_router(router_public)

# Config static files router
app.mount("/api/static", StaticFiles(directory=f'{os.path.dirname(os.path.abspath(__file__))}/static'), name="static")

# Config exception handler
@app.exception_handler(HTTPBaseException)
async def http_exception_handler(request, exc):
    return JSONResponse(Response(code=exc.code, message=exc.message).dict(), status_code=200)


# Config shutdown event handler
@app.on_event("shutdown")
async def shutdown_event():
    es.close()


if __name__ == '__main__':
    uvicorn.run('run:app', host="0.0.0.0", port=8080, reload=True, access_log=False)
