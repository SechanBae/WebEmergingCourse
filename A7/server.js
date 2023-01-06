/**
 * "StAuth10222: I Sechan Bae, 000803348 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else."
 */
const express = require("express")
var app=require('express')();
var redis = require("redis");
var http=require('http').Server(app);
var io=require('socket.io')(http);
app.use(express.json())

subClient = 
  redis.createClient(
     {url: "redis://redis-17320.c258.us-east-1-4.ec2.cloud.redislabs.com:17320"
     ,password: "XXXXXXXXXXXXXXX"
     }
  );
client = 
  redis.createClient(
     {url: "redis://redis-17320.c258.us-east-1-4.ec2.cloud.redislabs.com:17320"
     ,password: "XXXXXXXXXXXXXXX"
     }
  );


const paypal = require("@paypal/checkout-server-sdk")
let clientId = "XXXXXXXXXXXXXXXXXXX-oW5665FCim7toxpFyvJytlkPjB0GG5uTEZWYvuT0kvA7odmw-Zx_hx5-Da";
let clientSecret = "XXXXXXXXXXXXXXXXXXXSi9D3UDvY1Y6p7GoD5ytmuaAARtY-NCprn1HRa2H5pWra-RBOuP";
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let paypalClient = new paypal.core.PayPalHttpClient(environment);



app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});




client.del("item");
var id=1;
var redisItems=[];


subClient.on("message", function (channel, message) {
  var jsonData = JSON.parse(message);
  jsonData["id"] = id;
  const itemData = JSON.stringify(jsonData);
  client.hset("item", id, itemData);
  client.hget("item", id, function (err, reply) {
    if (err) {
      console.log(err);
    } else {
      redisItems.push(JSON.parse(reply));
    }
  });
  io.emit("getSingleItem", itemData);
  id++;
});


io.on("connection", (socket) => {
    socket.on("enterPage", (data) => {
      client.hgetall("item",function(err, reply) {
        if (err) {
          console.log(err);
        } else {
          if(reply){

            let array=Object.entries(reply);
            io.emit("getAllItems", array);
          }
        }
      });
    });
  });
subClient.subscribe("vegetables");
subClient.subscribe("fruits");
subClient.subscribe("breads");



app.post("/create-order", async (req, res) => {

  console.log(req.body);
  const cart=req.body.cartArray;
  var redisCart=[];
  for(const item of cart){
    console.log(item);
    redisCart.push((redisItems.find(i=>i.id==item.id)));
  }
  var sum=0;
  redisCart.forEach(i => {
    sum+=i.price;
  });
  
  const request = new paypal.orders.OrdersCreateRequest();

  request.prefer("return=representation")
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "CAD",
          value: sum,
          breakdown: {
            item_total: {
              currency_code: "CAD",
              value: sum,
            },
          },
        },
        items:redisCart.map(i=>{
          const item={};
          item["name"]=i.type;
          item["unit_amount"]={
            currency_code:"CAD",
            value:i.price
          };
          item["quantity"]=1;
          return item;
        }),
      },
    ],
  })

  try {
    const order = await paypalClient.execute(request)
    res.json({ id: order.result.id })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})
http.listen(3000, function(){
    console.log('listening on *:3000');
});
  