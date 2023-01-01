import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const prompt = req.body.prompt;

  const openAIResponse = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    temperature: 0.01,
    max_tokens: 140,
    top_p: 0.3,
    frequency_penalty: 0.5,
    presence_penalty: 0.0,
  });

  res.status(200).json({ responseData: openAIResponse.data });
}
