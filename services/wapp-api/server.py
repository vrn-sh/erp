from warnings import warn
from fastapi import FastAPI
import uvicorn
import os
import json
import subprocess as sp

api = FastAPI()

@api.post("/run")
def run_wappalyzer(url: str):
    """ Runs wappalyzer free cli against one url """
    process = sp.run(['node', './wappalyzer/src/drivers/npm/cli.js', url], capture_output=True)
    return json.loads(process.stdout.decode('utf-8').strip("\""))
