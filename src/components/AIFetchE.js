import React, { useState, useEffect } from 'react';
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import {
    RunnablePassthrough,
    RunnableSequence,
} from "@langchain/core/runnables";


const AIFetchE = () => {
    const [model, setModel] = useState();
    const [result, setResult] = useState('');
    const [userInput, setUserInput] = useState('');
    // console.log('userInput', userInput)
    const [chain, setChain] = useState();
    // const [messageHistories, setMessageHistories] = useState({});
    const [messageHistories2, setMessageHistories2] = useState({});
    // console.log('messageHistories2', messageHistories2)

    // const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const [messages, setMessages] = useState([]);
    // console.log('messages', messages)

    useEffect(() => {
        // Initialize ChatMistralAI
        const chatInstance = new ChatMistralAI({
            model: "mistral-large-latest",
            temperature: 0,
            apiKey: process.env.REACT_APP_API_KEY
        });
        setModel(chatInstance);
    }, []);

    const filterMessages = (input) => input.chat_history.slice(-10);

    const prompt = ChatPromptTemplate.fromMessages([
        ["system", `You are a helpful assistant who remembers all details the user shares with you.`],
        ["placeholder", "{chat_history}"],
        ["human", "{input}"],
    ]);


    // useEffect(() => {
    //     if (chain) {
    //         const withMessageHistory = new RunnableWithMessageHistory({
    //             runnable: chain,
    //             getMessageHistory: async (sessionId) => {
    //                 if (messageHistories[sessionId] === undefined) {
    //                     messageHistories[sessionId] = new InMemoryChatMessageHistory();
    //                 }
    //                 return messageHistories[sessionId];
    //             },
    //             inputMessagesKey: "input",
    //             historyMessagesKey: "chat_history",
    //         });
    //         setMessageHistories(withMessageHistory);
    //     }
    // }, [chain]);

    useEffect(() => {
        if (chain) {
            const withMessageHistory2 = new RunnableWithMessageHistory({
                runnable: chain,
                getMessageHistory: async (sessionId) => {
                    if (messageHistories2[sessionId] === undefined) {
                        const messageHistory = new InMemoryChatMessageHistory();
                        console.log('messageHistory', messageHistory)
                        await messageHistory.addMessages(messages);
                        messageHistories2[sessionId] = messageHistory;
                    }
                    return messageHistories2[sessionId];
                },
                inputMessagesKey: "input",
                historyMessagesKey: "chat_history",
            });
            setMessageHistories2(withMessageHistory2);
        }
    }
        , [chain]);

    // beter begrijpen
    useEffect(() => {
        if (model) {
            const chain2 = RunnableSequence.from([
                RunnablePassthrough.assign({
                    chat_history: filterMessages,
                }),
                prompt,
                model,
            ]);
            setChain(chain2);
        }
    }, []);



    const handleSubmit = async (e) => {
        if (userInput) {
            e.preventDefault(); // Prevent form submission from reloading the page
            setResult('');
            console.log('submit');

            if (messageHistories2.invoke) {
                const config5 = {
                    configurable: {
                        sessionId: "abc6",
                    },
                };


                // hier wordt de stream gemaakt ofwel alle tokens die 1 voor 1 terugkomen
                const stream = await messageHistories2.stream(
                    {
                        input: userInput,
                        chat_history: messages,
                    },
                    config5
                );

                let fullResult = '';

                for await (const chunk of stream) {
                    fullResult += chunk.content;
                    setResult(fullResult);
                }

                // Add user input to messages
                setMessages(prevMessages => [...prevMessages, new HumanMessage({ content: userInput })]);
                // Add AI response to messages
                setMessages(prevMessages => [...prevMessages, new AIMessage({ content: fullResult })]);
                // Clear user input
                setUserInput('');
            }
        }
    };

    return (
        <div>
            <h1>AI Fetch E</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Enter your question"
                />
                <button type="submit">Submit</button>
            </form>
            <div>
                {/* <h2>Result:</h2>
                <p>{result}</p> */}
            </div>
            <div>
                <h2>Chat History:</h2>
                {messages.map((message, index) => (
                    <p key={index}>
                        <strong>{message instanceof HumanMessage ? 'Human: ' : 'AI: '}</strong>
                        {message.content}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default AIFetchE;