import { ChatPromptTemplate } from "@langchain/core/prompts";



export default function AIFetchC() {



    const fetchData = async () => {
        const systemTemplate = "Translate the following into {language}:";
        const promptTemplate = ChatPromptTemplate.fromMessages([
            ["system", systemTemplate],
            ["user", "{text}"],
        ]);

        const promptValue = await promptTemplate.invoke({
            language: "italian",
            text: "hi",
        });

        console.log(promptValue);
    }

    return (
        <div>
            <h1>AIFetchC</h1>
        </div>
    )
}
