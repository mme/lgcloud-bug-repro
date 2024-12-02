"""
This is the main entry point for the AI.
It defines the workflow graph and the entry point for the agent.
"""
# pylint: disable=line-too-long, unused-import
from typing import cast

from langchain_core.messages import AIMessage, ToolMessage
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from research_canvas.state import AgentState
from research_canvas.search import search_node

# Define a new graph
workflow = StateGraph(AgentState)
workflow.add_node("search_node", search_node)

memory = MemorySaver()
workflow.set_entry_point("search_node")
workflow.add_edge("search_node", END)

graph = workflow.compile(checkpointer=memory)
