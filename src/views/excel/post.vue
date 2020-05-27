<template>
	<div class="excel-up">
		<div class="up-area">
			<el-upload ref="fileUpload" class="upload-demo" drag :headers="headers" :file-list="fileList" :multiple="multiple"
			 :action="uploadUrl" :before-upload="beforeupload" :show-file-list="showFileList" :accept="acceptFileType"
			 :on-success="uploadSuccess" :on-error="uploadError" :auto-upload="autoUpload" :before-remove="handleRemove"
			 :v-loading="loading">
				<i class="el-icon-upload"></i>
				<div class="el-upload-text">将文件拖到此处，或<em>点击上传</em></div>
			</el-upload>
		</div>
		<div slot="tip" class="up-tip" align="left">
			<p style="font-size: 16px;font-weight: bold;margin-top: 0px;padding-bottom: 8px;">上传须知：</p>
			<p>1.系统只能上传 <span style="font-weight: bold;">.zip、.xls、.xlsx </span>尾的文件。</p>
			<p class="info">2.表的命名规则为：<span style="font-weight: bold;">银行名称_表唯一标识 表名称_***_日期_***.xls/xlsx</span>,如不符合会提示上传失败。</p>
			<p class="info">3.系统不需要用户选择上传机构和期次，上传完成系统会自动校验和匹配机构名和期次。</p>
			<p class="info">4.只能上传当期文件（如本月为6月，则只能上传6月数据），已生成数据的文件不能进行上传和修改数据。</p>
			<p class="info">5.逾期90天非不良贷款文件上传命名规则为：<span style="font-weight: bold;">***逾期90天非不良贷款***</span>，不符合会提示上传失败。</p>
		</div>
		<el-dialog title="失败文件列表" customClass="customWidth" :visible.sync="formVisible" @close='closeDialog'>
			<!--列表-->
			<el-table :data="tableData" highlight-current-row v-loading="listLoading" align="left" style="width: 100%;">
				<el-table-column type="index" width="50" label="序号"></el-table-column>
				<el-table-column prop="fileName" label="文件名" width="600"></el-table-column>
				<el-table-column prop="code" label="表标识" width="100"></el-table-column>
				<el-table-column prop="failReason" label="上传失败原因" width="600"></el-table-column>
			</el-table>
		</el-dialog>
	</div>
</template>

<script>
	import store from '../../vuex/store';
	import {base} from '../../api/api';
	export default {
		inject: ['reload'],
		data() {
			return {
				uploadUrl: base+'/excel/upload',
				headers: {
					token: store.state.token
				},
				multiple: true, //多文件上传
				showFileList: true, //是否显示已上传文件列表
				autoUpload: true,
				fileList: [],
				formVisible: false,
				listLoading: false,
				tableData: [], //  table显示错误数据列表
				acceptFileType: '.xls,.xlsx,.zip',
				loading: true,
			}
		},
		methods: {
			uploadSuccess(response, file, fileList) {
				var _this = this;
				if (response.code === 'SUCCESS') {
					if (response.message === 'SUCCESS') {
						this.$confirm(response.data, '提示', {
							confirmButtonText: '确定',
						})
					} else {
						this.$confirm(response.message + '是否查看失败文件？', '提示', {
							confirmButtonText: '查看',
							cancelButtonText: '取消',
						}).then(() => {
							this.listLoading = true;
							this.formVisible = true;
							this.tableData = response.data;
							this.listLoading = false;
						})
					}
				} else {
					this.$confirm(response.message, '提示', {
						confirmButtonText: '确定',
					})
					_this.$refs.fileUpload.handleRemove(response, file, fileList);
				}
			},
			uploadError(response, file, fileList) {
				alert(response.message);
			},
			goto() {
				this.$router.push("/excel/errorList")
			},
			closeDialog() {
				this.childPage = 1;
				this.Page = 1;
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
		text-align: right;
		padding-right: 70px;
		border-right: 1px solid #008489;
	}

	.up-tip {
		width: 45%;
		text-align: left;
		padding-left: 70px;
	}

	.info {
		font-size: 14px;
		margin-top: 1px;
	}

	.customWidth {
		width: 70%;
	}
</style>
