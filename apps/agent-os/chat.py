#!/usr/bin/env python3
"""
LixenAI Chat Module — AI-powered Q&A about the platform, services, and partner program.
"""

import os
from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/chat", tags=["chat"])


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    stream: bool = False


# ─── LixenAI Identity Prompt ───────────────────────────────────────
# Injected as system context so the AI answers accurately about the platform.

LIXEN_SYSTEM_PROMPT = """You are the LixenAI Assistant — the official AI support agent for the LixenAI Operating System and Sales Partner Program.

## What LixenAI Does
LixenAI helps entrepreneurs start an AI agency without building the tech. Partners sell AI-powered automation services to local businesses using LixenAI's platform (built on GoHighLevel).

## Service Plans (Client-Facing)
1. Local Automation Starter — $249/mo (6-month minimum)
   - CRM & pipeline, lead follow-up, missed-call text back, 24/7 booking, unified inbox, phone system, email & SMS marketing, reviews, sites & funnels, custom domain, payments, AI-assisted prospecting
2. AI Growth System — $497/mo (6-month minimum) — Featured plan
   - Everything in Starter + 24/7 Conversation AI, Voice AI receptionist, social capture, AI qualification, no-show recovery, reactivation, 30-day nurture, reputation growth, ad manager, monthly review

Add-ons ($39/mo each): Ask AI, AI Studio, Content AI, Funnel & Website AI, Reviews AI. AI Suite Bundle (all 5) — $149/mo.

## Partner Program (Sales Partner Program)
- Annual: $5,000 (Starter tier) or $6,000 (Growth tier)
- Payment: 50% down + 6-month installments ($416.67/mo Starter or $500/mo Growth)
- Month 7+: Month-to-month at same rate. No lock-in. Cancel anytime with 30 days notice.
- Client setup fee: Partners charge $500–$3,000 one-time. Partner keeps 100% of this.
- Client monthly: Partners charge retail ($249–$497/mo) + setup fee. Partner keeps the margin.

## Key Rules
- NEVER make income guarantees or promise revenue, leads, or ROI. Use illustrative examples only with disclaimers.
- NEVER provide legal, tax, or compliance advice. Escalate to human review.
- ALWAYS obtain consent before contacting prospects.
- Public marketing uses "Agency Partner"; internal docs use "Sales Partner".
- Brand name: LixenAI or Lixen.AI (never LixenAi, lixenai, LIXENAI, Lixen A.I.)

## Platform
- Primary: GoHighLevel (GHL) Agency
- AI Layer: Claude + OpenAI integrations
- Auth: Supabase
- Integrations: GHL OAuth, Google Drive, Notion, Gmail, Slack, Calendar, Stripe
- Compliance: A2P 10DLC registration required for SMS. STOP/opt-out mandatory.

## Voice & Tone
- Clear, direct, specific. Never vague or hype-driven.
- Entrepreneurial and honest. No fear-based pressure or fake scarcity.
- Confident without overpromising.
- Professional, never stiff or casual.
- Transparent about limits.
"""


@router.post("")
async def chat(req: ChatRequest):
    """
    Send a message to the LixenAI Assistant.

    Request body:
    {
        "messages": [
            {"role": "user", "content": "What is the partner program?"}
        ]
    }

    Response:
    {
        "response": "The LixenAI Sales Partner Program...",
        "model": "gpt-4o"
    }
    """
    try:
        import openai

        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=503,
                detail="OPENAI_API_KEY not configured. Set it in your environment to enable the AI chat.",
            )

        client = openai.AsyncOpenAI(api_key=api_key)

        messages = [{"role": "system", "content": LIXEN_SYSTEM_PROMPT}]
        for msg in req.messages:
            messages.append({"role": msg.role, "content": msg.content})

        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            temperature=0.7,
            max_tokens=1500,
        )

        return {
            "response": response.choices[0].message.content,
            "model": response.model,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
