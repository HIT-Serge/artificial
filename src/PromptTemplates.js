import React, { useState, useEffect } from 'react';
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatPromptTemplate, SystemMessagePromptTemplate } from '@langchain/core/prompts';
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

    const handleSubmit = async () => {
        if (!chat) return;

        const template = "What would be a good company name for a {company_description}. List 3 company names that you like. Make sure that the list is a numbered list.";

        const systemMessagePrompt = SystemMessagePromptTemplate.fromTemplate(template);
        const chatPrompt = ChatPromptTemplate.fromMessages([systemMessagePrompt]);

        const formattedPrompt = chatPrompt.formatPrompt({ company_description: "Data engineering" });

        const parser = new StringOutputParser();
        const chain = chat.pipe(parser);

        const result = await chain.invoke(formattedPrompt.toChatMessages());

        setResult(result);
    };

    return (
        <div>
            <h1>Chat Models - Prompt Templates</h1>
            <button onClick={handleSubmit}>Generate Company Names</button>
            <div>
                <h2>Result:</h2>
                <pre>{result}</pre>
            </div>
        </div>
    );
};

export default ChatModels;