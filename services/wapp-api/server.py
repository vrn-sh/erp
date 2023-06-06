
from fastapi import FastAPI
import uvicorn
import os
import json
import subprocess as sp

api = FastAPI()

@api.get("/run")
def run_wappalyzer(url: str):
    """ Runs wappalyzer free cli against one url """

    cli_path = './wappalyzer/src/drivers/npm/cli.js' \
            if os.environ.get('IN_CONTAINER', '0') else '/app/src/drivers/npm/cli.js'
    process = sp.run(['node', cli_path, url], capture_output=True)
    return json.loads(process.stdout.decode('utf-8').strip("\""))
