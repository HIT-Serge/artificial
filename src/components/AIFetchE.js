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
    const [chain, setChain] = useState();
    const [messageHistories, setMessageHistories] = useState({});

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const messages = [
        new HumanMessage({ content: "hi! I'm bob" }),
        new AIMessage({ content: "hi!" }),
        new HumanMessage({ content: "I like vanilla ice cream" }),
        new AIMessage({ content: "nice" }),
        new HumanMessage({ content: "whats 2 + 2" }),
        new AIMessage({ content: "4" }),
        new HumanMessage({ content: "thanks" }),
        new AIMessage({ content: "No problem!" }),
        new HumanMessage({ content: "having fun?" }),
        new AIMessage({ content: "yes!" }),
        new HumanMessage({ content: "That's great!" }),
        new AIMessage({ content: "yes it is!" }),
    ];

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


    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent form submission from reloading the page

        if (messageHistories.invoke) {

            // const config = {
            //     configurable: {
            //         sessionId: "abc2",
            //     },
            // };

            // const response = await messageHistories.invoke(
            //     {
            //         input: "Hi! I'm Bob",
            //     },
            //     config
            // );



            // const config2 = {
            //     configurable: {
            //         sessionId: "abc3",
            //     },
            // };

            // const response2 = await messageHistories.invoke(
            //     {
            //         input: "What's my name?",
            //     },
            //     config2
            // );

            // const config3 = {
            //     configurable: {
            //         sessionId: "abc2",
            //     },
            // };

            // const response3 = await messageHistories.invoke(
            //     {
            //         input: "What's my name?",
            //     },
            //     config3
            // );

            const response4 = await chain.invoke({
                chat_history: messages,
                input: "what's my name?",
            });
            const response5 = await chain.invoke({
                chat_history: messages,
                input: "what's my fav ice cream",
            });
            // setResult(response.content);
            // console.log('response', response.content);
            // console.log('response2', response2.content);
            // console.log('response3', response3.content);
            console.log('response4', response4.content);
            console.log('response5', response5.content);
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
                <h2>Result:</h2>
                <p>{result}</p>
            </div>
        </div>
    );
};



export default AIFetchE;