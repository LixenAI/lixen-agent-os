# LIXEN OS AGENTS - AI Agent Operating System

> **You close. We build, deploy, and deliver.**  
> **Partners sell. LixenAI builds, deploys, supports, and retains.**

## 🎯 Our Mission

Install and operate a growth system that helps service-based local businesses get more leads, book more appointments, and grow profitably.

### Program Snapshot

| Item | Detail |
|------|--------|
| **Current Production Niche** | Med Spa / Aesthetic Clinic |
| **Delivery Infrastructure** | GoHighLevel |
| **Partner Model** | Channel Partners (Sales-Driven) |
| **Core Promise** | "You close. We build, deploy, and deliver." |

---

## 🤖 LIXEN AI AGENT TEAM

The Lixen OS consists of **10 specialized AI agents** working together to deliver the complete growth system:

### 1. Founder Command Agent 👑
*Your executive AI operator and decision partner.*

- Track launch readiness
- Review blockers
- Prioritize daily actions
- KPI and performance overview
- Keep business aligned with core promise

### 2. Partner Recruitment Agent 🤝
*Finds, qualifies, and onboards the right sales partners.*

- LinkedIn outreach & lead generation
- Applicant scoring
- Qualification call prep
- Pipeline management
- Partner onboarding workflow

### 3. Sales Enablement Agent 📈
*Equips partners to sell, position, and close.*

- Demo scripts & decks
- Objection handling
- Proposal generation
- Follow-up sequences
- Offer & pricing guardrails

### 4. Client Intake Agent 📋
*Turns closed deals into complete, clean, and build-ready handoffs.*

- Intake forms & checklists
- Asset & info collection
- Payment/contract check
- Missing item detection
- Handoff summary for fulfillment

### 5. GHL Build Agent ⚙️
*Builds and configures the growth system to spec.*

- Snapshot deployment
- Workflows & automations
- Pipelines & calendars
- Forms, AI, triggers
- Task tracking (LIVE/DRAFT/GATE)

### 6. QA + Compliance Agent ✅
*Protects quality, compliance, and go-live readiness.*

- 30-Point QA execution
- A2P / 10DLC checks
- Consent & opt-out review
- AI disclosure & claims
- Go-live gate approvals
- Risk and issue blocking

### 7. Client Success Agent 🚀
*Drives retention, results, and account growth.*

- KPI monitoring
- Monthly reporting
- Optimization recommendations
- Upsell & expansion
- Churn risk alerts

### 8. Knowledge Base Agent 📚
*Captures, organizes, and scales the company's know-how.*

- SOP creation
- Playbooks & scripts
- Training modules
- Best practices library
- Updates & version control

### 9. Marketing Agent 📢 *(NEW)*
*Generates demand, builds brand, and fuels the partner pipeline.*

- Content creation
- Campaign planning
- Landing pages & offers
- SEO & organic growth
- Paid ads strategy
- Funnel optimization

### 10. Analytics & Reporting Agent 📊
*Turns data into clarity, insights, and actions.*

- Dashboard generation
- Performance analysis
- Cohort & ROI tracking
- Partner & client metrics
- Executive summaries
- Forecasting

---

## 🔄 HOW THE AGENTS WORK TOGETHER

The 10-step workflow pipeline connects all agents in a seamless process:

```
1. Recruit     → 2. Enable    → 3. Close     → 4. Intake    → 5. Build
   (Partner     (Sales       (Partner     (Collects     (Build Agent
    Agent       Agent         closes and   everything    deploys
    finds and   equips        submits      needed for    and configures
    qualifies)  partners)     client)      handoff)      the system)

6. QA         → 7. Launch    → 8. Scale     → 9. Learn     → 10. Improve
   (QA Agent   (System       (Client      (Knowledge    (Analytics
    tests,     goes live,    Success      Base         Agent
    verifies,   client        drives        captures     measures,
    and clears  trained and   results and   learnings    reports, and
    go-live     launched)     retention)    and version  optimizes)
                                  control)
```

---

## 🔗 KEY INTEGRATIONS

| Integration | Purpose |
|-------------|---------|
| **GoHighLevel** | CRM, automation, and delivery infrastructure |
| **Google Drive** | File storage and document management |
| **Notion** | Knowledge base, SOPs, and documentation |
| **Gmail** | Email communication and notifications |
| **Slack** | Team communication and alerts |
| **Calendar** | Appointment scheduling and management |
| **Stripe** | Payment processing and billing |

---

## 🚀 GO-LIVE GATES

*No gate = No launch.*

All gates must be completed before a client system can go live:

| Gate | Status | Checklist Items |
|------|--------|-----------------|
| Billing system configured and tested | ☐ | 5 items |
| A2P / 10DLC verification complete | ☐ | 5 items |
| 5 core demo workflows built and tested | ☐ | 6 items |
| Blank account deployment test passed | ☐ | 4 items |
| 30-Point QA fully passed | ☐ | 30 items |
| Missed-call text copy set | ☐ | 5 items |
| Client sign-off and approval | ☐ | 5 items |

