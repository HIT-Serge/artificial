import axios from "axios";
import { useEffect, useState } from "react";

const useFetch = (param) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        // declare the data fetching function
        const apiKey = process.env.REACT_APP_API_KEY;

        let url = `${param}?api_key=${apiKey}&language=en-US`;


        axios
            .get(url)
            .then((response) => { setData(response.data); })
            .catch((error) => console.log(error));
    }, [param]);

    return [data];
};

// const useFetchWithQuery = (param, query, page) => {
//     const [data, setData] = useState([]);


//     useEffect(() => {
//         // declare the data fetching function
//         if (query !== null) {
//             const apiKey = process.env.REACT_APP_API_KEY;
//             let url = `${param}?api_key=${apiKey}&language=en-US&query=${query}&page=${page}`;
//             console.log('url', url);

//             axios
//                 .get(url)
//                 .then((response) => { setData(response.data); })
//                 .catch((error) => console.log(error));
//         }
//     }
//         , [param, query, page]);

//     return [data];

// };

export { useFetch as default, useFetchWithQuery };

