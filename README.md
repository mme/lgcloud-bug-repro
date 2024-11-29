# LangGraph Cloud Bug Reproduction
The issue we've been hitting is that custom events are not arriving in order or on-time. To reproduce this,
we've created a script that will write the raw events of a LangGraph execution to a file. We will be starting
our LangGraph `agent` (located in this repository) through LangGraph Studio and then excuting the script against it.

## Running the reproduction

1. Create a `.env` in the `agent` directory with the following:
    ```
    OPENAI_API_KEY=
    TAVILY_API_KEY=
    ```
2. Start the agent through LangGraph Studio or Cloud
2. Create a `.env` in the root of this project with the following:
    ```
    DEPLOYMENT_URL=
    LANGSMITH_API_KEY=
    ASSISTANT_NAME=
    ```
3. Install the dependencies.
    ```
    pnpm install
    ```

4. Run the script. You'll find the events written to `output.txt`.
    ```
    pnpm start
    ```

On completion, the raw events of a run will be written to `output.txt`. The events we're specifically looking at are the 
`copilotkit_manually_emit_intermediate_state` events.