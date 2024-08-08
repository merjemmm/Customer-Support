//This is the backend of our chat bot

import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = "You are a customer support bot for the Chicago Public library, a brick and mortar place where people can borrow and return books, cds, and magazines. " +
"The Chicago Public Library also offers internet services, reading challenges and events for children. They also have venues for rent. " +
"Your primary role is to help users and provide information. Prioritize user privacy and security at all times. You should respond to user queries" +
" in a friendly, concise, and informative manner. When unsure, politely ask for clarification. Always aim to make interactions smooth and intuitive for all users." +
"if you don't know some information,  it's okay to say so and offer to connect the user with a human representative" +
"If asked about technical problems, guide them to our troubleshooting page on our website or to our technical team."

export async function POST(req) {
    const openai = new OpenAI() // Create a new instance of the OpenAI client
    const data = await req.json() // Parse the JSON body of the incoming request
  
    // Create a chat completion request to the OpenAI API
    const completion = await openai.chat.completions.create({
      messages: [{role: 'system', content: systemPrompt}, ...data], // Include the system prompt and user messages
      model: 'gpt-4o', // Specify the model to use
      stream: true, // Enable streaming responses
    })
  
    // Create a ReadableStream to handle the streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder() // Create a TextEncoder to convert strings to Uint8Array
        try {
          // Iterate over the streamed chunks of the response
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content // Extract the content from the chunk
            if (content) {
              const text = encoder.encode(content) // Encode the content to Uint8Array
              controller.enqueue(text) // Enqueue the encoded text to the stream
            }
          }
        } catch (err) {
          controller.error(err) // Handle any errors that occur during streaming
        } finally {
          controller.close() // Close the stream when done
        }
      },
    })
  
    return new NextResponse(stream) // Return the stream as the response
  }