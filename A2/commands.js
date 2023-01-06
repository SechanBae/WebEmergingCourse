//"StAuth10222: I Sechan Bae, 000803348 certify that this material is my original work. No other person's work has been used without due acknowledgement.
// I have not made my work available to anyone else."
const axios = require("axios");
const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({
  intents: [ GatewayIntentBits.Guilds,
		         GatewayIntentBits.GuildMessages,
		         GatewayIntentBits.MessageContent, ],
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
});

client.on('messageCreate', async message => {


  if (!message.author.bot)
  {
    
    command = message.content.split(" ");
    if (command[0] == "StockInfo")
    {
        if(command[1]&&command[2]==undefined){
          const encodedParams = new URLSearchParams();
          encodedParams.append("symbol", command[1]);
    
          const sendRequestStockInfo= async()=>{
            try{
              const response=await axios({
                method: 'POST',
                url: 'https://yahoo-finance97.p.rapidapi.com/stock-info',
                headers: {
                  'content-type': 'application/x-www-form-urlencoded',
                  'X-RapidAPI-Key': 'cd1c375a0emsh552299b8e158ec9p123b9ajsnd7ea6fd2a620',
                  'X-RapidAPI-Host': 'yahoo-finance97.p.rapidapi.com'
                },
                data: encodedParams
              });
              data=response.data.data;
              let reply;
              if(data.longName){
                reply=command[1]+" stands for "+data.longName+", they are located in "+data.state+", "+data.country+" at "+data.address1+". and they are part of the "+
                data.sector+" sector and "+data.industry+" industry, you can find their website at :"+data.website;
              }
              else{
                reply="Stock with name "+command[1]+" does not exist";
              }
              await message.reply(reply);
            }catch(err){
              await message.reply("Something went wrong with the API");
              console.error(err);
            }
          }
          sendRequestStockInfo();
        }
        else{
          await message.reply("You must follow the format 'StockInfo [symbol]'")
        }
    }
    else if (command[0] == "StockPrice")
    {
        if(command[1]&&command[2]==undefined){
          const encodedParams = new URLSearchParams();
          encodedParams.append("symbol", command[1]);
          encodedParams.append("period", "1d");
    
          const sendRequestStockPrice= async()=>{
            try{
              const response=await axios({
                method: 'POST',
                url: 'https://yahoo-finance97.p.rapidapi.com/price',
                headers: {
                  'content-type': 'application/x-www-form-urlencoded',
                  'X-RapidAPI-Key': 'cd1c375a0emsh552299b8e158ec9p123b9ajsnd7ea6fd2a620',
                  'X-RapidAPI-Host': 'yahoo-finance97.p.rapidapi.com'
                },
                data: encodedParams
              });
              data=response.data.data[0];
              let reply;
              if(data){
                reply="In the past 24 hours, "+command[1]+" stock has opened at $"+data.Open.toFixed(2)+", closed at $"+data.Close.toFixed(2)+". Reaching a high of $"+
                data.High.toFixed(2)+" and reaching a low of $"+data.Low.toFixed(2);
              }
              else{
                reply="Stock with name "+command[1]+" does not exist";
              }
              await message.reply(reply);
            }catch(err){
              await message.reply("Something went wrong with the API");
              console.error(err);
            }
          }
          sendRequestStockPrice();
        }
        else{
          await message.reply("You must follow the format 'StockPrice [symbol]'")
        }
      
    }
    else if (command[0] == "CurrencyConverter")
    {
        if(command[1]&&command[2]&&command[3]&&command[4]==undefined){
        const sendRequestCurrencyConverter= async()=>{
          try{
            const response=await axios({
              method: 'GET',
              url: 'https://currency-converter5.p.rapidapi.com/currency/convert',
              headers: {
                'X-RapidAPI-Key': 'cd1c375a0emsh552299b8e158ec9p123b9ajsnd7ea6fd2a620',
                'X-RapidAPI-Host': 'currency-converter5.p.rapidapi.com'
              },
              params:{format: 'json', from: command[1], to: command[2], amount: command[3]}
            });
            data=response.data;
            rates=data.rates[command[2].toUpperCase()];
            let reply;
            reply=data.amount+" in "+data.base_currency_name+ " is "+rates.rate_for_amount+" in "+rates.currency_name+" at the rate of :"+rates.rate;
            await message.reply(reply);
          }catch(err){
            await message.reply("You must follow the format 'CurrencyConverter [from] [to] [amount]' with valid currencies");
            console.error(err);
          }
        }
        sendRequestCurrencyConverter();
      }
      else{
        await message.reply("You must follow the format 'CurrencyConverter [from] [to] [amount]' with valid currencies")
      }
    }


    else if (command[0] == "HistoricalCurrencyConverter")
    {
        if(command[1]&&command[2]&&command[3]&&command[4]&&command[5]==undefined){
        const sendRequestHistoricalCurrencyConverter= async()=>{
          try{
            const response=await axios({
              method: 'GET',
              url: 'https://currency-converter5.p.rapidapi.com/currency/historical/'+command[4],
              params:{format: 'json', from: command[1], to: command[2], amount: command[3]},
              headers: {
                'X-RapidAPI-Key': 'cd1c375a0emsh552299b8e158ec9p123b9ajsnd7ea6fd2a620',
                'X-RapidAPI-Host': 'currency-converter5.p.rapidapi.com'
              }
            });
            data=response.data;
            rates=data.rates[command[2].toUpperCase()];
            let reply;
            reply="On "+data.updated_date+", "+data.amount+" in "+data.base_currency_name+ " is "+rates.rate_for_amount+" in "+rates.currency_name+" at the rate of :"+rates.rate;
            await message.reply(reply);
          }catch(err){
            await message.reply("You must follow the format 'HistoricalCurrencyConverter [from] [to] [amount] [date in YYYY-MM-dd]' with valid currencies");
            console.error(err);
          }
        }
        sendRequestHistoricalCurrencyConverter();
      }
      else{
        await message.reply("You must follow the format 'HistoricalCurrencyConverter [from] [to] [amount] [date in YYYY-MM-dd]' with valid currencies")
      }
    }


    else if (command[0] == "CryptoCurrencyConverter")
    {
        if(command[1]&&command[2]&&command[3]==undefined){
        const sendRequestCryptoCurrencyConverter= async()=>{
          try{
            const response=await axios({
              method: 'GET',
              url: 'https://alpha-vantage.p.rapidapi.com/query',
              params: {from_currency: command[1], function: 'CURRENCY_EXCHANGE_RATE', to_currency: command[2]},
              headers: {
                'X-RapidAPI-Key': 'cd1c375a0emsh552299b8e158ec9p123b9ajsnd7ea6fd2a620',
                'X-RapidAPI-Host': 'alpha-vantage.p.rapidapi.com'
              }
            });
            data=response.data['Realtime Currency Exchange Rate'];
            let reply;
            if(data){
              reply="The Exchange rate for "+data['2. From_Currency Name']+" to "+data['4. To_Currency Name']+" is "+data['5. Exchange Rate'];
            }
            else{
              reply="You must follow the format 'CryptoCurrencyConverter [from] [to]' with valid currencies";
            }
            await message.reply(reply);
          }catch(err){
            console.error(err);
            if(err.response.status==429){
              await message.reply("Please wait a minute, exceeded api calls within a minute");
            }
            else{
              await message.reply("Something went wrong with the API");
            }
          }
        }
        sendRequestCryptoCurrencyConverter();
      }
      else{
        await message.reply("You must follow the format 'CryptoCurrencyConverter [from] [to]' with valid currencies")
      }
    }
  }
});

client.login("MTAzMTc0MzYwMzk5Njg5MzIzNA.GYvoaX.1zVZuT83NxMYtsFLoOAzEyusFWLBXOlXMbyNjU");