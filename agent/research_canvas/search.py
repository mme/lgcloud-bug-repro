"""
The search node is responsible for searching the internet for information.
"""

import os
from langchain_core.runnables import RunnableConfig
from tavily import TavilyClient
from research_canvas.state import AgentState
from langchain_core.callbacks.manager import adispatch_custom_event
from datetime import datetime
from copy import deepcopy


tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

async def search_node(state: AgentState, config: RunnableConfig):
    """
    The search node is responsible for searching the internet for resources.
    """

    logs = []

    queries = [
        "banana",
        "apple",
        "orange",
    ]

    for query in queries:
        logs.append({
            "message": f"Search for {query}",
            "done": False
        })
    
    await adispatch_custom_event(
        "copilotkit_manually_emit_intermediate_state",
        {"logs": deepcopy(logs), "timestamp": int(datetime.now().timestamp())},
        config=config,
    )

    for i, query in enumerate(queries):
        tavily_client.search(query)
        # await asyncio.sleep(3) 
        
        logs[i]["done"] = True
        await adispatch_custom_event(
            "copilotkit_manually_emit_intermediate_state",
            {"logs": deepcopy(logs), "timestamp": int(datetime.now().timestamp())},
            config=config,
        )
        

    await adispatch_custom_event(
        "copilotkit_manually_emit_intermediate_state",
        {"logs": deepcopy(logs), "timestamp": int(datetime.now().timestamp())},
        config=config,
    )
    return state
