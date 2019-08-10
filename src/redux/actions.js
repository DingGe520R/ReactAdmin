/*
包含 n 个 action creator 的函数模块
同步 action ：对象
异步 action：函数
*/
import { SET_HEAD_TITLE, RECEIVE_USER, SHOW_ERROR_MSG, RESET_USER } from './action-types'

import { reqLogin } from '../api'
import { async } from 'q';
import { message } from 'antd';
import storageUtils from '../utils/storageUtils';

//设置头部标题的同步 action
export const setHeadTitle = (headTitle) => ({ type: SET_HEAD_TITLE, data: headTitle })

//接收用户的同步 action
export const receiveUser = (user) => ({ type: RECEIVE_USER, user })
//显示错误信息的同步 action
export const showErrorMsg = (errorMsg) => ({ type: SHOW_ERROR_MSG, errorMsg })
//退出登陆的同步 action
export const logout = () => {
    //删除 local 中的user
    storageUtils.removeUser()
    //返回 action 对象
    return { type: RESET_USER }
}


//登陆的异步 action
export const login = (username, password) => {
    return async dispatch => {
        //1.执行异步的 ajax 请求
        const result = await reqLogin(username, password)
        //2.1 如果成功，分发成功的同步的 action
        if (result.status === 0) {
            const user = result.data
            //保存在 local 中
            storageUtils.saveUser(user)
            //分发接收用户同步的 action
            dispatch(receiveUser(user))
        } else {
            //2.2 如果失败，分发失败的同步 action
            const msg = result.msg
            dispatch(showErrorMsg(msg))
        }
    }
}