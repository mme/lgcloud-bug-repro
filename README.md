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
3. Create a `.env` in the root of this project with the following:
   ```
   DEPLOYMENT_URL=
   LANGSMITH_API_KEY=
   ASSISTANT_NAME=
   ```
4. Install the dependencies.

   ```
   pnpm install
   ```

5. Run the script. You'll find the events written to the console.
   ```
   pnpm start
   ```

On completion, the relevant events will be printed to the console along with timestamps sent/received.
