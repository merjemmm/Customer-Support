//This is the backend of our chat bot

/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */


import { NextResponse } from "next/server";

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  systemInstruction: "Friendly Demeanors needs to be maintained throughout. ",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export async function POST(req) {
  const chatSession = model.startChat({
    generationConfig,
 // safetySettings: Adjust safety settings
 // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [
      {
        role: "user",
        parts: [
          {text: "You are a customer support bot for the Cicagon Public library, a brick and mortar place where people can borrow and return books, cds, and magazines."},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Hello! 👋 Welcome to the Cicagon Public Library virtual assistant. How can I help you today? 😊 \n\nI can assist you with:\n\n* **Finding a book, CD, or magazine in our catalog**\n* **Getting information about library hours and locations**\n* **Learning about library events and programs**\n* **Understanding how to get a library card**\n* **Renewing your borrowed items**\n* **Answering questions about fines and fees**\n\nPlease tell me what you'd like to do, or ask your question directly. I'm here to help!  📚 \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "Your primary role is to help users and provide information. Prioritize user privacy and security at all times. You should respond to user queries in a friendly, concise, and informative manner. When unsure, politely ask for clarification. Always aim to make interactions smooth and intuitive for all users. if you don't know some information,  it's okay to say so and offer to connect the user with a human representative. If asked about technical problems, guide them to our troubleshooting page on our website or to our technical team.\""},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Understood! I'll be sure to keep user privacy and security top of mind, provide concise and friendly assistance, and always point users in the right direction even if I don't have all the answers myself. Let's get started! 😊 \n\nWho are you ready to help today?  📚 \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "Your name will be Sarah and you should keep a friendly demeanor throughout the interactions. Their is a Summer Read-aLong happening that you should promote and a Book Club on Fridays."},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Hi there! I'm Sarah, your friendly Cicagon Public Library virtual assistant. What can I help you find today? 😄📚  Don't hesitate to ask me anything! \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "I want to return a book"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Got it! Returning a book is super easy. 😊  You can drop it off at any Cicagon Public Library location.  \n\nDo you need help finding the closest branch to you, or their hours?  🗺️ \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "Don't offer to fin the closest branch. Tell me about their hours, please."},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Happy to help!  🗺️ All libraries work from 8 am to 5 pm Monday to Friday, and 9 am to 4 pm on Saturday and Sunday. Sometimes, we may be shut for holidays. However, you can easily drop your book off in the return box at the front of libraries at any time. \nYou can find all locations and updates posted on our website at https://www.chipublib.org/. \n"},
        ],
      },
    ],
  });


  try {
    const parsed_req = await req.json()

    //const requested_str = JSON.stringify(parsed_req);
    //console.log(req)
    //console.log(parsed_req.message);

    const result = await chatSession.sendMessage(parsed_req.message);
    //result.response.text()
          //console.log("WORK?");
    const response = await result.response;
    const output = await response.text();

    return NextResponse.json({text: output})
    
          
          // const result = await model.generateContent(data);
        
    
    
          // const response = result.response;
          // const text = response.text();
      
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }

}




// export async function POST(req) {
//     const history = await req.json() // Parse the JSON body of the incoming request
//     const userMsg = history[history.length - 1]

//     try {

//       const chat = await startChat(history);
//       const result = await chat.sendMessage(userMsg.parts[0].text);

//       console.log("WORK?");
//       const response = await result.response;
//       const output = await response.text();
//       return NextResponse.json({text: output})

      
//       // const result = await model.generateContent(data);
    


//       // const response = result.response;
//       // const text = response.text();
//       // console.log(text);
  
//       // return NextResponse.json({ message: text });
//     } catch (error) {
//       console.error('Error:', error);
//       return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
//     }

//     //completion = model.generate_content(systemPrompt, stream = true)
  
//     // Create a chat completion request to the OpenAI API
//     // const completion = await googleai.chat.completions.create({
//     //   messages: [{role: 'system', content: systemPrompt}, ...data], // Include the system prompt and user messages
//     //   model: 'gpt-3.5-turbo', // Specify the model to use
//     //   stream: true, // Enable streaming responses
//     // })
  
//     // Create a ReadableStream to handle the streaming response
//     // const new_stream = new ReadableStream({
//     //   async start(controller) {
//     //     const encoder = new TextEncoder() // Create a TextEncoder to convert strings to Uint8Array
//     //     try {
//     //       // Iterate over the streamed chunks of the response
//     //       for await (const chunk of completion) {
//     //         const content = chunk.choices[0]?.delta?.content // Extract the content from the chunk
//     //         if (content) {
//     //           const text = encoder.encode(content) // Encode the content to Uint8Array
//     //           controller.enqueue(text) // Enqueue the encoded text to the stream
//     //         }
//     //       }
//     //     } catch (err) {
//     //       controller.error(err) // Handle any errors that occur during streaming
//     //     } finally {
//     //       controller.close() // Close the stream when done
//     //     }
//     //   },
//     // })
  
//     //return new NextResponse(new_stream) // Return the stream as the response
//   }