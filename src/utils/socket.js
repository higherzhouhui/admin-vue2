
let reTryTimes = 0; //重连次数
let isReTry = false;
import { getTokenHeader, getToken as getAllToken } from "@/utils/auth"; // get token from cookie

import store from '@/store'
//全局定义一个变量，用于打开关闭连接
const getWsUrl = () => {

    switch (location.host) {
        case "fbs-admin.testlive.vip":
            return "wss://fbs-wss.testlive.vip";
        case "admin.fbs98.com":
            return "wss://wss.fbs98.com";
        case "admin.fbslive.com":
            return "wss://wss.fbslive.com";
        default:
            return "wss://fbs-wss.testlive.vip";
    }
};
let ws;
const getToken = () => {
    let allToken = getAllToken()
    let headToken = getTokenHeader()
    let singleToken = allToken.replace(headToken, '')
    return singleToken
}
//定义打开连接的方法
const webSocket = () => {
    return new Promise((resolve, reject) => {
        ws = new WebSocket(`${getWsUrl()}?token=${getToken()}&username=${store.getters.name}`);
        // let res = [];
        ws.onopen = () => {
            if (ws.readyState === 1) {
                isReTry = false;
                console.log("websocket连接成功...");
                resolve(ws);
                heartCheck.reset().start();
            }
        };
        ws.onmessage = (e) => {
            let res = JSON.parse(e.data);
            if (res.protocol === 4000) {
                console.log("socket token失效");
            }
            if (res.protocol === 30001) {
                const myEvent = new Event("sendNotice")
                myEvent.noticeValue = res.data
                window.document.dispatchEvent(myEvent)
            }
        };
        ws.onclose = () => {
            console.log("websocket连接关闭...");
            reLink();
            reLinkPc();
        };
        ws.onerror = (err) => {
            reLinkPc();
            reject(err);
        };
    });
};
// 断线重连
const reLink = () => {
    if (isReTry) return;
    isReTry = true;
    if (!getToken()) return;
    setTimeout(() => {
        reTryTimes += 1;
        heartCheck.reset();
        webSocket();
    }, countTime() * 1000);
};

// 断线重连
const reLinkPc = () => {
    if (isReTry) return;
    isReTry = true;
    if (!getToken()) return;
    setTimeout(() => {
        reTryTimes += 1;
        heartCheck.reset();
        webSocket();
    }, countTime() * 1000);
};

const countTime = () => {
    if (reTryTimes < 3) {
        return 3;
    } else if (reTryTimes < 6) {
        return 10;
    } else if (reTryTimes < 10) {
        return 30;
    } else return 60;
};
// 心跳倒计时
const heartCheck = {
    timeout: 30000, //30秒
    timeoutObj: null,
    reset: function () {
        clearInterval(this.timeoutObj);
        return this;
    },
    start: function () {
        this.timeoutObj = setInterval(function () {
            ws.send(1);
        }, this.timeout);
    },
};

//定义关闭连接的方法
const close = () => {
    ws.close();
    ws = null
};





export { webSocket, close };
