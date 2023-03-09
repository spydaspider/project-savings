const reloader = (urlPath,data) =>{
       for(let i = 0; i < data.length; i++)
       {
        fetch(urlPath,{
            method: "POST",
            headers: {"Content-type": "Application/json"},
            body: JSON.stringify(data[i])
        })
       }
}
export default reloader;