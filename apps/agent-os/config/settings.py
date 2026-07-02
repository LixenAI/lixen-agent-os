"""
Lixen OS Agents - Configuration Settings
"""

import os
from typing import Any, Dict


def load_config(config_path: str = None) -> Dict[str, Any]:
    """Load configuration from file or environment variables."""
    config = {
        # Core settings
        "app_name": "Lixen OS Agents",
        "version": "1.0.0",
        "environment": os.getenv("LIXEN_ENV", "development"),
        
        # GoHighLevel settings
        "gohighlevel": {
            "api_key": os.getenv("GHL_API_KEY", ""),
            "location_id": os.getenv("GHL_LOCATION_ID", ""),
        },
        
        # Google Drive settings
        "googledrive": {
            "credentials": os.getenv("GOOGLE_DRIVE_CREDENTIALS", ""),
            "folder_id": os.getenv("GOOGLE_DRIVE_FOLDER_ID", ""),
        },
        
        # Notion settings
        "notion": {
            "api_key": os.getenv("NOTION_API_KEY", ""),
            "database_id": os.getenv("NOTION_DATABASE_ID", ""),
        },
        
        # Gmail settings
        "gmail": {
            "credentials": os.getenv("GMAIL_CREDENTIALS", ""),
            "from_email": os.getenv("GMAIL_FROM_EMAIL", ""),
        },
        
        # Slack settings
        "slack": {
            "bot_token": os.getenv("SLACK_BOT_TOKEN", ""),
            "webhook_url": os.getenv("SLACK_WEBHOOK_URL", ""),
            "default_channel": os.getenv("SLACK_DEFAULT_CHANNEL", "#general"),
        },
        
        # Calendar settings
        "calendar": {
            "credentials": os.getenv("CALENDAR_CREDENTIALS", ""),
            "calendar_id": os.getenv("CALENDAR_ID", "primary"),
        },
        
        # Stripe settings
        "stripe": {
            "api_key": os.getenv("STRIPE_API_KEY", ""),
            "webhook_secret": os.getenv("STRIPE_WEBHOOK_SECRET", ""),
        },
        
        # Agent settings
        "agents": {
            "max_concurrent_tasks": 10,
            "task_timeout": 300,  # seconds
            "retry_attempts": 3,
        },
        
        # Workflow settings
        "workflow": {
            "auto_advance": True,
            "require_gate_approval": True,
        },
        
        # KPI settings
        "kpi": {
            "recruit_target": 10,
            "revenue_target": 50000,
            "retention_target": 0.90,
        },
    }
    
    if config_path and os.path.exists(config_path):
        import json
        with open(config_path, "r") as f:
            file_config = json.load(f)
            config.update(file_config)
    
    return config
