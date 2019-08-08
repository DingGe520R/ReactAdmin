import React, { Component } from 'react'

import { Card, Table, Button, Icon, message, Modal } from 'antd'
import LinkButton from '../../components/link-button'
import { reqCategorys, reqUpdateCategory, reqAddCategory } from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'
import { async } from 'q';
/*
首页路由
*/
export default class Category extends Component {


    state = {
        categorys: [],  //一级分类列表
        subCategorys: [],//二级分类列表
        loading: false, //是否正在获取数据中
        parentId: '0', //当前需要显示分类列表的父分类 ID
        parentName: '', //当前需要显示的分类列表的父分类名称
        showStatus: 0,//标识添加/更新的确认框是否显示，0 都不显示，1：显示添加，2：显示更新
    }

    //初始化 table 所有的列数组
    initColumns = () => {
        this.columns = [
            {
                title: '分类的名称',
                dataIndex: 'name',    //显示数据对应的属性名
            },
            {
                title: '操作',
                width: 300,
                render: (category) => (  //返回需要显示的界面标签
                    <span>
                        <LinkButton onClick={() => { this.showUpdate(category) }}>修改分类</LinkButton>
                        {this.state.parentId === '0' ? <LinkButton onClick={() => { this.showSubCategorys(category) }}>查看子分类</LinkButton> : null}
                    </span>
                )
            }
        ];
    }

    //异步获取一级/二级分类列表显示
    getCategorys = async (parentId) => {

        //在发请求前，显示 loading
        this.setState({ loading: true })
        parentId = parentId || this.state.parentId
        console.log(parentId)
        const result = await reqCategorys(parentId)
        //在请求结束后，隐藏 loading
        this.setState({ loading: false })

        if (result.status === 0) {
            //取出分类数组数据（一级，二级都有可能）
            const categorys = result.data
            if (parentId === '0') {
                //更新一级分类状态
                this.setState({
                    categorys
                })
            } else {
                //更新二级分类状态
                this.setState({
                    subCategorys: categorys
                })
            }
        }
        else {
            message.error('获取分类列表失败 ')
        }
    }

    //显示指定一级分类对象的二级列表
    showSubCategorys = (category) => {
        console.log(category)
        this.setState({ //setState() 不能立即获取最新状态：它是异步更新状态的
            parentId: category._id,
            parentName: category.name
        }, () => {  //在状态更新且重新render（）后执行
            //获取二级分类列表
            this.getCategorys()

        })
    }

    //显示一级分类列表
    showCategorys = () => {
        //更新为显示一级列表的状态
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: []
        })
    }

    //响应点击取消：隐藏确定框
    handleCancel = () => {
        //清除输入数据
        this.form.resetFields()

        this.setState({
            showStatus: 0
        })
    }
    //显示添加的确认框
    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }

    //添加分类
    addCategory =  () => {
        //进行表单验证，只有通过了才处理
        this.form.validateFields(async (err, values) => {
            if (!err) {
                //隐藏确定框
                this.setState({
                    showStatus: 0
                })
                //收集数据,并提交添加分类请求
                const { categoryName, parentId } = values
                //清除输入数据
                this.form.resetFields()

                const result = await reqAddCategory(categoryName, parentId)
                if (result.status === 0) {
                    //添加的分类就是当前列表显示下的分类
                    if (parentId === this.state.parentId) {
                        //重新获取分类列表显示
                        this.getCategorys()
                    }
                    //在二级分类列表下添加一级分类，重新获取一级分类列表，但不需要显示一级列表
                    else if (parentId === '0') {
                        this.getCategorys('0')
                    }
                }
            }
        })
    }
    

    //显示修改的确认框
    showUpdate = (category) => {
        console.log("category" + category)
        //保存分类对象
        this.category = category
        this.setState({
            showStatus: 2
        })
    }

    //更新分类
    updateCategory =  () => {
        //进行表单验证，只有通过了才处理
        this.form.validateFields(async (err,values)=>{
            if(!err){
                //隐藏确定框
                this.setState({
                    showStatus: 0
                })
                //准备数据
                const categoryId = this.category._id
                const { categoryName } = values
                //清除输入数据
                this.form.resetFields()
                //发请求更新分类
                const result = await reqUpdateCategory({ categoryId, categoryName })
                if (result.status === 0) {
                    //重新显示列表
                    this.getCategorys()
                }

            }
        })      
    }

    //为第一次 render() 准备数据
    componentWillMount() {
        this.initColumns()
    }
    //执行异步任务 ：发异步 ajax 请求
    componentDidMount() {
        this.getCategorys()
    }

    render() {

        //读取状态分类
        const { categorys, subCategorys, parentId, parentName, loading, showStatus } = this.state
        //读取指定分类
        const category = this.category || {} //如果还没有指定一个空对象

        //card 的左侧
        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <Icon type='arrow-right' style={{ marginRight: 5 }}></Icon>
                <span>{parentName}</span>
            </span>
        )
        //card 的右侧
        const extra = (
            <Button type='primary' onClick={this.showAdd}>
                <Icon type='plus' />
                添加
            </Button>
        )

        return (
            <Card title={title} extra={extra} >
                <Table
                    bordered
                    rowKey='_id'
                    loading={loading}
                    dataSource={parentId === '0' ? categorys : subCategorys}
                    columns={this.columns}
                    pagination={{ defaultPageSize: 6, showQuickJumper: true }}
                />;
                <Modal
                    title="添加分类"
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm categorys={categorys} parentId={parentId} setForm={(form) => { this.form = form }} />
                </Modal>

                <Modal
                    title="更新分类"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm categoryName={category.name} setForm={(form) => { this.form = form }} />
                </Modal>
            </Card>
        )
    }
}
