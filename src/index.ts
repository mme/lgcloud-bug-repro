import { Client } from "@langchain/langgraph-sdk";
import { randomUUID } from "node:crypto";

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
    console.log(JSON.stringify(chunk, null, 2));
  }
})();
