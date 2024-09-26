import React, { useState, useContext } from 'react';
import { PromptContext } from '../App';

const PromptBar = ({ items, onSearch }) => {
    const [query, setQuery] = useState({ text: 'wat een mooie tulpen', language: 'english' });
    // console.log('query', query)
    const [prompt, setPrompt] = useContext(PromptContext);
    // console.log('prompt', prompt)

    // const handleQuery = (e) => {
    //     const value = e.target.value;
    //     console.log(e.target);
    //     setQuery(value);

    // };

    const handleSubmit = (e) => {
        // if (e.key == 'Enter') {
        e.preventDefault(); // Voorkomt de standaard formulieractie
        setPrompt(query);
        // setQuery({ text: '', language: '' });
        // }
    }


    return (
        <div>

            <form onSubmit={handleSubmit}>

                <label>

                    Tekst:
                    <input
                        type="text"
                        placeholder="Voer tekst in..."
                        value={query.text}
                        onChange={(e) => setQuery({ ...query, text: e.target.value })}
                    />
                </label>

                <label>

                    naar Taal:
                    <input
                        type="text"
                        placeholder="Voer taal in..."
                        value={query.language}
                        onChange={(e) => setQuery({ ...query, language: e.target.value })}
                    />
                </label>
                <button onClick={handleSubmit} type="submit">Verzenden</button>

            </form>
        </div>

    );
};

export default PromptBar;