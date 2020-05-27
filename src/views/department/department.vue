<template>
	<div class="contains">
		<h1>监督管理委员会贵州监管局部门管理</h1>
		<tree-table ref="recTree" :list.sync="treeDataSource" @actionFunc="actionFunc" @deleteFunc="deleteFunc"
		 @handlerExpand="handlerExpand" @addFunc="addFunc"></tree-table>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" ref="editForm">
				<el-form-item label="部门" prop="departmentName">
					<el-input v-model="editForm.departmentName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="部门编号" prop="departmentCode">
					<el-input v-model="editForm.departmentCode" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="部门简称" prop="departmentName">
					<el-input v-model.number="editForm.departmentName"></el-input>
				</el-form-item>
				<el-form-item label="部门描述" prop="departmentDescription">
					<el-input v-model.number="editForm.departmentDescription"></el-input>
				</el-form-item>
				<el-form-item label="部门电话" prop="departmentMobile">
					<el-input v-model.number="editForm.departmentMobile"></el-input>
				</el-form-item>
				<el-form-item label="状态" prop="departmentStatus">
					<el-radio-group v-model="editForm.departmentStatus">
						<el-radio :label="item.value" :key="item.value" v-for="(item,index) in isCreateRoleStatus">{{item.label}}</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--新增界面-->
		<el-dialog  :title="deptFather"  :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px"  ref="addForm">
				<el-form-item label="部门" prop="departmentName">
					<el-input v-model="addForm.departmentName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="部门编号" prop="departmentCode">
					<el-input v-model="addForm.departmentCode" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="部门简称" prop="departmentDescription">
					<el-input v-model.number="addForm.departmentDescription"></el-input>
				</el-form-item>
				<el-form-item label="部门电话" prop="departmentMobile">
					<el-input v-model.number="addForm.departmentMobile"></el-input>
				</el-form-item>
				<el-form-item label="状态" prop="departmentStatus">
					<el-radio-group v-model="addForm.departmentStatus">
						<el-radio :label="item.value" :key="item.value" v-for="(item,index) in isCreateRoleStatus">{{item.label}}</el-radio>
					</el-radio-group>
				</el-form-item>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</div>

</template>
<script>
	import treeTable from './tree-table.vue'
	import {
		getDepartmentList,
		removeDepartment,
		editDepartment,
		addDepartment
	} from '../../api/api';
	export default {
		data() {
			return {
				treeDataSource: [],
				editFormVisible: false, //编辑界面是否显示
				editLoading: false,
				addFormVisible:false,
				addLoading:false,
				deptFather:null,
				//编辑界面数据
				editForm: {
					"departmentNameId":null,
					"departmentName": '',
					"departmentCode": null,
					"departmentShortName": '',
					"departmentDescription": '',
					"departmentMobile": null,
					"departmentStatus": null,
				},
				//新增界面数据
								addForm: {
								},
				//用户默认选中的用户状态，启用/禁用
				isCreateRoleStatus: [{
						label: "启用",
						value: 1
					},
					{
						label: "禁用",
						value: 0
					}
				],
			}
		},
		components: {
			treeTable
		},
		methods: {
			orderByFunc(val) {
				alert('排序')
				alert(val)
			},
			addFunc(m) {
				// alert('排序123' + m.id)
				this.addFormVisible = true;
				this.deptFather="新增"+m.departmentShortName+"子部门：";
				this.addForm.parentId=m.departmentId
			},
			//新增
			addSubmit: function() {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
							console.log("para:" + JSON.stringify(para));
							addDepartment(para).then((res) => {
								this.addLoading = false;
								// NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getDeptList();
							});
						});
					}
				});
			},
			actionFunc(m) {
				this.editFormVisible = true;
				this.editForm.departmentName = m.departmentName;
				this.editForm.departmentShortName = m.departmentShortName;
				this.editForm.departmentCode = m.departmentCode;
				this.editForm.departmentDescription = m.departmentDescription;
				this.editForm.departmentMobile = m.departmentMobile;
				this.editForm.departmentStatus = m.departmentStatus;
				this.editForm.departmentId=m.departmentId
			},
			//编辑
			editSubmit: function() {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							let para = Object.assign({}, this.editForm);
							editDepartment(para).then((res) => {
								this.editLoading = false;
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getDeptList();
							});
						});
					}
				});
			},
			deleteFunc(m) {
				alert('删除' + m.id)
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = {
						id: m.id
					};
					removeDepartment(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getDeptList();
					});
				}).catch(() => {
				
				});
			},
			handlerExpand(m) {
				console.log('展开/收缩')
				m.isExpand = !m.isExpand
			},
			getDeptList() {
				// this.listLoading = true;
				getDepartmentList().then((res) => {
					this.treeDataSource = res.data.data;
				});
			}

		},
		mounted() {
			this.getDeptList();
		}
	}
</script>

<style>
	.contains {
		width: 100%;
		margin: 10px auto;
	}
</style>
