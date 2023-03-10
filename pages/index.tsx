import Head from "next/head";
import { useEffect, useState } from "react";
import {
  FormControl,
  Input,
  Button,
  Text,
  Flex,
  Heading,
  Box,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";

type ConversationTone = "sarcastic" | "naughty" | "weird" | "scientific";

export default function Home() {
  const [conversationTone, setConversationTone] =
    useState<ConversationTone>("sarcastic");
  const [conversation, setConversation] = useState([
    "Marv is a chatbot that eagerly answers questions with very scientific responses:",
  ]);
  const [question, setQuestion] = useState("");

  useEffect(() => {
    const firstResponse = `Marv is a chatbot that eagerly answers questions with very ${conversationTone} responses:`;
    setConversation((prevConversation) => [
      firstResponse,
      ...prevConversation.slice(1),
    ]);
  }, [conversationTone]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newConversation = [...conversation, `You: ${question}`, `Marv: `];
    setConversation(newConversation);
    const prompt = newConversation.join("\n");
    setQuestion("");

    const { responseData } = await fetch("/api/call", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    }).then((res) => res.json());

    const marvResponse = responseData.choices[0].text;
    newConversation[newConversation.length - 1] = `Marv: ${marvResponse}`;
    setConversation([...newConversation]);
  };

  return (
    <div>
      <Head>
        <title>Marv Chatbot</title>
        <meta name="description" content="A test app for open AI APIs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box height={"100vh"} position={"relative"} as="main">
        <Box paddingBottom={"120px"}>
          <Box padding={"2rem"}>
            <Heading mb={"1rem"}>Marv Chatbot</Heading>

            <Text>Conversation Tone</Text>
            <RadioGroup
              mb={"1rem"}
              onChange={(value) =>
                setConversationTone(value as ConversationTone)
              }
              value={conversationTone}
            >
              <Flex columnGap={"1rem"} flexWrap={"wrap"}>
                <Radio value="sarcastic">sarcastic</Radio>
                <Radio value="naughty">naughty</Radio>
                <Radio value="weird">weird</Radio>
                <Radio value="scientific">scientific</Radio>
              </Flex>
            </RadioGroup>
          </Box>

          <Box>
            {conversation.map((convo, index) => {
              const isMarv = convo.startsWith("Marv");
              return (
                <Text
                  bg={isMarv ? "#ececed" : "white"}
                  padding={"1rem 2rem"}
                  key={index}
                >
                  {convo}
                </Text>
              );
            })}
          </Box>
        </Box>

        <Flex
          position={"fixed"}
          bottom={"0"}
          justifyContent={"center"}
          alignItems={"center"}
          as={"form"}
          mb="2rem"
          onSubmit={handleSubmit}
          top={"93%"}
          left={"50%"}
          transform={"translate(-50%, -50%)"}
          bg={"white"}
        >
          <FormControl
            marginRight={"1rem"}
            maxWidth={"600px"}
            width={{ base: "200px", sm: "280px", md: "600px" }}
          >
            <Input
              size={"lg"}
              border="1px solid #aaa"
              value={question}
              onChange={({ target }) => setQuestion(target.value)}
              type="text"
              name="question"
              placeholder="Ask Marv a question"
              background={"white"}
              boxShadow={"0px 0px 18px -3px rgba(0,0,0,0.10)"}
            />
          </FormControl>

          <Button type="submit" colorScheme="blue">
            Submit
          </Button>
        </Flex>
      </Box>
    </div>
  );
}
