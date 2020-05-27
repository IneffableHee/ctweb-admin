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
			<p>1.系统只能上传 <span style="font-weight: bold;">.zip</span>尾的文件。</p>
			<p class="info">2.压缩含数据为本期数据及上期数据，单张表的命名规则为：<span style="font-weight: bold;">银行名称_表唯一标识 表名称_***_日期_***.xls/xlsx</span>,例：长顺县农村信用合作联社_GF01
				资产负债项目统计表{18年启用}_境内汇总数据_2019-06-30_人民币.xls。</p>
			<p class="info">3.系统不需要用户选择上传机构和期次，上传完成系统会自动校验和匹配机构名和期次。</p>
		</div>
	</div>
</template>

<script>
	import store from '../../vuex/store';
	import api from '../../api/api';
	export default {
		data() {
			return {
				base: api.base,
				uploadUrl: base + '/checkTables/upload',
				headers: {token: store.state.token},
				multiple: true, //多文件上传
				showFileList: true, //是否显示已上传文件列表
				autoUpload: true,
				fileList: [],
				acceptFileType: '.xls,.xlsx,.zip',
				loading: true,
			}
		},
		methods: {
			uploadSuccess(response, file, fileList) {
				var _this = this;
				this.$emit('transfer', response.data) //将值绑定到transfer上传递过去
				if (response.code === 'SUCCESS') {
					if (response.message === 'SUCCESS') {
						this.$confirm(response.data, '提示', {
							confirmButtonText: '确定',
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
				this.$confirm(response.message, '提示', {
					confirmButtonText: '确定',
				})
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
		height: 250px;
		margin-top: 20px;
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
