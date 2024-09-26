// The ChatMistralAI import is used to create an instance of the Mistral AI model for chat interactions.
import { ChatMistralAI } from "@langchain/mistralai";
// The HumanMessage and SystemMessage imports are used to structure the messages sent to the AI model, 
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
// allowing for a clear distinction between user input and system instructions.
// The StringOutputParser import is used to parse the output from the AI model, ensuring that the response is in a format that can be easily used in the application.
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { useContext, useEffect, useState } from "react";
import { PromptContext } from '../App';

export default function AIFetchB() {
    const [prompt, setPrompt] = useContext(PromptContext);
    // console.log(prompt)
    const [output, setOutput] = useState('')

    useEffect(() => {
        // het model dat je gebruikt met apikey (Object)
        const model = new ChatMistralAI({
            model: "mistral-large-latest",
            temperature: 0,
            apiKey: process.env.REACT_APP_API_KEY
        });

        // messages: SystemMessage = instructies voor de AI. HumanMessage = input van de gebruiker.
        const messages = [
            new SystemMessage(`Translate the following from English into ${prompt.language}`),
            new HumanMessage(prompt.text),
        ];
        // StringOutputParser haalt alleen de string uit alle metadata die je terugkrijgt
        const parser = new StringOutputParser();
        // Wanneer je pipe gebruikt, hoef je de uitvoer van het model niet handmatig door te geven aan de parser met invoke. De pipe-methode zorgt ervoor dat de uitvoer automatisch naar de parser gaat.
        const chain = model.pipe(parser);

        const fetchData = async () => {
            // const changedResult = await chain.invoke(messages);
            // console.log(changedResult);
            // setOutput(changedResult);

            // const language = 'dutch';
            const systemTemplate = `Translate the following into ${prompt.language}:`;
            const promptTemplate = ChatPromptTemplate.fromMessages([
                ["system", systemTemplate],
                ["user", `${prompt.text}`],
            ]);

            const promptValue = await promptTemplate.invoke({
                language: prompt.language,
                text: prompt.text,
            });
            console.log('promptValue', promptValue)
            const chatMessages = promptValue.toChatMessages();
            console.log('chatMessages', chatMessages);

            const llmChain = promptTemplate.pipe(model).pipe(parser);
            const llmChainResponse = await llmChain.invoke({ language: prompt.language, text: prompt.text });
            setOutput(llmChainResponse);
        };

        fetchData();
        console.log('fetch')
    }, [prompt]);


    return (
        <div>
            <h1>AIFetchB </h1>
            <div>{output}</div>
        </div>
    )
}

// const result = await model.invoke(messages);
// console.log(result);

/**
 * The `invoke` method is a key function in the context of the ChatMistralAI model.
 * It is used to send a series of messages to the model and receive a response based on those messages. *
 * When `invoke` is called, it processes the input messages, which can include both system instructions
 * (like setting the context or task) and user messages (the actual input from the user). *
 * The method returns a promise that resolves to the model's output, which can be further processed
 * or parsed as needed. This allows for dynamic interactions with the AI model, enabling it to
 * generate responses based on the provided context and user input.
 */

// await model.invoke(messages);

// const parsedResult = await parser.invoke(result);
// console.log(parsedResult);

// Wanneer je pipe gebruikt, hoef je de uitvoer van het model niet handmatig door te geven aan de parser met invoke (bovenstaande code). De pipe-methode zorgt ervoor dat de uitvoer automatisch naar de parser gaat.

// const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// const fetchDataWithDelay = async () => {
//     await delay(1000); // Adjust the delay as neededfetchData();
// };