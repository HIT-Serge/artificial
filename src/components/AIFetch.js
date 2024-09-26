import React, { useEffect, useState, useContext } from 'react';
import { Mistral } from '@mistralai/mistralai';
import { PromptContext } from '../App';

export default function AIFetch() {
    // ... existing code ...

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [prompt, setPrompt] = useContext(PromptContext);

    const MistralFetch = async () => {
        const apiKey = process.env.REACT_APP_API_KEY;
        // const apiKey = 'unjqjopy9eMPoewgQPzFIWjRqKHeVF0p';
        const client = new Mistral({ apiKey: apiKey });
        setLoading(true);
        try {
            const chatResponse = await client.chat.complete({
                model: 'mistral-large-latest',
                messages: [{ role: 'user', content: `${prompt}` }],
            });
            setLoading(false);
            setData(chatResponse.choices[0].message.content);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {

        MistralFetch(); // Call the function inside useEffect

    }, [prompt]);


    return (
        <>
            {loading ? <p>Loading...</p> : <pre>{data}</pre>}
        </>
    )

}