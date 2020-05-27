<template>
	<el-row class="maincontainer">
		<el-col :span="24" class="header">
			<el-col :span="10" class="logo">
				{{sysName}}
			</el-col>
			<el-col :span="4" class="userinfo">
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner"><img src="../assets/setting.png" style="height: 25px;width: 25px;margin-top: 18px;padding-left: 10px;"/> {{sysUserName}}</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item @click.native="basicInfo">个人信息</el-dropdown-item>
						<el-dropdown-item divided @click.native="handleSet">密码修改</el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-col>
		<el-col :span="24" class="main">
			<aside class="menu-expanded">
				<!--导航菜单-->
				<el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen" @close="handleclose"
				 @select="handleselect" unique-opened router v-if="!collapsed">
					<template v-for="(item,index) in menus" v-if="!item.hidden" >
						<el-submenu :index="index+''" v-if="!item.leaf">
							<template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
							<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
						</el-submenu>
						<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
					</template>
				</el-menu>
			</aside>
			<section class="content-container">
				<div class="grid-content bg-purple-light" style="background-color:white;border: 0px;">
					<el-col :span="24" class="breadcrumb-container">
						<strong class="title">{{$router.name}}</strong>
						<el-breadcrumb separator="/" class="breadcrumb-inner">
							<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
								{{ item.name }}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
				<!--个人密码修改界面-->
				<el-dialog title="个人密码修改" :visible.sync="editFormVisible" :close-on-click-modal="false">
					<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
						<el-form-item label="用户名" prop="editForm.userName">
							<el-input v-model="editForm.userName" auto-complete="off" disabled="disabled"></el-input>
						</el-form-item>
						<!-- <el-form-item label="原密码" prop="userPwd">
							<el-input v-model="editForm.userPwd" auto-complete="off"></el-input>
						</el-form-item> -->
						<el-form-item label="新密码" prop="userPwdNew">
							<el-input show-password v-model="editForm.userPwdNew" auto-complete="off" placeholder="请输入6~15位密码" type="password"></el-input>
						</el-form-item>
						<el-form-item label="新密码确认" prop="userPwdNewIs">
							<el-input show-password v-model="editForm.userPwdNewIs" auto-complete="off" placeholder="请再输入一遍密码" type="password"></el-input>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button @click.native="editFormVisible = false">取消</el-button>
						<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
					</div>
				</el-dialog>

				<!--个人信息界面-->
				<el-dialog title="个人信息" :visible.sync="basicInfoFormVisible" :close-on-click-modal="false">
					<el-form :model="basicInfoForm" label-width="80px" ref="basicInfoForm">
						<el-form-item label="用户名" prop="basicInfoForm.userName">
							<el-input v-model="basicInfoForm.userName" readonly></el-input>
						</el-form-item>
						<el-form-item label="角色" prop="basicInfoForm.param1">
							<el-input v-model="basicInfoForm.param1" readonly></el-input>
						</el-form-item>
						<el-form-item label="部门" prop="basicInfoForm.param2">
							<el-input v-model="basicInfoForm.param2" readonly></el-input>
						</el-form-item>
						<el-form-item label="真实姓名" prop="basicInfoForm.userRealName">
							<el-input v-model="basicInfoForm.userRealName" readonly></el-input>
						</el-form-item>
						<el-form-item label="电话号码" prop="basicInfoForm.userPhone">
							<el-input v-model="basicInfoForm.userPhone" readonly></el-input>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button type="primary" @click.native="basicInfoFormVisible = false">关闭窗口</el-button>
					</div>
				</el-dialog>
			</section>
		</el-col>
	</el-row>
</template>

