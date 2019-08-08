/*
入口 js
*/

import React from 'react'
import ReactDOM from 'react-dom'
import 'antd/dist/antd.css'
import App from './App'
import memortUtils from './utils/memortUtils'
import storageUtils from './utils/storageUtils'


//读取 local 中保存的 user，保存到内存中
const user=storageUtils.getUser()
memortUtils.user=user

//将 App 组件标签渲染到 index 页面的 div上
ReactDOM.render(<App/>,document.getElementById('root'))