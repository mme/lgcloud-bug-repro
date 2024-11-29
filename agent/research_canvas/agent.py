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
from research_canvas.download import download_node
from research_canvas.chat import chat_node
from research_canvas.search import search_node

# Define a new graph
workflow = StateGraph(AgentState)
workflow.add_node("chat_node", chat_node)


workflow.add_node("download", download_node) # emits custom events correctly
workflow.add_node("search_node", search_node) # emits custom events incorrectly

def route(state):
    """Route after the chat node."""

    messages = state.get("messages", [])
    if messages and isinstance(messages[-1], AIMessage):
        ai_message = cast(AIMessage, messages[-1])

        if ai_message.tool_calls and ai_message.tool_calls[0]["name"] == "Search":
            return "search_node"
        if ai_message.tool_calls and ai_message.tool_calls[0]["name"] == "DeleteResources":
            return "delete_node"
    if messages and isinstance(messages[-1], ToolMessage):
        return "chat_node"

    return END


memory = MemorySaver()
workflow.set_entry_point("download")
workflow.add_edge("download", "chat_node")
workflow.add_conditional_edges("chat_node", route, ["search_node", "chat_node", END])
workflow.add_edge("search_node", "download")
graph = workflow.compile(checkpointer=memory)
