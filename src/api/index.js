/*
要求：能根据接口文档定义接口请求
包含应用中所有接口请求函数的模板
每个接口的返回值都是 promise
*/
import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd';

const BASE = ''
//登录
export const reqLogin = (username, password) => ajax(BASE + '/login', { username, password }, 'POST')
//添加用户
//export const reqAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST')

//获取一级/二级分类的列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', { parentId }, 'GET')
//添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', { categoryName, parentId }, 'POST')
//更新分类
export const reqUpdateCategory = ({ categoryId, categoryName }) => ajax(BASE + '/manage/category/update', { categoryId, categoryName }, 'POST')
//获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', { pageNum, pageSize })
//搜索商品分页列表(根据商品名称/商品描述)
export const reqSearchProducts = ({ pageNum, pageSize, searchName,searchType}) => ajax(BASE + '/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchName,
})

//删除图片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', { name }, 'POST')
//添加商品并且更新商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')
//更新商品
//export const reqUpdateProduct = (product) => ajax(BASE + '/manage/product/update', product, 'POST')
//根据分类 id  获取分类名称
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', { categoryId })
//更新商品的状态（上架/下架）
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', { productId, status }, 'POST')
//获取所有角色的列表
export const reqRoles = () => ajax(BASE + '/manage/role/list')
//添加角色
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', { roleName }, 'POST')
//更新角色
export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update', role, 'POST')
//获取所有用户列表
export const reqUsers = () => ajax(BASE + '/manage/user/list')
//删除指定用户
export const reqDeleteUsers = (userId) => ajax(BASE + '/manage/user/delete',{userId},'POST')
//添加/更新用户
export const reqAddorUpdateUser = (user) => ajax(BASE + '/manage/user/'+(user._id?'update':'add'), user, 'POST')






//jsonp 请求的接口请求函数
export const reqWeather = (city) => {
    return new Promise((resolve, reject) => {
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        //发送 jsonp 请求
        jsonp(url, {}, (err, data) => {
            console.log('jsonp()', err, data)
            //如果成功
            if (!err && data.status === 'success') {
                //取出需要的数据
                const { dayPictureUrl, weather } = data.results[0].weather_data[0]
                resolve({ dayPictureUrl, weather })
            } else {
                //如果失败
                message.err('获取天气信息失败')
            }
        })
    })


}
reqWeather('北京')