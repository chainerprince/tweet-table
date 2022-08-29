import axios from "axios"


export const getData = async ()=>{
    const data = await axios.get('https://alivecore360.com/api/stats/v5?facebook_id=79000285101&days=30&type=posts,data&key=15d273cc-0b8a-4460-9cd8-55fa55a3e1c1&interval=total')
    return data.data;
}