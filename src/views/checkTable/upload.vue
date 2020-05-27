<template>
	<div class="divcss1 "  v-loading="loadingShow">
		<div class="excel-up" v-show="uploadShow">
			<div class="up-area">
				<el-upload ref="fileUpload" class="upload-demo" drag :headers="headers" :file-list="fileList" :multiple="multiple"
				 :action="uploadUrl" :before-upload="beforeupload" :show-file-list="showFileList" :accept="acceptFileType"
				 :on-success="uploadSuccess" :on-error="uploadError" :auto-upload="autoUpload" :before-remove="handleRemove"
				 :v-loading="loading">
					<!-- <el-button size="small" type="primary">点击上传</el-button> -->
					<i class="el-icon-upload"></i>
					<div class="el-upload-text">将文件拖到此处，或<em>点击上传</em></div>
					<el-dialog title="上传失败文件列表" :visible.sync="dialogTableVisible">
						<el-table :data="gridData">
							<el-table-column property="bankName" label="状态" width="150"></el-table-column>
							<el-table-column property="fileName" label="文件名" width="300"></el-table-column>
							<el-table-column property="param1" label="上传失败原因" width="195"></el-table-column>
						</el-table>
					</el-dialog>
				</el-upload>
			</div>
			<div slot="tip" class="up-tip" align="left">
				<p style="font-size: 16px;font-weight: bold;margin-top: 0px;padding-bottom: 8px;">上传须知：</p>
				<p>1.系统只能上传 <span style="font-weight: bold;">.zip、.xls、.xlsx </span>尾的文件。</p>
				<p class="info">2.表的命名规则为：<span style="font-weight: bold;">银行名称_表唯一标识 表名称_日期_***.xls/xlsx</span>,如不符合会提示上传失败。</p>
				<p class="info">3.系统不需要用户选择上传机构和期次，上传完成系统会自动校验和匹配机构名和期次。</p>
				<p class="info">4.只能上传当期文件（如本月为6月，则只能上传6月数据），已生成数据的文件不能进行上传和修改数据。</p>
			</div>
		</div>
<!-- 		<div class="divcss2 " v-show="uploadShow">
			<span style="font-weight: bold;"><b>已上传规则：</b></span><br />
			<el-button :key="tag.dicName" v-for="tag in checkRulesData" closable :disable-transitions="false" type="text">
				{{tag.dicName}}&nbsp;&nbsp;
			</el-button>
		</div> -->
		<!-- 列表显示 -->
		<section v-show="tableShow">
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true">
					<el-form-item>
						<el-select v-model=" bank" value-key='id' placeholder="请选择适用机构">
							<el-option v-for="item in bankList" :key="item.id" :label="item.shortName" :value="item"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-input placeholder="请命名该校验规则名称" v-model="input" clearable>
						</el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary">该校验规则应用于所选机构</el-button>
					</el-form-item>
					<el-form-item>
						<el-tooltip content="核对正确后提交到后台服务器 谨慎操作!" placement="bottom">
							<el-button type="primary" @click="handeUpload" :loading="addLoading">提交</el-button>
						</el-tooltip>
					</el-form-item>
				</el-form>
			</el-col>
			<!--列表-->
			<div>
				<el-table :data="tableData" stripe highlight-current-row style="width: 100%;">
					<el-table-column type="index" label="序号" width="80" align="left"></el-table-column>
					<el-table-column prop="month" label="校验类型" width="100" :formatter="formatStatus" align="left"></el-table-column>
					<el-table-column prop="projectName" label="项目名称" align="left"></el-table-column>
					<el-table-column prop="toCheckTarget" label="待校验目标" align="left"></el-table-column>
					<el-table-column prop="projectTargetName" label="项目名称" align="left"></el-table-column>
					<el-table-column prop="checkTarget" label="校验目标" width="170" align="left"></el-table-column>
					<el-table-column prop="checkRule" label="校验关系" width="100" align="left"></el-table-column>
				</el-table>
			</div>
		</section>
	</div>
