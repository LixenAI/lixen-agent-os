"""
Lixen OS Agents - AI Agent Operating System
Core orchestration engine for managing the agent swarm.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional, Type, Callable
import asyncio
import json
import logging
from collections import deque

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("lixen.core")


class AgentStatus(Enum):
    """Status states for any agent in the system."""
    IDLE = "idle"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    BLOCKED = "blocked"
    WAITING = "waiting"


class TaskPriority(Enum):
    """Priority levels for tasks."""
    CRITICAL = 1
    HIGH = 2
    MEDIUM = 3
    LOW = 4


@dataclass
class Task:
    """A unit of work to be executed by an agent."""
    id: str
    agent_type: str
    action: str
    payload: Dict[str, Any] = field(default_factory=dict)
    priority: TaskPriority = TaskPriority.MEDIUM
    status: AgentStatus = AgentStatus.IDLE
    created_at: datetime = field(default_factory=datetime.now)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    dependencies: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "agent_type": self.agent_type,
            "action": self.action,
            "payload": self.payload,
            "priority": self.priority.value,
            "status": self.status.value,
            "created_at": self.created_at.isoformat(),
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "result": self.result,
            "error": self.error,
            "dependencies": self.dependencies,
            "metadata": self.metadata,
        }


@dataclass
class AgentCapability:
    """Defines what an agent can do."""
    name: str
    description: str
    required_tools: List[str] = field(default_factory=list)
    input_schema: Dict[str, Any] = field(default_factory=dict)
    output_schema: Dict[str, Any] = field(default_factory=dict)


class BaseAgent(ABC):
    """Abstract base class for all Lixen OS agents."""
    
    def __init__(self, agent_id: str, name: str, config: Dict[str, Any] = None):
        self.agent_id = agent_id
        self.name = name
        self.config = config or {}
        self.status = AgentStatus.IDLE
        self.capabilities: List[AgentCapability] = []
        self.task_history: deque = deque(maxlen=100)
        self.current_task: Optional[Task] = None
        self.metrics: Dict[str, Any] = {
            "tasks_completed": 0,
            "tasks_failed": 0,
            "avg_execution_time": 0.0,
        }
        self._tools: Dict[str, Callable] = {}
        self._register_tools()
    
    @abstractmethod
    def _register_tools(self) -> None:
        """Register tools this agent can use."""
        pass
    
    @abstractmethod
    async def execute(self, task: Task) -> Dict[str, Any]:
        """Execute a task. Must be implemented by concrete agents."""
        pass
    
    def register_tool(self, name: str, handler: Callable) -> None:
        """Register a tool handler."""
        self._tools[name] = handler
        logger.info(f"[{self.name}] Registered tool: {name}")
    
    async def use_tool(self, tool_name: str, **kwargs) -> Any:
        """Use a registered tool."""
        if tool_name not in self._tools:
            raise ValueError(f"Tool '{tool_name}' not registered for agent '{self.name}'")
        handler = self._tools[tool_name]
        logger.info(f"[{self.name}] Using tool: {tool_name}")
        return await handler(**kwargs) if asyncio.iscoroutinefunction(handler) else handler(**kwargs)
    
    async def process_task(self, task: Task) -> Task:
        """Process a task with lifecycle management."""
        self.current_task = task
        task.status = AgentStatus.RUNNING
        task.started_at = datetime.now()
        self.status = AgentStatus.RUNNING
        
        try:
            logger.info(f"[{self.name}] Starting task: {task.id} - {task.action}")
            result = await self.execute(task)
            task.result = result if isinstance(result, dict) else {"output": result}
            task.status = AgentStatus.COMPLETED
            self.metrics["tasks_completed"] += 1
            logger.info(f"[{self.name}] Completed task: {task.id}")
        except Exception as e:
            task.error = str(e)
            task.status = AgentStatus.FAILED
            self.metrics["tasks_failed"] += 1
            logger.error(f"[{self.name}] Failed task: {task.id} - {e}")
        finally:
            task.completed_at = datetime.now()
            self.task_history.append(task)
            self.current_task = None
            self.status = AgentStatus.IDLE
        
        return task
    
    def get_status(self) -> Dict[str, Any]:
        """Get current agent status."""
        return {
            "agent_id": self.agent_id,
            "name": self.name,
            "status": self.status.value,
            "current_task": self.current_task.to_dict() if self.current_task else None,
            "metrics": self.metrics,
            "capabilities": [cap.name for cap in self.capabilities],
        }
    
    def health_check(self) -> Dict[str, Any]:
        """Perform a health check on this agent."""
        return {
            "agent_id": self.agent_id,
            "name": self.name,
            "healthy": True,
            "status": self.status.value,
            "tool_count": len(self._tools),
            "last_task_count": len(self.task_history),
        }


class AgentRegistry:
    """Registry for managing all agents in the system."""
    
    def __init__(self):
        self._agents: Dict[str, BaseAgent] = {}
        self._agent_types: Dict[str, Type[BaseAgent]] = {}
    
    def register_agent_type(self, agent_type: str, agent_class: Type[BaseAgent]) -> None:
        """Register an agent type class."""
        self._agent_types[agent_type] = agent_class
        logger.info(f"Registered agent type: {agent_type}")
    
    def create_agent(self, agent_type: str, agent_id: str, name: str, config: Dict[str, Any] = None) -> BaseAgent:
        """Create an agent instance."""
        if agent_type not in self._agent_types:
            raise ValueError(f"Unknown agent type: {agent_type}")
        agent_class = self._agent_types[agent_type]
        agent = agent_class(agent_id=agent_id, name=name, config=config)
        self._agents[agent_id] = agent
        return agent
    
    def get_agent(self, agent_id: str) -> Optional[BaseAgent]:
        """Get an agent by ID."""
        return self._agents.get(agent_id)
    
    def list_agents(self) -> List[Dict[str, Any]]:
        """List all registered agents."""
        return [agent.get_status() for agent in self._agents.values()]
    
    def health_check_all(self) -> Dict[str, Any]:
        """Run health checks on all agents."""
        return {
            agent_id: agent.health_check()
            for agent_id, agent in self._agents.items()
        }


class MessageBus:
    """Inter-agent communication system."""
    
    def __init__(self):
        self._subscribers: Dict[str, List[Callable]] = {}
        self._message_queue: asyncio.Queue = asyncio.Queue()
    
    def subscribe(self, event_type: str, handler: Callable) -> None:
        """Subscribe to an event type."""
        if event_type not in self._subscribers:
            self._subscribers[event_type] = []
        self._subscribers[event_type].append(handler)
    
    async def publish(self, event_type: str, message: Dict[str, Any]) -> None:
        """Publish an event to all subscribers."""
        await self._message_queue.put((event_type, message))
        handlers = self._subscribers.get(event_type, [])
        for handler in handlers:
            try:
                if asyncio.iscoroutinefunction(handler):
                    await handler(message)
                else:
                    handler(message)
            except Exception as e:
                logger.error(f"Error handling event {event_type}: {e}")
    
    async def get_next_message(self) -> tuple:
        """Get next message from queue."""
        return await self._message_queue.get()


class LixenOrchestrator:
    """Main orchestrator for the Lixen OS Agent System."""
    
    def __init__(self, config: Dict[str, Any] = None):
        self.config = config or {}
        self.registry = AgentRegistry()
        self.message_bus = MessageBus()
        self.task_queue: asyncio.PriorityQueue = asyncio.PriorityQueue()
        self.running = False
        self._task_counter = 0
        self._queue_counter = 0
        self._gate_status: Dict[str, bool] = {}
        self._kpi_data: Dict[str, Any] = {}

    def generate_task_id(self) -> str:
        """Generate a unique task ID."""
        self._task_counter += 1
        return f"task_{self._task_counter:06d}"

    async def submit_task(self, agent_type: str, action: str, payload: Dict[str, Any] = None, 
                         priority: TaskPriority = TaskPriority.MEDIUM, dependencies: List[str] = None) -> Task:
        """Submit a new task to the system."""
        task = Task(
            id=self.generate_task_id(),
            agent_type=agent_type,
            action=action,
            payload=payload or {},
            priority=priority,
            dependencies=dependencies or [],
        )
        # Use counter to ensure unique ordering and avoid Task comparison
        self._queue_counter += 1
        await self.task_queue.put((priority.value, self._queue_counter, task))
        logger.info(f"Submitted task: {task.id} for {agent_type}")
        await self.message_bus.publish("task.submitted", task.to_dict())
        return task

    async def process_task_queue(self) -> None:
        """Process tasks from the queue."""
        while self.running:
            try:
                _, _, task = await asyncio.wait_for(self.task_queue.get(), timeout=1.0)
                agent = self.registry.get_agent(f"{task.agent_type}_001")
                if not agent:
                    logger.error(f"No agent found for type: {task.agent_type}")
                    task.status = AgentStatus.FAILED
                    task.error = f"No agent found for type: {task.agent_type}"
                    continue

                await agent.process_task(task)
                await self.message_bus.publish("task.completed", task.to_dict())
            except asyncio.TimeoutError:
                continue
            except Exception as e:
                logger.error(f"Error processing task: {e}")
    
    async def start(self) -> None:
        """Start the orchestrator."""
        self.running = True
        logger.info("Lixen OS Orchestrator started")
        await self.message_bus.publish("system.started", {"timestamp": datetime.now().isoformat()})
    
    async def stop(self) -> None:
        """Stop the orchestrator."""
        self.running = False
        logger.info("Lixen OS Orchestrator stopped")
        await self.message_bus.publish("system.stopped", {"timestamp": datetime.now().isoformat()})
    
    def get_system_status(self) -> Dict[str, Any]:
        """Get overall system status."""
        return {
            "running": self.running,
            "agents": self.registry.list_agents(),
            "gate_status": self._gate_status,
            "kpi_data": self._kpi_data,
            "task_queue_size": self.task_queue.qsize(),
        }
    
    def check_gate(self, gate_name: str) -> bool:
        """Check if a go-live gate is passed."""
        return self._gate_status.get(gate_name, False)
    
    def set_gate(self, gate_name: str, passed: bool) -> None:
        """Set a go-live gate status."""
        self._gate_status[gate_name] = passed
        logger.info(f"Gate '{gate_name}' set to {passed}")
    
    def update_kpi(self, kpi_name: str, value: Any) -> None:
        """Update a KPI value."""
        self._kpi_data[kpi_name] = value
        logger.info(f"KPI '{kpi_name}' updated to {value}")
    
    def get_all_gates_passed(self) -> bool:
        """Check if all go-live gates are passed."""
        if not self._gate_status:
            return False
        return all(self._gate_status.values())
