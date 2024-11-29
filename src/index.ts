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

  const outputPath = path.join(process.cwd(), "output.txt");

  try {
    console.log("Streaming response to output.txt...");
    fs.writeFileSync(outputPath, "", { encoding: "utf8" });
    for await (const chunk of streamResponse) {
      fs.appendFileSync(outputPath, JSON.stringify(chunk, null, 2) + "\n", { encoding: "utf8" });
    }
    console.log("Streaming complete.");
  } catch (error) {
    console.error("Error writing to file:", error);
    process.exit(1);
  }
})();