</template>
<script>
	import store from '../../vuex/store';
	import {
		uploadCheckingRules,
		getCheckingRulesList,
		getCheckRulesNameList
	} from '../../api/api';
	import {base} from '../../api/api';
	export default {
		data() {
			return {
				baseUrl: base,
				uploadUrl: base+'/checkTables/readCheckingRule',
				// uploadUrl: 'http://192.168.50.95:8802/financialct/admin/checkTables/readCheckingRule',
				headers: {
					token: store.state.token
				},
				multiple: true, //多文件上传
				showFileList: true, //是否显示已上传文件列表
				autoUpload: true,
				fileList: [],
				acceptFileType: '.xls,.xlsx,.zip',
				loading: true,
				gridData: [],
				dialogTableVisible: false,
				tableData: [],
				listLoading: false,
				uploadShow: true,
				tableShow: false,
				addLoading: false,
				checkRulesData: [],
				bankList: [],
				bank: [],
				input: null,
				loadingShow:false,
			}
		},
		methods: {
			handeUpload: function() {
				var _this = this;
				this.$confirm('确认提交该校验规则吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					this.loadingShow = true;
					console.log("----:"+JSON.stringify(this.bank))
					let departmentId = this.bank.id;
					let checkName = this.input;
					let para = {
						checkTables: this.tableData,
						checkTableName: checkName,
						moudId: departmentId
					};
					uploadCheckingRules(para).then((res) => {
						this.listLoading = true;
						this.loadingShow = false;
						this.$message({
							message: ' 校验规则已经上传成功！',
							type: 'success'
						});
						_this.uploadShow = true;
						_this.tableShow = false;
						_this.checkRulesList();
					});
				}).catch(() => {
					// 
				});
				
			},
			//状态显示转换
			formatStatus: function(row, column) {
				return (row.month == 1) ? '月报' : row.month == 0 ? '季报' : '未知';
			},
			uploadSuccess(response, file, fileList) {
				var _this = this;
				if (response.code === 'SUCCESS') {
					if (response.message === 'SUCCESS') {
						_this.tableData = response.data,
							_this.uploadShow = false,
							_this.tableShow = true,
							this.$message({
								message: "校验规则已读取，审核完成后请点击提交！",
								type: 'success',
								duration: 4000
							});
					} else {
						alert(response.message);
						_this.dialogTableVisible = true;
						_this.gridData = response.data;
					}
				} else {
					this.$message({
						message: response.message,
						type: 'error',
						duration: 4000
					});
					_this.$refs.fileUpload.handleRemove(response, file, fileList);
				}
			},
			uploadError(response, file, fileList) {
				alert(response.message);
			},
			handleRemove(response, file, fileList) {},
			beforeupload(file) {
				const extension = file.name.split('.')[1] === 'xls';
				const extension2 = file.name.split('.')[1] === 'xlsx';
				const extension3 = file.name.split('.')[1] === 'zip';
				if (!extension && !extension2 && !extension3) {
					alert('只能上传 xls、xlsx、zip 类型的文件');
					return false;
				}
				return extension || extension2 || extension3
			},

			checkRulesList() {
				console.log("----" + this.baseUrl)
				this.listLoading = true;
				getCheckingRulesList().then((res) => {
					// console.log("getUserListPage:" + JSON.stringify(res));
					this.checkRulesData = res.data;
				});
			},
			getRoleNameList() {
				var _this = this;
				let para = {};
				getCheckRulesNameList(para).then((res) => {
					// console.log("getUserListPage:" + JSON.stringify(res));
					this.bankList = res.data;
				});
			}
		},
		mounted() {
			this.checkRulesList();
			this.getRoleNameList();
		}
	}
</script>

<style>
	.excel-up {
		width: 100%;
		margin-top: 100px;
	}

	.up-area,
	.up-tip {
		height: 180px;
		display: inline;
		float: left;
		padding-top: 5px;
		padding-bottom: 5px;
	}

	.up-area {
		width: 35%;
		/* background-color:beige; */
		text-align: right;
		padding-right: 70px;
		border-right: 1px solid #008489;
	}

	.up-tip {
		width: 45%;
		/* background-color:brown; */
		text-align: left;
		padding-left: 70px;
		/* padding-top: -50px; */
	}

	.info {
		/* margin-top: -10px; */
		font-size: 14px;
		margin-top: 1px;
	}

	.divcss1 {
		width: 95%;
		height: 800px;
		border: 1px solid white
	}

	.divcss2 {
		width: 90%;
		margin-top: 400px;
		border: 1px solid none
	}
</style>
