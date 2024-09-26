import React, { useState, useEffect } from 'react';
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";

const ChatModels = () => {
    const [chat, setChat] = useState(null);
    const [result, setResult] = useState('');

    useEffect(() => {
        // Initialize ChatMistralAI
        const chatInstance = new ChatMistralAI({
            model: "mistral-large-latest",
            temperature: 0,
            apiKey: process.env.REACT_APP_API_KEY
        });
        setChat(chatInstance);
    }, []);

    const handleHumanMessage = async () => {
        if (!chat) return;

        const text = "What would be a good company name for a company that makes colorful socks?";
        const messages = [new HumanMessage(text)];
        const parser = new StringOutputParser();
        const chain = chat.pipe(parser);
        const response = await chain.invoke(messages);
        setResult(response);
    };

    const handleSystemMessage = async () => {
        if (!chat) return;

        const text = "You are a creative naming expert for quirky companies.";
        const humanText = "What would be a good company name for a company that makes colorful socks?";
        const messages = [
            new SystemMessage(text),
            new HumanMessage(humanText)
        ];
        const parser = new StringOutputParser();
        const chain = chat.pipe(parser);
        const response = await chain.invoke(messages);
        setResult(response);
    };

    return (
        <div>
            <h1>Chat Models</h1>
            <button onClick={handleHumanMessage}>Send Human Message</button>
            <button onClick={handleSystemMessage}>Send System Message</button>
            <div>
                <h2>Result:</h2>
                <p>{result}</p>
            </div>
        </div>
    );
};

export default ChatModels;