**Current Readiness:** ~70% Complete

- ✅ Partner funnel: LIVE (core)
- ✅ Client delivery: ~70%
- ⚠️ Go-live gates: Billing, A2P, 5 demo workflows, 30-point QA, blank account deploy test, missed-call copy, client sign-off

- **Controlled beta:** YES
- **Unrestricted launch:** NOT YET

---

## ⭐ NORTH STAR KPI

### R³ — Recruit · Revenue · Retention

| KPI | Target | Description |
|-----|--------|-------------|
| **R1 - Recruit** | 10 partners/month | Recruit great partners. |
| **R2 - Revenue** | $50,000/month | Drive client revenue. |
| **R3 - Retention** | 90% | Deliver results clients stay for. |

---

## 🛠️ Installation & Setup

### Prerequisites

- Python 3.8+
- pip

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Configure Environment Variables

Create a `.env` file or export these variables:

```bash
# GoHighLevel
export GHL_API_KEY="your_ghl_api_key"
export GHL_LOCATION_ID="your_location_id"

# Google Drive
export GOOGLE_DRIVE_CREDENTIALS="your_credentials"
export GOOGLE_DRIVE_FOLDER_ID="your_folder_id"

# Notion
export NOTION_API_KEY="your_notion_api_key"
export NOTION_DATABASE_ID="your_database_id"

# Gmail
export GMAIL_CREDENTIALS="your_gmail_credentials"
export GMAIL_FROM_EMAIL="your@email.com"

# Slack
export SLACK_BOT_TOKEN="your_slack_bot_token"
export SLACK_WEBHOOK_URL="your_webhook_url"
export SLACK_DEFAULT_CHANNEL="#general"

# Calendar
export CALENDAR_CREDENTIALS="your_calendar_credentials"
export CALENDAR_ID="primary"

# Stripe
export STRIPE_API_KEY="your_stripe_api_key"
export STRIPE_WEBHOOK_SECRET="your_webhook_secret"
```

### Run the System

```bash
python main.py
```

### Run Tests

```bash
python -m unittest tests/test_lixen.py -v
```

---

## 📁 Project Structure

```
lixen-os-agents/
├── core/
│   ├── __init__.py
│   └── orchestrator.py          # Core orchestration engine
├── agents/
│   └── __init__.py              # All 10 agent definitions
├── workflows/
│   └── pipeline.py              # 10-step workflow pipeline
├── integrations/
│   └── __init__.py              # External service integrations
├── gates/
│   └── __init__.py              # Go-Live Gates & KPI system
├── config/
│   └── settings.py              # Configuration management
├── tests/
│   └── test_lixen.py            # Test suite
├── main.py                       # Entry point
├── requirements.txt              # Dependencies
└── README.md                     # This file
```

---

## 🧩 Using the System

### Execute a Single Agent Task

```python
import asyncio
from main import LixenOS

async def example():
    lixen = LixenOS()
    await lixen.initialize()
    
    # Run a Founder Command task
    result = await lixen.execute_agent_task(
        "founder_command", "kpi_overview",
        payload={"kpis": {"recruit": 5, "revenue": 10000, "retention": 0.95}}
    )
    print(result)
    
    await lixen.shutdown()

asyncio.run(example())
```

### Run the Full Workflow Pipeline

```python
import asyncio
from main import LixenOS

async def example():
    lixen = LixenOS()
    await lixen.initialize()
    
    # Run all 10 steps
    results = await lixen.run_workflow()
    print(results)
    
    await lixen.shutdown()

asyncio.run(example())
```

### Check Go-Live Gates

```python
from gates import GoLiveGateSystem

gates = GoLiveGateSystem()
print(gates.can_launch())  # False until all gates passed
print(gates.get_blocking_gates())
```

### Track North Star KPIs

```python
from gates import NorthStarKPIs

kpis = NorthStarKPIs()
kpis.update_kpi("recruit_partners", 8, "up")
print(kpis.get_north_star_summary())
```

---

## 🧪 Testing

The system includes comprehensive unit tests:

```bash
# Run all tests
python -m unittest tests/test_lixen.py -v

# Test results include:
# - All 10 agent capabilities verified
# - Workflow pipeline stages validated
# - Go-Live gates status checks
# - North Star KPI tracking
# - Integration health checks
# - Orchestrator task management
```

---

## 📝 License

Copyright © 2024 LixenAI. All rights reserved.

---

## 🤝 Contributing

This is a proprietary system designed for the LixenAI partner ecosystem. For partnership inquiries, please contact the Founder Command Agent.

---

<p align="center">
  <strong>LIXEN AI — AI Agent Operating System</strong><br>
  <em>Building the future of service-based business growth.</em>
</p>
