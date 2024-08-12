//Now, this is our front end and controls how our page actually looks

'use client'

import { Box, Button, Stack, TextField, ThemeProvider, Typography, createTheme } from '@mui/material';
import { useState, useRef, useEffect } from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#56BB73',
      //light: '#90E1D6',
      //dark: '#219C8C',
      //contrastText: '#242105'
    },
    secondary: {
      main: '#00C037',
    },
  },

  typography: {
    h1: {
      fontSize: '3rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
  },

})

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi there! I'm Sarah, your friendly Cicagon Public Library virtual assistant. What can I help you find today? 😄📚  Don't hesitate to ask me anything!",
    },
  ])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)


  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true)  // Don't send empty messages

    setMessage('')  // Clear the input field
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },  // Add the user's message to the chat
      { role: 'assistant', content: '' },  // Add a placeholder for the assistant's response
    ])

    // Send the message to the server
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),  // Only send the user's message
    })

    const assistantResponse = await response.json()  // Parse the JSON response

    setMessages((messages) => {
      let lastMessage = messages[messages.length - 1]  // Get the last message (assistant's placeholder)
      let otherMessages = messages.slice(0, messages.length - 1)  // Get all other messages
      return [
        ...otherMessages,
        { role: 'assistant', content: assistantResponse.text },  // Update the assistant's message with the response text
      ]
    })
    
    setIsLoading(false)
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])


  return (
    <ThemeProvider theme = {theme}>
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor= "#D0E7D7"
    >
      <Box
      width = "600px"
      height = "50px"
      display="flex"
      justifyContent="center"
      alignItems="center"
      border="2px solid green"
      bgcolor = "#B1F0C3"> 
        <Typography> For quick questions, chat with our AI </Typography>
      </Box>
      <Stack
        direction={'column'}
        width="600px"
        height="650px"
        border="2px solid green"
        p={2}
        spacing={3}
        bgcolor= "#DAF5E2"
      >
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                  message.role === 'assistant'
                    ? 'primary.main'
                    : 'secondary.main'
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}

        <div ref={messagesEndRef} />
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress = {handleKeyPress}
            disabled = {isLoading}
          />
          <Button variant="contained" onClick={sendMessage}
          disabled = {isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </Stack>
      </Stack>
    </Box>
    </ThemeProvider>
  )
}
