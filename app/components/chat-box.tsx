"use client";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

export const ChatBox = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi, I'm the Headstarter Support Agent, how can I assist you today?`,
    },
  ]);

  const [message, setMessage] = useState("");

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
          <Button variant="contained">Send</Button>
        </Stack>
      </Stack>
    </Box>
  );
};
