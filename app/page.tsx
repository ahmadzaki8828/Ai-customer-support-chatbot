"use client";

import { Box, Stack } from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState({
    role: "assistant",
    content: `Hi, I'm the Headstarter Support Agent, how can I assit you today?`,
  });

  const [message, setMessage] = useState(" ");

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
        className="p-2 "
      >
        <Stack
          direction={"column"}
          spacing={2}
          maxHeight={"100%"}
          className="flex-grow overflow-auto"
        ></Stack>
      </Stack>
    </Box>
  );
}
