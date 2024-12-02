import { Client } from "@langchain/langgraph-sdk";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import dotenv from "dotenv";
dotenv.config();

const deploymentUrl = process.env.DEPLOYMENT_URL;
const langsmithApiKey = process.env.LANGSMITH_API_KEY;
const assistantName = process.env.ASSISTANT_NAME;

(async () => {
  const client = new Client({ apiUrl: deploymentUrl, apiKey: langsmithApiKey });
  const assistants = await client.assistants.search();
  const retrievedAssistant = assistants.find((a) => a.name === assistantName);
  const threadId = randomUUID();
  await client.threads.create({ threadId: threadId });
  const state = {
    messages: [{ role: "user", content: "Research the life of penguins" }],
    model: "openai",
  };
  const streamResponse = client.runs.stream(
    threadId,
    retrievedAssistant?.assistant_id!,
    {
      input: state,
      streamMode: ["events", "values"],
    }
  );

  for await (const chunk of streamResponse) {
    if ("on_custom_event" === chunk.data.event) {
      console.log(`> Current Unix Timestamp: ${Date.now()}`);
      console.log(JSON.stringify(chunk.data.data));
    }
  }
})();
