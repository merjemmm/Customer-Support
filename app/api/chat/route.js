//This is the backend of our chat bot

import { NextResponse, NextRequest } from "next/server";
//import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

const systemPrompt = "You are a customer support bot for the Chicago Public library, a brick and mortar place where people can borrow and return books, cds, and magazines. " +
"The Chicago Public Library also offers internet services, reading challenges and events for children. They also have venues for rent. " +
"Your primary role is to help users and provide information. Prioritize user privacy and security at all times. You should respond to user queries" +
" in a friendly, concise, and informative manner. When unsure, politely ask for clarification. Always aim to make interactions smooth and intuitive for all users." +
"if you don't know some information,  it's okay to say so and offer to connect the user with a human representative" +
"If asked about technical problems, guide them to our troubleshooting page on our website or to our technical team."

const googleai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY) // Create a new instance of the OpenAI client
const model = googleai.getGenerativeModel({model : "gemini-pro", 
systemInstruction: "You are a customer support bot for the Chicago Public library, a brick and mortar place where people can borrow and return books, cds, and magazines."});

//console.log('API KEY:', process.env.GEMINI_API_KEY)

export async function POST(req) {
    const data = await req.json() // Parse the JSON body of the incoming request

    try {
      
      const result = await model.generateContent(data);
      console.log("WORK?");


      const response = result.response;
      const text = response.text();
      console.log(text);
  
      return NextResponse.json({ message: text });
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }

    //completion = model.generate_content(systemPrompt, stream = true)
  
    // Create a chat completion request to the OpenAI API
    // const completion = await googleai.chat.completions.create({
    //   messages: [{role: 'system', content: systemPrompt}, ...data], // Include the system prompt and user messages
    //   model: 'gpt-3.5-turbo', // Specify the model to use
    //   stream: true, // Enable streaming responses
    // })
  
    // Create a ReadableStream to handle the streaming response
    // const new_stream = new ReadableStream({
    //   async start(controller) {
    //     const encoder = new TextEncoder() // Create a TextEncoder to convert strings to Uint8Array
    //     try {
    //       // Iterate over the streamed chunks of the response
    //       for await (const chunk of completion) {
    //         const content = chunk.choices[0]?.delta?.content // Extract the content from the chunk
    //         if (content) {
    //           const text = encoder.encode(content) // Encode the content to Uint8Array
    //           controller.enqueue(text) // Enqueue the encoded text to the stream
    //         }
    //       }
    //     } catch (err) {
    //       controller.error(err) // Handle any errors that occur during streaming
    //     } finally {
    //       controller.close() // Close the stream when done
    //     }
    //   },
    // })
  
    //return new NextResponse(new_stream) // Return the stream as the response
  }