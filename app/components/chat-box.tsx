"use client";
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { MedicalServices } from "@mui/icons-material";

export const ChatBox = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I am your First Aid Assistant. How can I help you with emergency advice today?",
    },
  ]);

  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null); // Add type here

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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundColor: "#E0F7FA", // Light blue background
        padding: "2%",
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center" mb={3}>
        <MedicalServices sx={{ fontSize: 40, color: "#FF4C4C" }} />
        <Typography
          variant="h4"
          fontWeight="600"
          sx={{
            color: "#FF4C4C", // Bright red for headings
            fontFamily: "Arial, sans-serif", // Changed font for heading
          }}
        >
          First Aid Chatbot
        </Typography>
      </Stack>
      <Box
        sx={{
          width: { xs: "100%", sm: "80%", md: "60%", lg: "50%" },
          bgcolor: "#FFFFFF", // White background for the chat area
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          position: "relative",
        }}
      >
        <Stack
          spacing={2}
          sx={{
            height: "400px",
            overflowY: "auto",
            padding: "8px",
          }}
        >
          {messages.map((msg, index) => (
            <Paper
              key={index}
              elevation={3}
              sx={{
                padding: "12px",
                backgroundColor:
                  msg.role === "assistant" ? "#FFEBEE" : "#ff8e99",
                color: "#000000",
                alignSelf: msg.role === "assistant" ? "flex-start" : "flex-end",
                borderRadius:
                  msg.role === "assistant"
                    ? "12px 12px 12px 0px"
                    : "12px 12px 0px 12px",
                maxWidth: "80%",
              }}
            >
              {msg.content.split("\n").map((line, i) => (
                <Typography key={i} paragraph={i > 0}>
                  {line}
                </Typography>
              ))}
            </Paper>
          ))}
          <div ref={messagesEndRef} />
        </Stack>

        <Stack direction="row" spacing={2} mt={2}>
          <TextField
            label="Type your message..."
            fullWidth
            variant="filled"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            InputProps={{
              sx: {
                backgroundColor: "#E0F2F1",
                color: "#000000",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "#B2DFDB",
                },
                "& .MuiInputLabel-root": {
                  color: "#004D40",
                },
                "& .MuiFilledInput-underline:before": {
                  borderBottomColor: "transparent",
                },
                "& .MuiFilledInput-underline:after": {
                  borderBottomColor: "#FF4C4C",
                },
              },
            }}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            sx={{
              bgcolor: "#FF4C4C",
              color: "#FFFFFF",
              borderRadius: "8px",
              "&:hover": {
                bgcolor: "#C62828",
              },
            }}
          >
            Send
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};
