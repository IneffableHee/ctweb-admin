<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-input v-model="datas" placeholder="管理员姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="clickBtn()">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" align="left"
		 style="width: 100%;">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column type="index" width="70" label="序号"></el-table-column>
			<el-table-column prop="userName" label="登录名" width="120"></el-table-column>
			<el-table-column prop="userRealName" label="管理员姓名" width="130"></el-table-column>
			<el-table-column prop="userPhone" label="电话" width="130"></el-table-column>
			<el-table-column prop="param1" label="角色"></el-table-column>
			<el-table-column prop=" " label="机构" width="350">中国银行业监督管理委员会贵州监管局黔南分局</el-table-column>
			<el-table-column prop="param2" label="部门" width="150"></el-table-column>
			<el-table-column prop="userStatus" label="状态" :formatter="formatStatus"></el-table-column>
			<el-table-column label="操作" width="250">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total"
			 style="float:right;">
			</el-pagination>
		</el-col>
		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="用户名" prop="userName">
					<el-input v-model="editForm.userName" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="管理员真实姓名" prop="userRealName">
					<el-input v-model="editForm.userRealName"></el-input>
				</el-form-item>
				<el-form-item label="电话" prop="userPhone">
					<el-input v-model="editForm.userPhone"></el-input>
				</el-form-item>
				<el-form-item label="部门" align="left" prop="userDepId">
					<el-cascader v-model="editForm.userDepId" :value="editForm.userDepId" :options="options" :props="{checkStrictly:true}"
					 :show-all-levels="false" placeholder="请选择部门"></el-cascader>
				</el-form-item>
				<el-form-item label="角色" prop="userRoleId">
					<el-select v-model="editForm.userRoleId" placeholder="请选择角色">
						<el-option v-for="item in roleNameList" :key="item.roleId" :label="item.roleName" :value="item.roleId"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="密码重置" prop="userPwd">
					<el-radio-group v-model="editForm.userPwd">
						<el-radio :label="item.value" :key="item.value" v-for="item in isResetPassword">{{item.label}}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="状态" prop="userStatus">
					<el-radio-group v-model="editForm.userStatus">
						<el-radio :label="item.value" :key="item.value" v-for="item in isCreateUserStatus">{{item.label}}</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="登录名" prop="userName">
					<el-input v-model="addForm.userName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="管理员姓名" prop="userRealName">
					<el-input v-model="addForm.userRealName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="联系电话" prop="userPhone">
					<el-input v-model.number="addForm.userPhone"></el-input>
				</el-form-item>
				<el-form-item label="部门" align="left" prop="userDepId">
					<el-cascader v-model="addForm.userDepId" value="userDepId" :options="options" :props="{ checkStrictly: true }"
					 :show-all-levels="false"></el-cascader>
				</el-form-item>
				<el-form-item label="角色" prop="userRoleId">
					<el-select v-model="addForm.userRoleId" placeholder="请选择角色">
						<el-option v-for="item in roleNameList" :key="item.roleId" :label="item.roleName" :value="item.roleId"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="状态" prop="userStatus">
					<el-radio-group v-model="addForm.userStatus">
						<el-radio :label="item.value" :key="item.value" v-for="item in isCreateUserStatus">{{item.label}}</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util';
	import axios from 'axios';
	import qs from "qs";
	import moment from 'moment' //导入时间格式组件
	import store from '../../vuex/store';
	import {
		getAdminListPage,
		removeUser,
		batchRemoveUser,
		editUser,
		addAdmin,
		getRoleNameList,
		getDepartmentList
	} from '../../api/api';

	export default {
		data() {
			//电话验证
			const validatePhone = (rule, value, callback) => { //定义规则
				let reg = /^1[345789]\d{9}$/;
				if (value != '' && reg.test(value)) {
					callback()
				} else {
					callback(new Error('请输入正确的手机号'))
				}
			}
			return {
				options: [],
				datas: "",
				roles: [],
				users: [],
				total: 0,
				page: 1,
				pageSize: 20,
				roleNameList: [],
				listLoading: false,
				sels: [], //列表选中列
				editFormVisible: false, //编辑界面是否显示
				editLoading: false,
				editFormRules: {
					userRealName: [{
						required: true,
						message: '请输入真实姓名',
						trigger: 'blur'
					}],
					userPhone: [{ //对应item-prop
						required: true,
						validator: validatePhone, //对应上方规则
						trigger: 'change' //修改验证
					}],
					userDepId: [{
						required: true,
						message: '请选择部门',
					}],
					userRoleId: [{
						required: true,
						message: '请选择角色',
					}]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					"userName": '',
					userRealName: '',
					userPhone: '',
					userDepId: [],
					userStatus: 1,
					userRoleId: 0,
					userStatus: 0,
				},
				isResetPassword: [{
						label: "是",
						value: "123456"
					},
					{
						label: "否",
						value: null
					}
				],
				//用户默认选中的用户状态，启用/禁用
				isCreateUserStatus: [{
						label: "启用",
						value: 1
					},
					{
						label: "禁用",
						value: 0
					}
				],
				addFormVisible: false, //新增界面是否显示
				addLoading: false,
				addFormRules: { //电话验证-对应form-:rules
					userName: [{
						required: true,
						message: '请输入登录账号',
						trigger: 'blur'
					}],
					userRealName: [{
						required: true,
						message: '请输入管理员真实姓名',
						trigger: 'blur'
					}],
					userPhone: [{ //对应item-prop
						required: true,
						validator: validatePhone, //对应上方规则
						trigger: 'change' //修改验证
					}],
					userDepId: [{
						required: true,
						message: '请选择部门',
					}],
					userRoleId: [{
						required: true,
						message: '请选择角色',
					}]
				},
				//新增界面数据
				addForm: {
					"userName": '',
					"userRealName": '',
					"userPhone": '',
					"userStatus": 1,
					"userDepId": [],
					"userRoleId": '',

				}

			}
		},
		methods: {
			//时间格式化
			dateFormat: function(row, column) {
				var date = row[column.property];
				if (date == undefined) {
					return ''
				};
				return moment(date).format("YYYY-MM-DD ")
			},
			//状态显示转换
			formatStatus: function(row, column) {
				return row.userStatus == 1 ? '正常' : row.userStatus == 0 ? '禁用' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//查询
			clickBtn() {
				if (this.datas === '') {
					this.$message({
						message: "请先输入需要查询的管理员姓名！",
						type: 'error',
						duration: 2000
					});
				} else {
					this.getUsers();
				}
			},
			//获取用户列表
			getUsers() {
				let para = {
					pageNo: this.page,
					pageSize: this.pageSize,
					userRealName: this.datas
				};
				this.listLoading = true;
				getAdminListPage(para).then((res) => {
					this.total = res.data.data.total;
					this.users = res.data.data.list;
					this.listLoading = false;
				});
			},
			//删除
			handleDel: function(index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					console.log(row.id + "-------------------------------------------------------");
					this.listLoading = true;
					//NProgress.start();
					let para = {
						id: row.id
					};
					removeUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function(index, row) {
				var _this = this;
				getDepartmentList().then((res) => {
					let batchdata = res.data.data;
					let dataValueBatch = batchdata => batchdata.map(({
						id,
						name,
						departmentId,
						children
					}) => (children ? {
						value: id,
						label: name,
						children: dataValueBatch(children),
					} : {
						value: departmentId,
						label: name,
					}));
					this.options = dataValueBatch(batchdata);
					this.listLoading = false;
				});
				this.editFormVisible = true;
				var user = row;
				user.userUpdatetime = null;
				user.createTime = null;
				user.lastLoginTime = null;
				user.userDepId = [];
				this.editForm = Object.assign({}, user);
			},
			//显示新增界面
			handleAdd: function() {
				this.addFormVisible = true;
				getDepartmentList().then((res) => {
					let batchdata = res.data.data;
					let dataValueBatch = batchdata => batchdata.map(({
						id,
						name,
						departmentId,
						children
					}) => (children ? {
						value: id,
						label: name,
						children: dataValueBatch(children),
					} : {
						value: departmentId,
						label: name,
					}));
					this.options = dataValueBatch(batchdata);
					this.listLoading = false;
				});
			},
			//编辑
			editSubmit: function() {
				var _this = this;
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							let departmentId = this.editForm.userDepId;
							this.editForm.userDepId = departmentId[departmentId.length - 1];
							let para = Object.assign({}, this.editForm);
							editUser(para).then((res) => {
								this.editLoading = false;
								this.$confirm(res.data.data, '提示', {
									confirmButtonText: '确定',
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
							}).catch(function(error) {
								_this.$confirm(error.data.message, '提示', {
									confirmButtonText: '确定',
								});
								_this.editLoading = false;
								_this.editFormVisible = false;
								_this.$refs['editForm'].resetFields();
								_this.getUsers();
								return false;
							});
						});
					}
				});
			},
			//新增
			addSubmit: function() {
				var _this = this;
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let departmentId = this.addForm.userDepId;
							this.addForm.userDepId = departmentId[departmentId.length - 1];
							let para = Object.assign({}, this.addForm);
							addAdmin(para).then((res) => {
								this.addLoading = false;
								_this.$confirm(res.data.data, '提示', {
									confirmButtonText: '确定',
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
							}).catch(function(error) {
								_this.$confirm(error.data.message, '提示', {
									confirmButtonText: '确定',
								});
								_this.addLoading = false;
								_this.addFormVisible = false;
								_this.$refs['addForm'].resetFields();
								_this.getUsers();
								return false;
							});
						});
					}
				});
			},
			selsChange: function(sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function() {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = {
						ids: ids
					};
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			},
			getRoleNameList() {
				var _this = this;
				let para = {};
				getRoleNameList(para).then((res) => {
					this.roleNameList = res.data.data;
				}).catch(function(error) {
					this.$confirm(error.data.message, '提示', {
						confirmButtonText: '确定',
					});
				})
			}
		},
		mounted() {
			this.getUsers();
			this.getRoleNameList();
		}
	}
</script>

<style scoped>
	.dialog-footer {
		text-align: center
	}
</style>
