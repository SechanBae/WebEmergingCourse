/**
 * "StAuth10222: I Sechan Bae, 000803348 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else."
 */
var app=require('express')();
var http=require('http').Server(app);
var io=require('socket.io')(http);

app.get('/auctioneer',function(req,res){
    res.sendFile(__dirname+'/auctioneer.html');
});

app.get('/bidder',function(req,res){
    res.sendFile(__dirname+'/bidder.html');
})
var highestBid;
var highestBidder;
io.on('connection',function(socket){
    //when auctioneer starts auction 
     socket.on("auctionStart",function(auctionData){
        highestBid=auctionData.price;
        highestBidder="auctioneer";
        socket.broadcast.emit("deliverAuction",
        {
            price:auctionData.price,
            itemName:auctionData.name,
            highestBidder:"auctioneer",
            time:auctionData.time
        });
     });
     //when bidder sends bid
     socket.on("submitBid",function(bidData){
        socket.broadcast.emit("deliverBidUpdate",bidData);
        io.to(socket.id).emit("deliverBidUpdate",bidData);
     });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
  