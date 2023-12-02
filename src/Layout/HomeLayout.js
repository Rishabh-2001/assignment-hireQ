import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
import { Outlet, useNavigate } from "react-router-dom";
import logo from '../assets/christmas_2012_new_5895.jpg'
const { Header, Sider, Content } = Layout;


const HomeLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();

  const handleMenuClick = (to) => {
    // console.log("NAviagating to ", to);
    navigate(to);
  };

const navMenu=[
    {
        key: '',
        icon: <UserOutlined />,
        label: 'Users',
        to: ''
      },
]

  
  return (
    <Layout className=''>
      <Sider trigger={null} collapsible collapsed={collapsed} className='h-screen'>
        <div className="demo-logo-vertical " />
        {/* SAMPLE LOGO  */}
        <div className='text-center text-white'>
            <img src={logo} alt='logo'  />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['']}   
        >
            {navMenu?.map((nav,idx)=>(
               
                 <Menu.Item key={nav?.key} icon={nav?.icon}  onClick={() => handleMenuClick(nav?.key)} >
                  {nav?.label}
               </Menu.Item>
            
            ))}
          
            </Menu>
          
       

      </Sider>
      <Layout className=''>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            
          }}
         
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default HomeLayout;