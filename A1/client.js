// "StAuth10222: I Sechan Bae, 000803348 certify that this material is my original work.
// No other person's work has been used without due acknowledgement. I have not made 
// my work available to anyone else."
const axios = require('axios');
const movie1={
    "title": "Gladiator",
    "release_year": "2000",
    "time_viewed": "2017-10-03T11:45:56.200"
}
const movie2={
    "title": "Avengers: Infinity War",
    "release_year": "2019",
    "time_viewed": "2019-12-03T15:20:20.200"
};
const movie3={
    "title": "Avengers: Endgame",
    "release_year": "2020",
    "time_viewed": "2020-12-03T15:20:20.200"
}
const movieCollection=[
    {
        "title":"Sharknado 1",
        "release_year":"2005",
        "time_viewed":"2005-10-03T11:45:56.200"
    },
    {
        "title":"Sharknado 2",
        "release_year":"2006",
        "time_viewed":"2006-10-03T11:45:56.200"
    },
    {
        "title":"Sharknado 3",
        "release_year":"2007",
        "time_viewed":"2008-10-03T11:45:56.200"
    },
    {
        "title":"Sharknado 4",
        "release_year":"2008",
        "time_viewed":"2009-10-03T11:45:56.200"
    }
]
// We'll need to use axios inside an async function if we want to use await
async function test()
{
  // we can use try-catch to handle any errors
  try {
    
    // test 1 step 1
    await axios.post('http://localhost:3000/api',movie1);
    await axios.post('http://localhost:3000/api',movie2);
    //test 1 step 2
    await axios.put('http://localhost:3000/api/2',movie3);
    //test 1 step 3
    const data1=await axios.get('http://localhost:3000/api/1');
    const data2=await axios.get('http://localhost:3000/api/2');
    if(data1.data.title!=movie1.title||data2.data.title!=movie3.title){
        throw "FAILED TEST # 1: movies don't match";
    }

    //test 2 step 1
    await axios.put('http://localhost:3000/api',movieCollection);
    //test 2 step 2
    const data3=await axios.get('http://localhost:3000/api');
    if (data3.data[0].title!="Sharknado 1"||data3.data[1].title!="Sharknado 2"||data3.data[2].title!="Sharknado 3"||data3.data[3].title!="Sharknado 4"){
        throw "FAILED TEST # 2: movies don't match";
    }
    //test 2 step 3
    await axios.delete('http://localhost:3000/api/4');
    //test 2 step 4
    const data4=await axios.get('http://localhost:3000/api');
    if (data4.data[0].title!="Sharknado 1"||data4.data[1].title!="Sharknado 2"||data4.data[2].title!="Sharknado 3"){
        throw "FAILED TEST # 2: movies don't match";
    }
    //test 2 step 5
    await axios.delete('http://localhost:3000/api');
    //test 2 step 6
    const data5=await axios.get('http://localhost:3000/api');
    if (data5.data.length>0){
        throw "FAILED TEST # 2: Collection isn't empty";
    }
    console.log("ALL TESTS SUCCESSFUL");
  } catch (error) {
    console.error(error);
  }	
}

// call our test function
test();