<script>
	import {
		router
	} from '../routes';
	import {
		gethandleSet,
		editSet,
		getBasicInfo,
	} from '../api/api';
	export default {
		data() {
			//密码验证
			const passwordValidate = (rule, value, callback) => { //定义规则
				let reg = /^[0-9A-Za-z]{6,15}$/;
				if (value != '' && reg.test(value)) {
					callback()
				} else {
					callback(new Error('密码少于6位'))
				}
			};
			//密码校验
			const passwordCheckValidate = (rule, value, callback) => { //定义规则
				let reg = /^[0-9A-Za-z]{6,15}$/;
				if (value == '' || !reg.test(value)) {
					callback(new Error('密码少于6位'))
				} else if (value !== this.editForm.userPwdNew) {
					callback(new Error('两次密码不匹配'))
				} else {
					callback()
				}
			};
			return {
				sysName: '黔南银监分局金融CT后台管理系统',
				collapsed: false,
				sysUserName: 'Admin',
				sysUserAvatar: require('../assets/user.png'),
				form: {
					name: 'Admin',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				},
				menus: null,
				editFormVisible: false, //编辑界面是否显示
				basicInfoFormVisible: false,
				editFormRules: {
					userPwdNew: [{
						required: true,
						validator: passwordValidate,
						trigger: 'change'
					}],
					userPwdNewIs: [{
						required: true,
						validator: passwordCheckValidate,
						trigger: 'change'
					}],
				},
				//编辑界面数据
				editForm: {},
				basicInfoForm: {},
				editLoading: false,
				userPwd: '',
				userPwdNew: '',
				userPwdNewIs: '',
			}
		},
		methods: {
			onSubmit() {
				console.log('submit!');
			},
			handleopen() {
				//console.log('handleopen');
			},
			handleclose() {
				//console.log('handleclose');
			},
			handleselect: function(a, b) {},

			//显示个人信息界面
			basicInfo: function() {
				let para = {};
				getBasicInfo(para).then((res) => {
					this.basicInfoForm = res.data.data;
				});
				this.basicInfoFormVisible = true;
			},

			//显示密码编辑界面
			handleSet: function() {
				let para = {};
				gethandleSet(para).then((res) => {
					this.editForm = res.data.data;
				});
				this.editFormVisible = true;
			},
			editSubmit: function() {
				var _this = this;
				this.$confirm('确认提交吗？', '提示', {}).then(() => {
					let para = Object.assign({}, this.editForm);
					editSet(JSON.stringify(para)).then((res) => {
						this.$confirm(res.data, '提示', {
							confirmButtonText: '确定',
						});
						//this.$refs['editForm'].resetFields();
						this.editFormVisible = false;
					}).catch(function(error) {
						this.$confirm(error.data.message, '提示', {
							confirmButtonText: '确定',
						});
						//this.$refs['editForm'].resetFields();
						this.editFormVisible = false;
						return false;
					});
				});
			},
			//退出登录
			logout: function() {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					sessionStorage.removeItem('user');
					sessionStorage.setItem('logout',"logout");
					_this.$router.push('/login');
					// var type = "logout";
					// _this.$router.push({name:'/login',query:{type:'logout'}});
					// _this.$router.push({path:'/login',params:{type:"logout"}));
				})
			},
			//折叠导航栏
			collapse: function() {
				this.collapsed = !this.collapsed;
			},
			showMenu(i, status) {
				this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none';
			}
		},
		mounted() {
			var _this = this;
			var user = sessionStorage.getItem('user');
			if (user) {
				user = JSON.parse(user);
				_this.sysUserName = user.userName || '';
				// this.sysUserAvatar = user.avatar || '';
			}
			var routes = this.$router.options.routes;

			_this.menus = _this.$store.getters.menu;
			console.log("Home:" + JSON.stringify(routes));
		}
	}
</script>

<style scoped lang="scss">
	@import '~scss_vars';

	.maincontainer {
		background-color: #126263;
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		height: 100%;

		.header {
			height: 60px;
			line-height: 60px;
			background: #126263;
			color: #fff;

			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;

				.userinfo-inner {
					cursor: pointer;
					color: #fff;

					img {
						width: 40px;
						height: 40px;
						border-radius: 20px;
						margin: 10px 0px 10px 10px;
						float: right;
					}
				}
			}

			.logo {
				//width:230px;
				height: 60px;
				font-size: 22px;
				padding-left: 20px;
				padding-right: 20px;
				border-color: rgba(238, 241, 146, 0.3);

				img {
					width: 40px;
					float: left;
					margin: 10px 10px 10px 18px;
				}

				.txt {
					color: #fff;
				}
			}

			.logo-width {
				border: 0px;
			}

			.tools {
				padding: 0px 23px;
				width: 14px;
				height: 60px;
				line-height: 60px;
				cursor: pointer;
			}
		}

		.main {
			display: flex;
			background-color: #EEF1F6;
			position: absolute;
			top: 60px;
			bottom: 0px;
			overflow: hidden;

			aside {
				flex: 0 0 230px;
				width: 230px;

				// position: absolute;
				// top: 0px;
				// bottom: 0px;
				.el-menu {
					height: 100%;
				}

				.collapsed {
					width: 60px;

					.item {
						position: relative;
					}

					.submenu {
						position: absolute;
						top: 0px;
						left: 60px;
						z-index: 99999;
						height: auto;
						display: none;
					}

				}
			}

			.menu-collapsed {
				flex: 0 0 60px;
				width: 60px;
				// background-color: #EEF1F6;
				// background-color: red;
			}

			.content-container {
				background-color: white;
				// background: #f1f2f7;
				flex: 1;
				// position: absolute;
				// right: 0px;
				// top: 0px;
				// bottom: 0px;
				// left: 230px;
				// overflow-y: scroll;
				overflow: auto;
				padding: 20px;

				.breadcrumb-container {
					background-color: white;

					//margin-bottom: 15px;
					.title {
						width: 200px;
						float: left;
						padding-left: 2px;
						text-align: left;
						font-size: 14px;
					}

					.breadcrumb-inner {
						float: right;
						padding-right: 2px;
					}
				}

				.content-wrapper {
					background-color: #fff;
					box-sizing: border-box;
				}
			}
		}
	}
</style>
