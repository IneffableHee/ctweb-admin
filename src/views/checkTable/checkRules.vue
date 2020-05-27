<template>
	<div id="app">
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-input v-model="serchRuleName" placeholder="审表规则名称"></el-input>
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
		<el-table :data="rules" highlight-current-row v-loading="listLoading" @selection-change="selsChange" align="left" style="width: 100%;">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column type="index" width="90" label="序号"></el-table-column>
			<el-table-column prop="ruleName" label="规则名" width="400"></el-table-column>
			<el-table-column prop="ruleDiscribe" label="描述" width="400"></el-table-column>
			<el-table-column prop="userName" label="所有者" width="230"></el-table-column>
			<el-table-column prop="createTime" label="创建时间" width="280" :formatter="dateFormat"></el-table-column>
			<el-table-column label="操作" width="250">
				<template scope="scope">
					<!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
					<el-button size="small" @click="handleInfos(scope.$index, scope.row)">查看</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total"
			 style="float:right;">
			</el-pagination>
		</el-col>
		
		<el-dialog title="审表规则明细" :visible.sync="ruleInfosVisible" customClass="customWidth">
			<!--列表-->
			<el-table :data="ruleInfos" highlight-current-row align="left" style="width: 100%;">
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column prop="type" width="100" label="类型"></el-table-column>
				<el-table-column prop="times" label="频率" width="100"></el-table-column>
				<el-table-column prop="banks" label="机构" width="100"></el-table-column>
				<!-- <el-table-column prop="subjectName" label="科目名称" width="230"></el-table-column> -->
				<!-- <el-table-column type="sourceTable" width="90" label="表格"></el-table-column> -->
				<el-table-column prop="source" label="项目来源" width="200"></el-table-column>
				<el-table-column prop="sourceName" label="项目名称" width="200"></el-table-column>
				<el-table-column prop="rule" label="校验规则" width="80"></el-table-column>
				<el-table-column prop="target" label="目标来源" width="230"></el-table-column>
				<el-table-column prop="targetName" width="200" label="目标名称"></el-table-column>
				<el-table-column prop="accuracy" label="精度" width="400"></el-table-column>
				<el-table-column prop="failMessage" label="错误提示" width="400"></el-table-column>
				<el-table-column label="操作" width="250">
					<template scope="scope">
						<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button size="small" @click="handleInfos(scope.$index, scope.row)">查看</el-button>
						<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-dialog>
		
		<el-dialog title="新建审表规则" :visible.sync="newRuleVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="规则名称" prop="ruleName">
					<el-input v-model="addForm.ruleName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="规则描述" prop="ruleDiscribe">
					<el-input v-model="addForm.ruleDiscribe" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="检验精度" prop="accuracy">
					<el-input v-model="addForm.accuracy"></el-input>
				</el-form-item>
				<!-- <el-form-item label="可见范围" prop="department">
					<el-select v-model="addForm.department" placeholder="请选择角色">
						<el-option v-for="item in departmentList" :key="item.roleId" :label="item.roleName" :value="item.roleId"></el-option>
					</el-select>
				</el-form-item> -->
				<!-- <el-form-item label="状态" prop="userStatus">
					<el-radio-group v-model="addForm.userStatus">
						<el-radio :label="item.value" :key="item.value" v-for="item in isCreateUserStatus">{{item.label}}</el-radio>
					</el-radio-group>
				</el-form-item> -->
				<el-form-item label="规则文件">
					<uploader ref="uploader" :key="uploader_key" :options="options" :autoStart="false"
					 @file-added="onFileAdded" @change="onFileChanged" @file-success="onFileSuccess" @file-error="onFileError">
					 <uploader-unsupport></uploader-unsupport>
					 	<el-input v-model="ruleUrlInput" placeholder="" style="width: 350px;"></el-input>
					 	<uploader-btn :attrs="attrs" :single="true" style="height: 20px;margin-left: 5px;">选择审表规则</uploader-btn>
						<!-- <uploader-list ref="uploaderList"></uploader-list> -->
					 </uploader>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="newRuleVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import moment from 'moment'; //导入时间格式组件
	import {
		createCheckTable,
		getCheckTableListPage,
		getCheckRuleInfoList,
		base
	} from '../../api/api';
	export default {
		name: '',
		data() {
			return {
				rules:[],
				ruleInfos:[],
				page: 1,
				pageSize: 20,
				total: 0,
				serchRuleName:"",
				listLoading:false,
				sels: [], //列表选中列
				
				ruleInfosVisible:false,
				
				newRuleVisible:false,
				addForm: {
					"ruleName": '',
					"ruleDiscribe": '',
					"accuracy": '',
					"department": 0
				},
				addFormRules: { //电话验证-对应form-:rules
					ruleName: [{
						required: true,
						message: '请输入审表规则名称',
						trigger: 'blur'
					}],
				},
				
				addLoading: false,
				addStart:"",
				ruleUrlInput:"",
				uploader_key: new Date().getTime(), //这个用来刷新组件--解决不刷新页面连续上传的缓存上传数据（注：每次上传时，强制这个值进行更改---根据自己的实际情况重新赋值）
				options: {
					target: base+'/checkRule/local/rule/upload', //SpringBoot后台接收文件夹数据的接口
					testChunks: false, //是否分片-不分片
					headers: { //设置header
						token: this.$store.getters.token
					},
					simultaneousUploads: 5,
				
				},
				attrs: {
					accept: '.xls,.xlsx'
				},
			}
		},
		methods: {
			//时间格式化
			dateFormat: function(row, column) {
				console.log("@@@@@@@@@"+JSON.stringify(row))
				return row.createTime == undefined ? " " : moment(row.createTime).format("YYYY-MM-DD ")
			},
			
			selsChange: function(sels) {
				this.sels = sels;
			},
			handleEdit: function(index, row) {
				
			},
			handleInfos: function(index, row) {
				console.log(index+","+JSON.stringify(row));
				var _this = this;
				let para = {
					pageNo: 0,
					pageSize: 500,
					rtId: row.id
				};
				getCheckRuleInfoList(para).then((res) => {
					console.log("getCheckRuleInfoList:"+JSON.stringify(res.data.data));
					_this.ruleInfos = res.data.data;
				});
				this.ruleInfosVisible = true;
			},
			handleDel: function(index, row) {
				
			},
			handleCurrentChange(val) {
				// this.page = val;
				// this.getRoles();
			},
			
			handleAdd(){
				this.newRuleVisible = true;
			},
			addSubmit(){
				this.addLoading=true;
				this.$refs.uploader.uploader.resume();
			},
			
			onFileAdded(file) {
				this.ruleUrlInput = file.getRoot().name;
				if(this.addForm.ruleName==""){
					this.addForm.ruleName = this.ruleUrlInput.substring(0,this.ruleUrlInput.lastIndexOf("."));
				}
			},
			onFileError(e) {
				this.addLoading=false;
				this.ruleUrlInput = "";
				this.$refs.uploader.uploader.cancel();
				this.$confirm('创建失败，请检查网络或联系管理员！', '提示').then(_ => {
					done();
				}).catch(_ => {});
			},
			onFileChanged(e) {
				console.log("file upload onFileChanged " + this.fileLength + JSON.stringify(this.$refs.uploader.files));
				if (this.$refs.uploader.files.length > 0) {
					this.$refs.uploader.uploader.cancel();
					this.ruleUrlInput="";
				}
			},
			onFileSuccess(rootFile, file, message, chunk) {
				// alert("onFileSuccess"+JSON.stringify(message))
				// this.$refs.module_uploader.uploader.resume();
				var message = JSON.parse(message);
				if (message.code == "SUCCESS") {
					this.successFile++;
					this.addStart = "start";
					console.log("onFileSuccess")
				} else if (message.code == "UNAUTHENTICATED") {
					this.$refs.uploader.uploader.cancel();
					this.$confirm('未登录或登录超时，请重新登录！！', '提示').then(_ => {
						this.ruleUrlInput = "";
						done();
					}).catch(_ => {});
				}
			},
		},
		
		watch: {
			'addStart': function(newVal) {
				var _this = this;
				if (_this.addStart == "start") {
					console.log("addStart");
					_this.addStart = "";
					let param = {
						ruleName:_this.addForm.ruleName,
						ruleDiscribe:_this.addForm.ruleDiscribe,
						accuracy:_this.addForm.accuracy,
						department:_this.addForm.department,
						fileName:_this.ruleUrlInput,
					};
					console.log(JSON.stringify(param));
					createCheckTable(param).then(res => {
						console.log("createCheckTable suc:"+JSON.stringify(res));
						_this.ruleUrlInput = "";
						_this.addLoading=false;
						if(res.data.code=="FAIL"){
							_this.$confirm(res.data.message, '错误').then(_ => {
								_this.ruleUrlInput = "";
								_this.addLoading=false;
								done();
							}).catch(_ => {});
						}else{
							console.log("createCheckTable suc1");
							_this.$confirm('创建成功！', '成功').then(_ => {
								done();
							}).catch(_ => {});
						}
					}).catch(function(error) {
						_this.ruleUrlInput = "";
						_this.addLoading=false;
						_this.$confirm(error.data.message, '错误').then(_ => {
							done();
						}).catch(_ => {});
						console.log("---------error:"+ JSON.stringify(error));
					});
				}
			}
		},
		mounted() {
			let para = {
				pageNo: this.page,
				pageSize: this.pageSize,
				serchRuleName: this.serchRuleName
			};
			this.listLoading = true;
			getCheckTableListPage(para).then((res) => {
				this.total = res.data.data.total;
				this.rules = res.data.data.list;
				console.log("DDDDDD  "+JSON.stringify(this.rules))
				console.log(moment(this.rules[0].createTime).format("YYYY-MM-DD "))
				this.listLoading = false;
			});
		},
	}
</script>

<style lang="scss">
	.app {
		background: rgb(253, 245, 240);
	}
	
	.upload-demo{
		height: 100px;
		padding-bottom: 100px
	}
	
	 .customWidth{
        width:80%;
    }
</style>
