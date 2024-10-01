import React, { useState, useEffect } from 'react';
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";

const AIFetchD = () => {
    const [chat, setChat] = useState();
    const [result, setResult] = useState('');
    const [userInput, setUserInput] = useState('');
    const [chain, setChain] = useState();
    // console.log('chain', chain);
    // console.log('userInput', userInput);
    // const messageHistories = {};
    const [messageHistories, setMessageHistories] = useState({});
    // const [withMessageHistory, setWithMessageHistory] = useState();




    const prompt = ChatPromptTemplate.fromMessages([
        ["system", `You are a helpful assistant who remembers all details the user shares with you.`],
        ["placeholder", "{chat_history}"],
        ["human", "{input}"],
    ]);



    useEffect(() => {
        if (chain) {
            const withMessageHistory = new RunnableWithMessageHistory({
                runnable: chain,
                getMessageHistory: async (sessionId) => {
                    if (messageHistories[sessionId] === undefined) {
                        messageHistories[sessionId] = new InMemoryChatMessageHistory();
                    }
                    return messageHistories[sessionId];
                },
                inputMessagesKey: "input",
                historyMessagesKey: "chat_history",
            });
            setMessageHistories(withMessageHistory);
        }
    }, [chain]);



    useEffect(() => {
        // Initialize ChatMistralAI
        const chatInstance = new ChatMistralAI({
            model: "mistral-large-latest",
            temperature: 0,
            apiKey: process.env.REACT_APP_API_KEY2
        });
        setChat(chatInstance);
    }, []);

    useEffect(() => {
        // Pipe result
        if (chat) {
            const pipeResult = prompt.pipe(chat);
            setChain(pipeResult);
        }
    }, [chat]);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent form submission from reloading the page

        if (userInput) {
            console.log('chat', chat)
            // let response = await chat.invoke([
            //     new HumanMessage({ content: "Hi! I'm Bob" }),
            //     new AIMessage({ content: "Hello Bob! How can I assist you today?" }),
            //     new HumanMessage({ content: "What's my name?" }),
            // ]);




            const config = {
                configurable: {
                    sessionId: "abc2",
                },
            };

            const response = await messageHistories.invoke(
                {
                    input: "Hi! I'm Bob",
                },
                config
            );
            setResult(response.content);
            console.log('response', response.content);

            const config2 = {
                configurable: {
                    sessionId: "abc3",
                },
            };

            const response2 = await messageHistories.invoke(
                {
                    input: "What's my name?",
                },
                config2
            );

            const config3 = {
                configurable: {
                    sessionId: "abc2",
                },
            };

            const response3 = await messageHistories.invoke(
                {
                    input: "What's my name?",
                },
                config3
            );



            console.log('response', response.content);
            console.log('response2', response2.content);
            console.log('response3', response3.content);

        }
    };

    return (
        <div>
            <h1>AI Fetch D</h1>
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
                <h2>Result:</h2>
                <p>{result}</p>
            </div>
        </div>
    );
};

export default AIFetchD;