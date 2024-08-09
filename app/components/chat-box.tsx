"use client";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";

export const ChatBox = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi, I'm the Headstarter Support Agent, how can I assist you today?`,
    },
  ]);

  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...messages, { role: "user", content: message }]),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    let result = "";

    const processText = async (
      readResult: ReadableStreamReadResult<Uint8Array>
    ): Promise<string | undefined> => {
      const { done, value } = readResult;

      if (done) {
        return result;
      }

      const text = decoder.decode(value, { stream: true });
      result += text;

      setMessages((messages) => {
        const lastMessage = messages[messages.length - 1];
        const otherMessages = messages.slice(0, messages.length - 1);
        return [
          ...otherMessages,
          { ...lastMessage, content: lastMessage.content + text },
        ];
      });

      const next = await reader?.read();
      if (next) {
        return processText(next);
      }
      return result;
    };

    await reader?.read().then(processText);
  };

  return (
    <Box
      width={"100vw"}
      height={"100vh"}
      className="flex flex-col justify-center items-center"
    >
      <Stack
        width={"600px"}
        height={"700px"}
        direction={"column"}
        spacing={3}
        border={"solid"}
        className="p-2"
      >
        <Stack
          direction={"column"}
          spacing={2}
          maxHeight={"100%"}
          className="flex-grow overflow-auto"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display={"flex"}
              justifyContent={
                message.role === "assistant" ? "flex-start" : "flex-end"
              }
            >
              <Box
                bgcolor={
                  message.role === "assistant"
                    ? "primary.main"
                    : "secondary.main"
                }
                color={"white"}
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction={"row"} spacing={2}>
          <TextField
            label="message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant="contained" onClick={sendMessage}>
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
