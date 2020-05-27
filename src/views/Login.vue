<template>
	<el-form :model="ruleForm" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
		<h3 class="title">系统管理</h3>
		<el-form-item prop="account">
			<el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="管理员账号"></el-input>
		</el-form-item>
		<el-form-item prop="checkPass">
			<el-input type="password" v-model="ruleForm.checkPass" auto-complete="off" placeholder="密码"></el-input>
		</el-form-item>
		<el-checkbox v-model="checked" checked class="remember" style="color: #fff">记住密码</el-checkbox>
		<el-form-item style="width:100%;">
			<el-button type="primary" class="subbtn" style="width:100%;" @click.native.prevent="Submit" :loading="logining">登录</el-button>
			<!-- <el-button @click.native.prevent="handleReset2">重置</el-button> -->
		</el-form-item>
	</el-form>
</template>

<script>
	import {
		requestLogin,
		getMenus
	} from '../api/api';

	// import resetRouter from '../routes';

	//import NProgress from 'nprogress'
	export default {
		data() {
			return {
				logining: false,
				ruleForm: {
					account: '',
					checkPass: '',
				},
				rules2: {
					account: [{
							required: true,
							message: '请输入账号',
							trigger: 'blur'
						},
						//{ validator: validaePass }
					],
					checkPass: [{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						},
						//{ validator: validaePass2 }
					]
				},
				checked: true
			};
		},
		methods: {
			Submit(ev) {
				var _this = this;
				this.$refs.ruleForm2.validate((valid) => {
					if (valid) {
						//_this.$router.replace('/table');
						this.logining = true;
						//NProgress.start();
						let loginParams = {
							username: this.ruleForm.account,
							password: this.ruleForm.checkPass
						};
						console.log(JSON.stringify(loginParams));
						sessionStorage.removeItem("token");
						this.$store.dispatch("deleteToken");
						requestLogin(loginParams).then(response => {
								// console.log(JSON.stringify(response));
								this.logining = false;
								//NProgress.done();
								let {
									message,
									code,
									data
								} = response;
								if (code !== "SUCCESS") {
									this.$message({
										message: message,
										type: 'error'
									});
								} else {
									getMenus().then(res => {
										let menus = [];
										var dataList = res.data.data;
										console.log("getMenus:" + JSON.stringify(dataList));
										let tip = 0;
										let rpath = "";
										for (let i = 0; i < dataList.length; i++) {
											let data = dataList[i];
											console.log("for getMenus:" + JSON.stringify(data));
											let menu = {
												path: '/',
												component: (resolve) => require(['./Home.vue'], resolve),
												name: '',
												iconCls: data.permissionIcon,
												children: [],
												leaf: true,
											};
											console.log("parentId1:" + data.parentId + "," + data.permissionUrl);
											if (data.parentId == -1) {
												console.log("parentId2:" + data.parentId + "," + data.permissionUrl);
												var hasChild = false;
												for (let j = 0; j < dataList.length; j++) {
													if (dataList[j].parentId == data.permissionId) {
														let child = {
															path: dataList[j].permissionUrl,
															component: (resolve) => require(['.' + dataList[j].permissionUrl + '.vue'], resolve),
															name: dataList[j].permissionName,
														}
														menu.children.push(child);
														hasChild = true;
														menu.name = data.permissionName;
														menu.leaf = false;
													}
												}
												if (!hasChild) {
													let child = {
														path: data.permissionUrl,
														component: (resolve) => require(['.' + data.permissionUrl + data.permissionUrl + '.vue'], resolve),
														name: data.permissionName,
													}
													menu.children.push(child);
												}
											} else {
												continue;
											}
											console.log("for menu:" + JSON.stringify(menu));

											var add = true;
											let routers = this.$router.options.routes;
											console.log("rout:" + JSON.stringify(routers));
											if (routers.length > 0) {
												for (let m = 0; m < routers.length; m++) {
													if (menu.children == null || menu.children.length == 0) {
														add = false;
													} else if (routers[m].children != null && routers[m].children.length > 0) {
														console.log("DDDD " + JSON.stringify(menu) + " , " + JSON.stringify(routers[m]))
														console.log(routers[m].children[0].path);
														if (tip == 0) {
															rpath = routers[m].children[0].path;
															tip++;
														}
														if (menu.name == routers[m].name && menu.children[0].name == routers[m].children[0].name) {
															console.log("222 equal " + i + menu.name + "," + routers[m].name);
															add = false;
															break;
														}
													}
												}
											}

											if (add) {
												this.$router.options.routes.push(menu);
												menus.push(menu);
											}
										}
										if (menus.length > 0) {
											// console.log("menus:"+menus);
											this.$router.addRoutes(menus);
											// this.$router不是响应式的，所以手动将路由元注入路由对象
										}

										this.$store.dispatch("deleteMenu");
										console.log("~~~~Login:" + JSON.stringify(this.$router.options.routes));
										this.$store.dispatch("setMenu", this.$router.options.routes);
										this.$router.push({
											path: rpath
										});
									});
									sessionStorage.setItem('user', JSON.stringify(data.user));
									sessionStorage.setItem('token', data.user.token);
									this.$store.dispatch("setToken", data.user.token);
								}
							})
							.catch(function(error) {
								console.log("---------login:"+ error);
								// console.log("---------login:" + JSON.stringify(error) + "--" + error.data.message);
								if(error == "无法连接服务器！"){
									_this.$message({
										message: "无法连接服务器,请联系管理员！",
										type: 'error'
									});
								}else{
									_this.$message({
										message: error.data.message,
										type: 'error'
									});
								}
								_this.logining = false;
								return false;
							})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
		},
		mounted() {
			if (this.$router.options.routes.length > 5) {
				location.reload();
			}
			// resetRouter();
			console.log("~~~~Login mounted:" + JSON.stringify(this.$router.options.routes));
		}

	}
</script>

<style lang="scss" scoped>
	.login-container {
		/*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
		-webkit-border-radius: 5px;
		border-radius: 5px;
		-moz-border-radius: 5px;
		background-clip: padding-box;
		float: right;
		margin-right: 20%;
		margin-top: 300px;
		width: 260px;
		height: 350px;
		padding: 35px 35px 15px 35px;
		background: #008489;
		border: 1px solid #126263;
		box-shadow: 0 0 25px #126263;

		.title {
			margin: 10px auto 40px auto;
			text-align: center;
			color: #fff;
		}

		.remember {
			margin: 0px 0px 35px 0px;
		}

		

		.remember.is-checked{
			color: #666;
		}

		.el-checkbox.is-bordered.is-checked {
			border-color: #666;
		}

		.el-checkbox__input.is-focus .el-checkbox__inner {
			border-color: #666;
		}
	}

	.title {
		font-family: '微软雅黑';
	}

	// .subbtn {
	// 	color: #fff;
	// 	background-color: #082729;
	// 	border-color: #126263;
	// }

	.subbtn:hover {
		background-color: #082b2d;
	}
</style>
