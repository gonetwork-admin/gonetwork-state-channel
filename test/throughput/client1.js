/*
* @Author: amitshah
* @Date:   2018-04-18 19:55:20
* @Last Modified by:   amitshah
* @Last Modified time: 2018-04-26 02:45:19
*/
const stateChannel= require('../../src/index.js');
const events = require('events');
const util = require("ethereumjs-util");
const message = stateChannel.message;
const channel = stateChannel.channel;


var pk1=util.toBuffer("0xb507928218b7b1e48f82270011149c56b6191cd1f2846e01c419f0a1a57acc42");
var pk2 =util.toBuffer("0x4c65754b227fb8467715d2949555abf6fe8bcba11c6773433c8a7a05a2a1fc78");
var pk3=util.toBuffer("0xa8344e81509696058a3c14e520693f94ce9c99c26f03310b2308a4c59b35bb3d");
var pk4=util.toBuffer("0x157258c195ede5fad2f054b45936dae4f3e1b1f0a18e0edc17786d441a207224");

 var acct1 = "0xf0c3043550e5259dc1c838d0ea600364d999ea15";
    var acct2 = "0xb0ae572146ab8b5990e069bff487ac25635dabe8";
    var acct3 = "0xff8a018d100ace078d214f02be8df9c6944e7a2b";
    var acct4 = "0xf77e9ef93380c70c938ca2e859baa88be650d87d";




function createEngine(address,privateKey,blockchainService){
    var e =  new stateChannel.Engine(address, function (msg) {
      console.log("SIGNING MESSAGE");
      msg.sign(privateKey)
    },blockchainService);
    return e;
}

var channelAddress = util.toBuffer("0x8bf6a4702d37b7055bc5495ac302fe77dae5243b");
var engine = createEngine(util.toBuffer(acct1),pk1);
 //SETUP AND DEPOSIT FOR ENGINES

engine.onChannelNew(channelAddress,
      util.toBuffer(acct1),
      util.toBuffer(acct4),
      channel.SETTLE_TIMEOUT);


engine.onChannelNewBalance(channelAddress,util.toBuffer(acct1), new util.BN(27000));
//END SETUP



//START  A DIRECT TRANSFER FROM ENGINE(0) to ENGINE(1)
var cl = console.log;

start = Date.now();
var transferredAmount = new util.BN(1);

var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://test.mosquitto.org')

engine.send = function(msg){
  client.publish(acct4,message.SERIALIZE(msg));
}
client.on('connect', function () {
  start = Date.now();
  for(var i=0; i < 1000; i++){
    transferredAmount = transferredAmount.add(new util.BN(1));
    engine.sendDirectTransfer(util.toBuffer(acct4),transferredAmount);
    //var msg = sendQueue[sendQueue.length -1];
  }
  end = Date.now();
  cl("Direct Transfers Sent Per SECOND per USER "+ 1000/((end - start)/1000));
})
 

