import React, { PureComponent } from 'react'
import { Form, Select, Input } from 'antd'
import PropTypes from 'prop-types'


const Item = Form.Item
const Option = Select.Option

//添加用户/修改用户的 form 组件
class UserForm extends PureComponent {

    static propTypes = {
        setForm: PropTypes.func.isRequired,     //用来传递 form 对象的函数
        roles: PropTypes.array.isRequired,
        user: PropTypes.object
    }

    componentWillMount() {
        this.props.setForm(this.props.form)
    }

    render() {
        const { roles } = this.props
        const user = this.props.user || {}

        const { getFieldDecorator } = this.props.form

        //指定 Item 布局的配置对象
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18 }
        }
        return (
            <Form  {...formItemLayout}>
                <Item label='用户名'>
                    {
                        getFieldDecorator('username', {
                            initialValue: user.username,
                        })(
                            <Input placeholder='请输入用户名' />
                        )
                    }
                </Item>
                {
                    user._id ? null : (
                        <Item label='密码'>
                            {
                                getFieldDecorator('password', {
                                    initialValue: user.password,
                                })(
                                    <Input type='password' placeholder='请输入密码' />
                                )
                            }
                        </Item>
                    )
                }

                <Item label='手机号'>
                    {
                        getFieldDecorator('phone', {
                            initialValue: user.phone,
                        })(
                            <Input placeholder='请输入手机号' />
                        )
                    }
                </Item>
                <Item label='邮箱'>
                    {
                        getFieldDecorator('email', {
                            initialValue: user.email,
                        })(
                            <Input placeholder='请输入邮箱' />
                        )
                    }
                </Item>
                <Item label='角色'>
                    {
                        getFieldDecorator('role_id', {
                            initialValue: user.role_id,
                        })(
                            <Select >
                                {
                                    roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                                }
                            </Select>
                        )
                    }
                </Item>
            </Form>
        )
    }
}
export default Form.create()(UserForm)