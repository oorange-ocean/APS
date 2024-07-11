<template>
    <div class="bgc">
        <img src="../assets/bg-light-275f0d57.jpg" width="100%" height="100%" alt="" />
    </div>
    <div class="one">
        <div class="left">
            <img src="../assets/logo+en.svg" alt="" />
        </div>
        <div class="right">
            <img src="../assets/app_title.svg" width="155px" height="366.71px" />
            <el-form :model="form" @keydown.enter="submitLogin">
                <el-form-item>
                    <el-input v-model="form.name" id="name" placeholder="用户名" />
                </el-form-item>
                <el-form-item class="password">
                    <el-input v-model="form.password" type="password" placeholder="密码" show-password id="password" />
                </el-form-item>
                <a href="javascript:;" @click="open"><span>忘记密码?</span></a>
            </el-form>
            <el-button type="primary" @click.prevent="submitLogin" style="font-size: 12px">登录</el-button>
        </div>
    </div>
</template>

<script setup>
import { h, reactive, ref, watch, onMounted } from 'vue'
import { login } from '../api/login'
import Cookies from 'js-cookie'
import { setToken } from '@/utils/auth'
import useUserStore from '@/store/modules/user'
import { useRoute, useRouter } from 'vue-router'
import useUserMenu from '../store/modules/menu'

const userStore = useUserStore()
const userMenu = useUserMenu()
const route = useRoute() // 用于获取和访问当前路由的信息
const router = useRouter() // 用于执行路由导航的操作

const form = reactive({
    name: '',
    password: ''
})

const open = () => {
    ElMessageBox({
        title: '提示',
        message: h('p', null, [h('span', null, '请联系飞书管理员')]),
        confirmButtonText: '确定'
    })
}

const redirect = ref(undefined)

watch(
    route,
    (newRoute) => {
        redirect.value = newRoute.query && newRoute.query.redirect
    },
    { immediate: true }
)

onMounted(() => {
    // 判断是否为飞书浏览器以及Cookie是否有效
    const browserInfo = detectBrowser()
    const cookies = Cookies.get()
    const code = route.query.code

    if (browserInfo.isFeishu && (!areCookiesValid(cookies)) && !code) {
        // 如果是飞书浏览器，触发自动跳转到飞书登录
        const baseUrl = window.location.origin
        window.location.href = `https://open.feishu.cn/open-apis/authen/v1/authorize?app_id=cli_a5e56060a07ad00c&redirect_uri=${baseUrl}/#/callback/feishuLogin`
    }
})

function detectBrowser() {
    const userAgent = navigator.userAgent
    return {
        isFeishu: userAgent.includes('Lark') // 检测是否为飞书浏览器
    }
}

function areCookiesValid(cookies) {
    // 判断Cookies是否有效的逻辑
    return !!cookies['your-cookie-name'] // 替换为实际的Cookie名
}

function submitLogin() {
    // 调用action的登录方法
    userStore
        .login(form.name, form.password)
        .then((res) => {
            const query = route.query
            const otherQueryParams = Object.keys(query).reduce((acc, cur) => {
                if (cur !== 'redirect') {
                    acc[cur] = query[cur]
                }
                return acc
            }, {})
            sessionStorage.removeItem('tabs')
            userMenu.tabsList = []
            router.push({ path: redirect.value || '/', query: otherQueryParams })
        })
        .catch((error) => {
            ElMessage.error('用户名或密码错误')
        })
}
</script>

<style>
.el-message-box__btns>.el-button--primary {
    background-color: #409eff;
}
</style>

<style scoped>
body {
    height: 100vh;
}

.common-layout {
    height: 100%;
}

.one {
    display: flex;
    height: 100vh;
    margin: auto;
    flex-direction: row;
}

.bgc {
    width: 100%;
    height: 100%;
    z-index: -1;
    position: absolute;
}

.bgc>img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.right>img {
    width: 366.71px;
    height: 155px;
}

.right {
    position: absolute;
    right: 0;
    width: 40%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #fff;
}

.left {
    display: flex;
    width: 60%;
    align-items: center;
}

.left>img {
    width: 150px;
    height: 178.64px;
    margin: auto;
}

.el-form {
    margin: 0;
    padding: 0 0 20px 0;
}

h2 {
    color: #0053b5;
}

.password {
    margin-bottom: 0;
}

.el-input {
    width: 366px;
    height: 52px;
    box-sizing: border-box;
    --el-input-bg-color: #f1f4f6;
    border: none;
}

.el-button {
    text-align: center;
    margin: 0px auto;
    height: 50px;
    width: 366px;
    font-weight: 700;
}

a>span {
    width: 330px;
    height: 20px;
    font-size: 12px;
}

a {
    float: right;
    text-decoration: none;
}

.el-form-item__label {
    width: 80px !important;
}

a>span {
    color: #1d89e9;
}
</style>
