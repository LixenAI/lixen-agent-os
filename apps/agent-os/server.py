#!/usr/bin/env python3
"""
Lixen OS Agents - FastAPI Web Server
HTTP interface for triggering agents and checking system status.
"""

import asyncio
import os
from contextlib import asynccontextmanager
from typing import Any, Dict, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from main import LixenOS
from chat import router as chat_router
from agent_studio import router as agent_studio_router, store as governance_store

# Global instance
lixen_os: Optional[LixenOS] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown lifecycle."""
    global lixen_os
    print("[Lixen OS Server] Starting up...")
    lixen_os = LixenOS()
    await lixen_os.initialize()
    print("[Lixen OS Server] Ready.")
    yield
    print("[Lixen OS Server] Shutting down...")
    if lixen_os:
        await lixen_os.shutdown()


app = FastAPI(
    title="Lixen OS Agent API",
    description="AI Agent Operating System for LixenAI — You close. We build, deploy, and deliver.",
    version="1.0.0",
    lifespan=lifespan,
)

# ─── CORS ──────────────────────────────────────────────────
# Allows the command-center frontend to call the agent-os API directly.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ───────────────────────────────────────────────
app.include_router(chat_router)
app.include_router(agent_studio_router)


class TaskRequest(BaseModel):
    agent_type: str
    action: str
    payload: Optional[Dict[str, Any]] = {}


# ─── Routes ───────────────────────────────────────────────

@app.get("/")
async def root():
    return {
        "service": "Lixen OS Agent System",
        "tagline": "You close. We build, deploy, and deliver.",
        "version": "1.0.0",
        "status": "online",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {"status": "healthy", "service": "lixen-os"}


@app.get("/status")
async def status():
    if not lixen_os:
        raise HTTPException(status_code=503, detail="System not initialized")
    s = await lixen_os.get_system_status()
    return JSONResponse(content=s)


@app.post("/task")
async def run_task(req: TaskRequest):
    """
    Execute a specific agent task.

    Example body:
    {
        "agent_type": "founder_command",
        "action": "kpi_overview",
        "payload": {"kpis": {"recruit": 5, "revenue": 10000, "retention": 0.95}}
    }
    """
    if not lixen_os:
        raise HTTPException(status_code=503, detail="System not initialized")
    try:
        result = await lixen_os.execute_agent_task(
            req.agent_type, req.action, req.payload
        )
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/workflow")
async def run_workflow(context: Optional[Dict[str, Any]] = None):
    """Run the full 10-step workflow pipeline."""
    if not lixen_os:
        raise HTTPException(status_code=503, detail="System not initialized")
    try:
        results = await lixen_os.run_workflow(context)
        return JSONResponse(content=results)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/agents")
async def list_agents():
    """List all registered agents across both runtimes: agents executing
    inside Biz-OS and agents deployed in GHL Agent Studio."""
    if not lixen_os:
        raise HTTPException(status_code=503, detail="System not initialized")
    native = [
        {**status, "runtime": "biz_os_native"}
        for status in lixen_os.orchestrator.registry.list_agents()
    ]
    external = [a.to_dict() for a in governance_store.external_agents.values()]
    return {"agents": native + external}


@app.get("/gates")
async def get_gates():
    """Get all go-live gate statuses."""
    if not lixen_os:
        raise HTTPException(status_code=503, detail="System not initialized")
    gates = lixen_os.orchestrator._gate_status
    all_passed = lixen_os.orchestrator.get_all_gates_passed()
    return {"gates": gates, "all_passed": all_passed}


@app.post("/gates/{gate_name}")
async def set_gate(gate_name: str, passed: bool = True):
    """Set a go-live gate status."""
    if not lixen_os:
        raise HTTPException(status_code=503, detail="System not initialized")
    lixen_os.orchestrator.set_gate(gate_name, passed)
    return {"gate": gate_name, "passed": passed}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("server:app", host="0.0.0.0", port=port, reload=False)
