import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd';

import './index.less'
import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
import  memortUtils from '../../utils/memortUtils'

const { SubMenu } = Menu;
/*
 左侧导航的组件
*/

class LeftNav extends Component {

    //判断当前登录用户对 item 是否有权限
    hasAuth=(item)=>{
        const {key,isPublic}=item

        const menus = memortUtils.user.role.menus
        
        const username=memortUtils.user.username
        /*
        1.如果当前用户是 admin
        2.如果当前 item 是公开的
        3.当前用户有此 item 的权限：key 里面的 menus
        */
     if(item==='admin'||isPublic||menus.indexOf(key)!==-1){
         return true
     }else if(item.children){  //4.如果当前用户有此 item 的某个子 item 的权限
        return  !!item.children.find(child => menus.indexOf(child.key) !== -1)  // !! 代表强制转换为布尔类型
     }
    return false
    }

    /* 
    根 据 指 定 菜 单 数 据 列 表 产 生 <Menu> 的 子 节 点 数 组 
    使 用 map() + 递 归
     */
    getMenuNodes_map = (menuList) => {
        return menuList.map(item => {
            if (!item.children) {
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            } else {
                return (
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </span>
                        }
                    >
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }
        })
    }
    /*
    根 据 指 定 菜 单 数 据 列 表 产 生 <Menu> 的 子 节 点 数 组
    使 用 reduce() + 递 归
     */
    getMenuNodes = (menuList) => {

        //得到当前请求的路由路径
        const path = this.props.location.pathname

        return menuList.reduce((pre, item) => {
            //如果当前用户有 item 对应的权限，才需要显示对应的菜单项
            if (this.hasAuth(item)) {
                //向 pre 添加 <Menu.Item>
                if (!item.children) {
                    pre.push((
                        <Menu.Item key={item.key}>
                            <Link to={item.key}>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    ))
                } else {
                    //查找一个与当前请求路径匹配的子 item
                    const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                    //如果存在，说明当前的 item 的子列表需要打开
                    if (cItem) {
                        this.openKey = item.key
                    }
                    //向 pre 添加<SubMenu>
                    pre.push((
                        <SubMenu
                            key={item.key}
                            title={
                                <span>
                                    <Icon type={item.icon} />
                                    <span>{item.title}</span>
                                </span>
                            }
                        >
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    ))
                }
            }
            return pre
        }, [])
    }

    /*
     在第一次render()之前执行一次
     为第一个 render() 准备数据（必须同步的）
    */
    componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList)
    }

    render() {
        //debugger
        //得到当前请求的路由路径
        let path = this.props.location.pathname
        console.log('render()', path)
        if (path.indexOf('/product') === 0) { //当前请求的是商品或其子路由界面
            path = '/product'
        }

        //得到需要打开菜单项的 key
        const openKey = this.openKey

        return (
            <div>
                <div className='left-nav'>
                    <Link to='/' className="left-nav-header">
                        <img src={logo} alt="logo" />
                        <h1>硅谷后台</h1>
                    </Link>
                </div>

                <Menu
                    selectedKeys={[path]}
                    mode="inline"
                    theme="dark"
                    defaultOpenKeys={[openKey]}
                >
                    {
                        this.menuNodes
                    }
                </Menu>
            </div >
        )
    }
}
/*
withRouter 高阶组件：
包装非路由组件，返回一个新的组件
新的组件向非路由组件传递3个属性：history/location/match
*/

export default withRouter(LeftNav)

