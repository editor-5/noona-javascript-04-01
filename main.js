const API_key = `1234567890abcdef1234567890abcdef`; // 발급받은 API 키를 넣어주세요
let news = []; 
const getLatestNews = async () => {
    const url = new URL(
        //`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_key}`
        `https://noona-times-be-5ca9402f90d9.herokuapp.com/T&apiKey=${API_key}`
         
    );
   
    const response = await fetch(url);
    const data = await response.json();
    news = data.articles;
    console.log("ddd", news);
};

getLatestNews();
