<template>
	<div class="excel-up">
		<div class="up-area">
			<el-upload ref="fileUpload" class="upload-demo" drag :headers="headers" :file-list="fileList" :multiple="multiple"
			 :action="uploadUrl" :before-upload="beforeupload" :show-file-list="showFileList" :accept="acceptFileType" :on-success="uploadSuccess"
			 :on-error="uploadError" :auto-upload="autoUpload" :before-remove="handleRemove" :v-loading="loading">
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
		<div slot="tip" class="up-tip"  align="left">
			<p style="font-size: 16px;font-weight: bold;margin-top: 0px;padding-bottom: 8px;">上传须知：</p> 
			<p >1.系统只能上传 <span style="font-weight: bold;">.zip、.xls、.xlsx </span>尾的文件。</p>
		    <p class="info">2.表的命名规则为：<span style="font-weight: bold;">银行名称_表唯一标识 表名称_日期_***.xls/xlsx</span>,如不符合会提示上传失败。</p>
			<p class="info">3.系统不需要用户选择上传机构和期次，上传完成系统会自动校验和匹配机构名和期次。</p>
			<p class="info">4.只能上传当期文件（如本月为6月，则只能上传6月数据），已生成数据的文件不能进行上传和修改数据。</p>
		</div>
	</div>
</template>

<script>
	import store from '../../vuex/store';
	import {base} from '../../api/api';
	export default {
		data() {
			return {
				baseUrl:base,
				uploadUrl: base+'/report/mould/upload',
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
			}
		},
		methods: {
			uploadSuccess(response, file, fileList) {
				var _this = this;
				if (response.code === 'SUCCESS') {
					if (response.message === 'SUCCESS') {
						this.$message({
							message: response.data,
							type: 'success',
							duration: 4000
						});
					} else {
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
			}
		},
		//新增
		addSubmit: function() {
			var _this = this;
			this.$refs.addForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.addLoading = true;
						let para = Object.assign({}, this.addForm);
						para.createTime = null;
						var parr = new Array();
						let t = 0;
						for (let i = 0; i < this.rolePermissionList.length; i++) {
							if (typeof(this.rolePermissionList[i]) == "number") {
								parr[t] = this.rolePermissionList[i];
								t++;
							}
						}
						para.permissios = parr;
						addRole(JSON.stringify(para)).then((res) => {
							this.addLoading = false;
							this.$confirm(res.data, '提示', {
								confirmButtonText: '确定',
							});
							this.$refs['addForm'].resetFields();
							this.addFormVisible = false;
							// this.getRoles();
						}).catch(function(error) {
							_this.$confirm(error.data.message, '提示', {
								confirmButtonText: '确定',
							});
							_this.addLoading = false;
							_this.addFormVisible = false;
							_this.$refs['addForm'].resetFields();
							_this.getRoles();
							return false;
						});
					});
				}
			});
		},
	}
</script>

<style>
	/* .uploader-example {
		width: 880px;
		padding: 15px;
		margin: 40px auto 0;
		font-size: 12px;
		box-shadow: 0 0 10px rgba(0, 0, 0, .4);
	}

	.uploader-example .uploader-btn {
		margin-right: 4px;
	}

	.uploader-example .uploader-list {
		max-height: 440px;
		overflow: auto;
		overflow-x: hidden;
		overflow-y: auto;
	} */
	
	.excel-up{
		width:  100%;
		margin-top: 100px;
	}
	
	.up-area,.up-tip{
		height: 180px;
		display:inline;
		float: left;
		padding-top: 5px;
		padding-bottom: 5px;
	}
	
	.up-area{
		width: 35%;
		/* background-color:beige; */
		text-align: right;
		padding-right: 70px;
		border-right: 1px solid #008489;
	}
	
	.up-tip{
		width: 45%;
		/* background-color:brown; */
		text-align: left;
		padding-left: 70px;
		/* padding-top: -50px; */
	}
	
	.info{
		/* margin-top: -10px; */
		font-size: 14px;
		margin-top: 1px;
	}
</style>
