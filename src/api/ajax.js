/*
能发送异步 ajax 请求的函数模块
封装 axios 库
函数的返回值是 promise 对象

优化1：统一处理异常
     在外层包一个自己创建的 promise 对象
     在请求出错时，不 reject（error），而是显示错误提示
优化2：异步得到不是response，而是response.data    
     在请求成功 resolve 时：resolve（response.data）
*/

import axios from 'axios'
import { resolve } from 'path';
import { reject } from 'q';
import { message } from 'antd';

export default function ajax(url, data = {}, type = 'GET') {

    return new Promise((resolve, reject) => {
        let promise
        //1.执行异步 ajax 请求
        if (type === 'GET') {   //发 GET 请求
            promise = axios.get(url, {   //配置对象
                params: data     //指定请求参数
            })
        } else {     //发送 POST 请求
            promise = axios.post(url, data)
        }
        //2.如果成功了，调用 resolve（value）
        promise.then(response => {
            resolve(response.data)
            console.log("返回值："+response.data)
            //3.如果失败了，不调用 reject（reason），而是提示异常信息    
        }).catch(error => {
            message.error('请求出错了：' + error.message)
        })
    })


}