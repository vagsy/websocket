var WebSocketServer = require('ws').Server,
wss = new WebSocketServer({ port: 8181 });
var stocks = [
            '注重学习和交流', '分手大师', '精品源码下载', '今天天气很好', '你是我的唯一吗？', '为什么相爱的人不能在一起？', '我的天啊', '亲亲我的宝贝', '啦啦啦德玛西亚', '终于看到我啦','容易产生静电，尤其是当','会造成电机的损坏，也不要直接用热水浇','雨刷以及玻璃被','车小常识了解一下','款的裤装腰带装饰让','羊剪绒、短毛绒等，颜色以','开始，汽车坐垫销售开始进入旺季','未果，切记保存好遗','员进行了专业培训学','务，耐心、细心地为旅'
    ];
var outputStr = '';



function randomInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
var stockUpdater;
var randomStockUpdater = function() {
    outputStr = stocks[Math.floor (Math.random () * stocks.length)];
    var randomMSTime = randomInterval(500, 2500);
    stockUpdater = setTimeout(function() {
        randomStockUpdater();
    }, 2000);
}
randomStockUpdater();
var clientStocks = [];
wss.on('connection', function (ws) {
    var sendStockUpdates = function (ws) {
        if (ws.readyState == 1) {
            ws.send(outputStr);
            console.log("更新", outputStr);
        }
    }
    var clientStockUpdater = setInterval(function () {
        sendStockUpdates(ws);
    }, 5000);
    ws.on('message', function (message) {
        var stockRequest = JSON.parse(message);
        console.log("收到消息", stockRequest);
        clientStocks = stockRequest['stocks'];
        sendStockUpdates(ws);
    });
    ws.on('close', function () {
        if (typeof clientStockUpdater !== 'undefined') {
            clearInterval(clientStockUpdater);
        }
    });
});