<template>
	<div>
		<div class="check-container" style="height: 620px;">
			<el-button type="primary" icon="el-icon-download" style="float: right;border-radius: 0px;margin-left: 1px;" v-if="showResult==true" @click="exportExcel">导出</el-button>
			<el-button type="primary" icon="el-icon-d-arrow-left" style="float: right;border-radius: 0px;" v-if="showResult==true" @click="reset()">返回</el-button>
			
			<p class="check-title">{{checkTitle}}</p>
			<p style="text-align: center;color: white;font-size: 17px;">{{checkInfo}}</p>
			<el-card class="box-card my-card check-source" style="margin-top: 50px;" :class="{ 'hide-card': checking}">
				<div class="clearfix" style="text-align: left;">
					<span class="check-card-title">审表来源</span>
					<span class="rule_url">{{sourceName}}</span>
					<el-select v-model="bank" placeholder="选择机构" v-if="isSystemSource==true" @change="bankChanged">
						<el-option v-for="item in bankList" :key="item" :value="item"></el-option>
					</el-select>
					<!-- <el-button type="primary" v-if="isSystemSource==true" class="check-btn" round size="small" @click="getBankList()">选择机构</el-button> -->
					<!-- <el-button type="primary" v-if="source=='本地文件'" class="check-btn" round size="small">选择文件</el-button> -->
					<uploader v-if="isLocalSource==true" ref="uploader" :key="uploader_key" :options="options" :autoStart="false"
					 @file-added="onFileAdded" @change="onFileChanged" @file-success="onFileSuccess" @file-progress="onFileProgress"
					 @file-error="onFileError">
						<uploader-unsupport></uploader-unsupport>
						<uploader-btn class="upbutton" type="primary" :directory="true" style="border-radius: 25px;background-color: #126263;font-size: 13px;padding-bottom: -100px;
						float: right;color: white;border: 0px;margin-top: -29px;height: 25px;width: 84px;text-align: center;line-height: 24px;">选择文件夹</uploader-btn>
						<!-- <uploader-list ref="uploaderList"></uploader-list> -->
					</uploader>
				</div>
				<el-tabs class="check-tab" @tab-click="sourceClick">
					<el-tab-pane label="本地文件"></el-tab-pane>
					<el-tab-pane label="系统文件"></el-tab-pane>
				</el-tabs>
			</el-card>

			<el-card class="box-card my-card check-time" :class="{ 'time-local-source': isLocalSource, 'time-system-source': isSystemSource ,'hide-card':checking}">
				<div class="clearfix" style="padding-top: 6px;">
					<span class="check-card-title">审表期次</span>
					<el-select v-model="time" placeholder="选择期次">
						<el-option v-for="item in timeList" :key="item" :value="item"></el-option>
					</el-select>
				</div>
			</el-card>

			<el-card class="box-card my-card check-rule" :class="{ 'local-source': isLocalSource, 'system-source': isSystemSource,'hide-card':checking}">
				<div class="clearfix">
					<span class="check-card-title">审表规则</span>
					<span class="rule_url">{{ruleName}}</span>
					<el-select v-model="id" placeholder="选择审表规则" v-if="isSystemRule==true" @change="ruleChanged">
						<el-option v-for="item in onlineRuleList" :key="item.id" :value="item.id" :label="item.ruleName"></el-option>
					</el-select>
					<uploader v-if="isLocalRule==true" ref="module_uploader" :key="module_uploader_key" :options="module_options"
					 :autoStart="false" @file-added="onModuleFileAdded" @change="onModuleFileChanged" @file-success="onModuleFileSuccess"
					 @file-progress="onModuleFileProgress" @file-error="onModuleFileError">
						<uploader-unsupport></uploader-unsupport>
						<uploader-btn class="upbutton" :attrs="attrs" :single="true" style="border-radius: 25px;background-color: #126263;font-size: 13px;padding-bottom: -100px;
						float: right;color: white;border: 0px;margin-top: -29px;height: 21px;width: 84px;text-align: center;padding-top: 8px;">选择规则</uploader-btn>
						<!-- <uploader-list ref="uploaderList"></uploader-list> -->
					</uploader>
				</div>
				<el-tabs class="check-tab" @tab-click="ruleClick">
					<el-tab-pane label="本地规则"></el-tab-pane>
					<el-tab-pane label="系统规则"></el-tab-pane>
				</el-tabs>
			</el-card>
			<el-card class="box-card my-card check-start-btn" shadow="never" :class="{ 'local-source': isLocalSource, 'system-source': isSystemSource ,'hide-card':checking}"
			 style="border:0px;background-color: #008489;width:100%;text-align: center;padding-top: 20px;padding-bottom: 0px;">
				<el-button size="medium" @click="startUpload()">开始审表</el-button>
			</el-card>

			<div class="wrapper" v-if="hideChecking==false">
				<div class="box"></div>
				<div class="box"></div>
				<div class="box"></div>
				<div class="box"></div>
				<div class="box"></div>
				<div class="box"></div>
				<div class="box"></div>
				<div class="box"></div>
				<div class="box"></div>
				<div class="box"></div>
			</div>

			<el-table :data="resultData" border style="width: 100%;border: 1px solid #008489;margin-bottom: 20px;" 
			id="table" :row-class-name="tableRowClassName" v-if="showResult==true" cell-style="padding:2px 0 2px 0;">
				<el-table-column prop="sourceName" label="项目名称" sortable width="170"> </el-table-column>
				<el-table-column prop="sourceTable" label="表号" sortable width="80"> </el-table-column>
				<el-table-column prop="source" label="项目行列号" sortable width="200"> </el-table-column>
				<el-table-column prop="sourceValue" label="项目余额" width="90" align="right"> </el-table-column>
				<el-table-column prop="rule" label="审核关系" sortable width="120" align="center"> </el-table-column>
				<el-table-column prop="targetName" label="目标名称" width="168"> </el-table-column>
				<el-table-column prop="target" label="目标行列号" width="200"> </el-table-column>
				<el-table-column prop="targetValue" label="目标余额" width="90" align="right"> </el-table-column>
				<el-table-column prop="result" label="审核结果" width="160" sortable :formatter="formatResult"> </el-table-column>
				<!-- <el-table-column prop="accuracy" label="精度" width="180"> </el-table-column> -->
				<el-table-column prop="failMessage" label="错误信息" width="160"> </el-table-column>
				<el-table-column prop="note" label="审核信息" width="176"> </el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
	import FileSaver from 'file-saver'
	import XLSX from 'xlsx'
	import {
		getBankNameList,
		getCheckingRulesList,
		checkTables,
		localCheckStart,
		systemCheckStart,
		getBankList,
		getCheckTableList,
		base
	} from '../../api/api';

	export default {
		data() {
			return {
				checkTitle: "报表审核系统",
				checkInfo: "报表审核系统支持审核已上传报表（线上）和本机报表，使用时需选择审核报表来源（本地来源、线上报表）",
				sourceName: "", //审表文件
				ruleName: "", //规则
				isLocalSource: true,
				isSystemSource: false,
				isLocalRule: true,
				isSystemRule: false,
				checking: false,
				hideChecking: true,

				/* 表上传相关 */
				uploader_key: new Date().getTime(), //这个用来刷新组件--解决不刷新页面连续上传的缓存上传数据（注：每次上传时，强制这个值进行更改---根据自己的实际情况重新赋值）
				options: {
					target: base+'/check/local/report/upload', //SpringBoot后台接收文件夹数据的接口
					testChunks: false, //是否分片-不分片
					headers: { //设置header
						token: this.$store.getters.token
					},
					simultaneousUploads: 5
				},
				/* 规则上传 相关*/
				module_uploader_key: new Date().getTime(), //这个用来刷新组件--解决不刷新页面连续上传的缓存上传数据（注：每次上传时，强制这个值进行更改---根据自己的实际情况重新赋值）
				module_options: {
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

				xlslist: [],
				fileLength: 0,
				successFile: 0,
				progressStatus: '',
				resultData: {},
				showResult: false,

				bankTimes: {},
				bankList: [],
				timeList: [],
				bank: "",
				time: "",

				id: '',
				onlineRule: "",
				onlineRuleList: [],
				
				subjectSpan:{},
				subjectName:"",
				subjectW:5,
				isSubject:false,
			}
		},
		methods: {
			exportExcel () {
				/* generate workbook object from table */
				 //表名
				 var wb = XLSX.utils.table_to_book(document.querySelector('#table'))
				 /* get binary string as output */
				 var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
				 try {
					FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), this.bank+""+this.time+"期审表.xlsx")
				 } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
				 return wbout
			},
			
			formatResult: function(row, column) {
				if (row.result == 0) {
					return '正确';
				}
				if (row.result == 1) {
					return '错误';
				}
				if (row.result == 2) {
					return '规则错误';
				}
				if (row.result == 4) {
					return '未找到文件';
				}
				if (row.result == 10) {
					return '提示';
				}
				return '错误';
			},
			tableRowClassName({
				row,
				rowIndex
			}) {
				if (row.result == 0) {
					return 'success-row';
				} else {
					return 'warning-row';
				}
				return '';
			},
			sourceClick: function(tab, event) {
				// this.sourceName = tab.label;
				this.source = tab.label;
				if (tab.label == "本地文件") {
					this.isLocalSource = true;
					this.isSystemSource = false;
				} else {
					this.isLocalSource = false;
					this.isSystemSource = true;
					if (this.$refs.uploader.files.length > 0) {
						this.$refs.uploader.uploader.cancel();
						this.xlslist = [];
						this.fileLength = 0;
						this.successFile = 0;
					}
					this.sourceName = " ";
				}
			},
			ruleClick: function(tab, event) {
				// this.ruleName = tab.label;
				if (tab.label == "本地规则") {
					this.isLocalRule = true;
					this.isSystemRule = false;
				} else {
					this.isLocalRule = false;
					this.isSystemRule = true;
					if (this.$refs.module_uploader.files.length > 0) {
						this.$refs.module_uploader.uploader.cancel();
					}
					this.ruleName = " ";
				}
			},

			reset(){
				this.resultData = {};
				this.checkTitle= "报表审核系统";
				this.checkInfo="报表审核系统支持审核已上传报表（线上）和本机报表，使用时需选择审核报表来源（本地来源、线上报表）";
			
				this.checking= false;
				this.hideChecking= true;
				this.xlslist= [];
				this.fileLength= 0;
				this.successFile= 0;
				this.progressStatus= '';
				this.resultData= {};
				this.showResult= false;
				
			},

			onFileAdded(file) {
				if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
					this.xlslist.push(1)
				}
				this.fileLength++;
				this.sourceName = file.getRoot().name;
			},
			onFileChanged(e) {
				console.log("file upload onFileChanged " + this.fileLength + JSON.stringify(this.$refs.uploader.files));
				if (this.$refs.uploader.files.length > 0) {
					this.$refs.uploader.uploader.cancel();
					this.xlslist = [];
					this.fileLength = 0;
					this.successFile = 0;
				}
			},
			onFileSuccess(rootFile, file, message, chunk) {
				// alert("onFileSuccess"+JSON.stringify(message))
				// this.$refs.module_uploader.uploader.resume();
				var message = JSON.parse(message);
				if (message.code == "SUCCESS") {
					this.successFile++;
					console.log("11123")
				} else if (message.code == "UNAUTHENTICATED") {
					this.$refs.uploader.uploader.cancel();
					this.xlslist = [];
					this.fileLength = 0;
					this.successFile = 0;
					this.sourceName = "";
					this.ruleName = "";
					this.showResult = true;
					this.$confirm('未登录或登录超时，请重新登录！！', '提示').then(_ => {
						done();
					}).catch(_ => {});
				}
				this.fileLength--;
				if (this.fileLength == 0) {
					// alert("over,success:" + this.successFile);
					if (this.successFile == 0) {
						this.$refs.uploader.uploader.cancel();
						this.xlslist = [];
						this.fileLength = 0;
						this.successFile = 0;
						this.sourceName = "";
						this.ruleName = "";
						this.showResult = true;
						this.$confirm(this.sourceName + '文件夹下无符合系统命名规则的文件！！', '提示').then(_ => {
							done();
						}).catch(_ => {});
					} else if (this.isLocalRule == true) {
						this.$refs.module_uploader.uploader.resume();
					} else if (this.isSystemRule == true) {
						this.progressStatus = "checkStart";
					}
				}

			},
			onFileProgress(e) {
				// alert("onFileProgress")
				// file upload progress
				// returns false if progress is not computable
				console.log("file upload onFileProgress event" + JSON.stringify(e));
			},
			onFileError(rootFile, file, message, chunk) {
				// alert("onFileError" + JSON.stringify(message));

				if (this.fileLength == 0 && this.successFile == 0) {
					this.$refs.uploader.uploader.cancel();
					this.xlslist = [];
					this.fileLength = 0;
					this.successFile = 0;
					this.sourceName = "";
					this.ruleName = "";
					this.showResult = true;
					this.$confirm('上传失败！请重新登录后重试！', '提示').then(_ => {
						done();
					}).catch(_ => {});
				}
				console.log("file upload onFileError event" + JSON.stringify(e));
				this.fileLength--;
				if (this.fileLength == 0) {
					// alert("onFileError over,success:" + this.successFile);
				}
			},


			onModuleFileAdded(file) {
				this.ruleName = file.getRoot().name;
			},
			onModuleFileChanged(e) {
				if (this.$refs.module_uploader.files.length > 0) {
					this.$refs.module_uploader.uploader.cancel();
				}
			},
			onModuleFileSuccess(rootFile, file, message, chunk) {
				// file upload finish event
				var message = JSON.parse(message);
				if (message.code == "SUCCESS") {
					// alert("onModuleFileSuccess" + JSON.stringify(message))
					this.fileLength--;
					this.successFile++;
					this.progressStatus = "checkStart";
				} else if (message.code == "UNAUTHENTICATED") {
					this.$refs.module_uploader.uploader.cancel();
					this.xlslist = [];
					this.fileLength = 0;
					this.successFile = 0;
					this.sourceName = "";
					this.ruleName = "";
					this.showResult = true;
					this.$confirm('未登录或登录超时，请重新登录！！', '提示').then(_ => {
						done();
					}).catch(_ => {});
				} else {
					var almessage = "检验规则文件不符合规范或无法读取，请核对后重新选择！"
					if (message.message) {
						almessage = message.message;
					}
					this.$confirm(almessage, '文件错误！', {
						type: 'error'
					}).then(_ => {
						done();
					}).catch(_ => {});
					this.sourceName = '';
					this.ruleName = '';
					this.xlslist = [];
					this.fileLength = 0;
					this.successFile = 0;
					this.$refs.module_uploader.uploader.cancel();
					this.$refs.uploader.uploader.cancel();
				}
				console.log("file upload onFileSuccess event" + JSON.stringify(message));
			},
			onModuleFileProgress(e) {
				// file upload progress
				// returns false if progress is not computable
				console.log("file upload onModuleFileProgress event" + JSON.stringify(e));
			},
			onModuleFileError(e) {
				this.showResult = true;
				this.$confirm('连接服务器失败，请重新登录后重试！', '提示').then(_ => {
					done();
				}).catch(_ => {});
			},

			bankChanged: function() {
				var bank = this.bank;
				this.timeList = this.bankTimes[bank];
				console.log("bankTimes:" + JSON.stringify(this.bankTimes));
				console.log("timeList:" + this.timeList);
			},
			ruleChanged: function() {

			},
			startUpload() {
				if (this.sourceName == "") {
					this.$confirm('请选择审表来源！！', '提示').then(_ => {
						done();
					}).catch(_ => {});
					return;
				}
				if (this.isSystemSource == true) {
					if (this.bank == "") {
						this.$confirm('请选择审表机构！！', '提示').then(_ => {
							done();
						}).catch(_ => {});
						return;
					}
					if (this.time == "") {
						this.$confirm('请选择审表期次！！', '提示').then(_ => {
							done();
						}).catch(_ => {});
						return;
					}
				}
				if (this.isSystemRule == false) {
					if (this.ruleName == "") {
						this.$confirm('请选择审表规则！！', '提示').then(_ => {
							done();
						}).catch(_ => {});
						return;
					}
				}

				if (this.isLocalSource == true) {
					if (this.xlslist.length == 0) {
						this.$refs.uploader.uploader.cancel();
						this.xlslist = [];
						this.fileLength = 0
						this.successFile = 0;
						this.$confirm('当前文件夹下不存在报表文件，请检查文件夹是否正确！', '提示').then(_ => {
							done();
						}).catch(_ => {});
					} else {
						this.$refs.uploader.uploader.resume();
						this.checkTitle = "审表中，请稍候..."
						this.checkInfo = "审表源：";
						if(this.isLocalSource){
							this.checkInfo+=this.sourceName;
						}else{
							this.checkInfo+=this.bank+",第"+this.time+"期"
						}
											
						if(this.isLocalRule){
							this.checkInfo+=";   审表规则：";
							this.checkInfo+=this.ruleName;
						}else{
							this.checkInfo+=";   审表规则ID：";
							this.checkInfo+=this.id;
						}
						this.checking = true;
						this.hideChecking = false;
					}
				}
				
				if(this.isSystemSource == true){
					if(this.ruleName == ""){
						this.$confirm('请选择审表规则！！', '提示').then(_ => {
							done();
						}).catch(_ => {});
						return;
					}
					if(this.isLocalRule == true){
						this.$refs.module_uploader.uploader.resume();
						this.checkTitle = "审表中，请稍候..."
						this.checkInfo = "审表源：";
						if(this.isLocalSource){
							this.checkInfo+=this.sourceName;
						}else{
							this.checkInfo+=this.bank+",第"+this.time+"期"
						}
					
						if(this.isLocalRule){
							this.checkInfo+=";   审表规则：";
							this.checkInfo+=this.ruleName;
						}else{
							this.checkInfo+=";   审表规则ID：";
							this.checkInfo+=this.id;
						}
						
						this.checking = true;
						this.hideChecking = false;
					}else{
						this.progressStatus = "checkStart";
						this.checkTitle = "审表中，请稍候..."
						this.checkInfo = "审表源：";
						if(this.isLocalSource){
							this.checkInfo+=this.sourceName;
						}else{
							this.checkInfo+=this.bank+",第"+this.time+"期"
						}
											
						if(this.isLocalRule){
							this.checkInfo+=";   审表规则：";
							this.checkInfo+=this.ruleName;
						}else{
							this.checkInfo+=";   审表规则ID：";
							this.checkInfo+=this.id;
						}
						this.checking = true;
						this.hideChecking = false;
					}
				}
			},
			localCheckTableStart: function()  {
				var _this = this;
				var para = {
					ruleType: 0, //本地规则	1:系统规则
					ruleName: _this.ruleName,
					ruleId: 0,
				};
				if (_this.isSystemRule == true) {
					var id = parseInt(_this.id);
					para.ruleType = 1;
					para.ruleId = id;
				}
				console.log(JSON.stringify(para));
				localCheckStart(para).then((res) => {
					console.log(JSON.stringify(res));
					_this.hideChecking = true;
					var result = res.data.data;
					var newResult = [];
					var sucnum = 0;
					var failnum = 0;
					for (var i = 0; i < result.checkRuleInfoList.length; i++) {
						if(result.checkRuleInfoList[i].result == 0){
							sucnum ++;
						}
						newResult.push(result.checkRuleInfoList[i]);
					}
					newResult.bankName = result.bankName;
					newResult.time = result.time;
					_this.resultData = newResult;
					_this.showResult = true;
					failnum = _this.resultData.length-sucnum;
					_this.checkTitle = "审表完成！";
					_this.checkInfo = result.bankName + "报表审核第" + result.time + "期，共计"+_this.resultData.length+"项，成功"+sucnum+"项，失败"+failnum+"项。";
					for (var i = 0; i < result.checkRuleInfoList.length; i++) {
						console.log(result.checkRuleInfoList[i].source)
					}
				}).catch(function(error) {
					if (error.data.code == "FAIL") {
						_this.$confirm(error.data.message, '文件错误！', {
							type: 'error'
						}).then(_ => {
							done();
						}).catch(_ => {});
					} else {
						_this.$confirm("系统错误，请登录后重试！", '错误！', {
							type: 'error'
						}).then(_ => {
							done();
						}).catch(_ => {});
					}
					// alert(JSON.stringify(error));
				});
			},
			systemCheckTableStart: function()  {
				console.log("systemCheckTableStart")
				var _this = this;
				var para = {
					ruleType: 0, //本地规则	1:系统规则
					bankName:this.bank,
					time:this.time,
					ruleName: _this.ruleName,
					ruleId: 0,
				};
				if (_this.isSystemRule == true) {
					var id = parseInt(_this.id);
					para.ruleType = 1;
					para.ruleId = id;
				}
				console.log(JSON.stringify(para));
				systemCheckStart(para).then((res) => {
					console.log(JSON.stringify(res));
					_this.hideChecking = true;
					var result = res.data.data;
					var newResult = [];
					var sucnum = 0;
					var failnum = 0;
					for (var i = 0; i < result.checkRuleInfoList.length; i++) {
						if(result.checkRuleInfoList[i].result == 0){
							sucnum ++;
						}
						newResult.push(result.checkRuleInfoList[i]);
					}
					newResult.bankName = result.bankName;
					newResult.time = result.time;
					_this.resultData = newResult;
					_this.showResult = true;
					failnum = _this.resultData.length-sucnum;
					_this.checkTitle = "审表完成！";
					_this.checkInfo = result.bankName + "报表审核第" + result.time + "期，共计"+_this.resultData.length+"项，成功"+sucnum+"项，失败"+failnum+"项。";
					for (var i = 0; i < result.checkRuleInfoList.length; i++) {
						console.log(result.checkRuleInfoList[i].source)
					}
				}).catch(function(error) {
					if (error.data.code == "FAIL") {
						_this.$confirm(error.data.message, '文件错误！', {
							type: 'error'
						}).then(_ => {
							done();
						}).catch(_ => {});
					} else {
						_this.$confirm("系统错误，请登录后重试！", '错误！', {
							type: 'error'
						}).then(_ => {
							done();
						}).catch(_ => {});
					}
					// alert(JSON.stringify(error));
				});
			}
		},
		watch: {
			'progressStatus': function(newVal) {
				var _this = this;
				if (_this.progressStatus == "checkStart") {
					// alert("progressStatus checkStart")
					if (_this.isLocalSource == true) {
						this.localCheckTableStart();
					} else {
						this.systemCheckTableStart();
					}
				}
				_this.progressStatus = "";
			}
		},
		mounted() {
			var _this = this;
			let param = {};
			getBankList(param).then(res => {
				console.log(JSON.stringify(res));
				_this.bankList = res.data.data.bankList;
				_this.bankTimes = res.data.data.bankTimes;
				// var psRes = JSON.parse(res);
				// for(var i=0;i<psRes.bankList.length;i++){
				// 	var tmp = {};
				// 	tmp.value = res.bankList[i];
				// 	_this.bankList[i]=tmp;
				// }
			});

			getCheckTableList(param).then((res) => {
				console.log("getCheckTableList：" + JSON.stringify(res));
				this.onlineRuleList = res.data.data;
			});
		},
	}
</script>

<style>
	.hide-card {
		display: none;
	}

	.check-container {
		width: 99%;
		margin: 0 auto;
		height: 1810px;
		border-radius: 5px;
		margin-top: 10px;
		background-color: #008489;
	}

	.check-container>.check-title {
		margin: 0;
		/* padding: 0; */
		padding-top: 25px;
		font-size: 40px;
		text-align: center;
		color: white;
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	.box-card{
		max-width: 700px;
	}
	.my-card {
		width: 700px;
		height: 83px;
		margin: 0 auto;
		margin-top: 28px;
		/* border-radius: 50px; */
		padding-left: 20px;
	}

	.check-tab {
		/* border: 1px solid salmon; */
		float: bottom;
		bottom: 0;
		/* margin-bottom: -34px; */
	}

	.el-tabs__item {
		/* color: red; */
		padding-top: 0px;
		margin-top: 0px;
		margin-bottom: -5px;
		/* font-size: 50px; */
		/* border: 1px solid #008489; */
	}

	.check-card-title {
		font-size: 22px;
		font-weight: 200;
		color: #008489;
	}

	.el-tabs__active-bar {
		color: #00FF00;
		height: 5px;
	}

	.check-btn {
		border-radius: 5px;
		float: right;
		margin-top: 0px;
		width: 100px;
		font-size: 13px;
	}

	.rule_url {
		margin-left: 20px;
		color: #555;
		font-size: 15px;
		font-weight: 100;
		border-bottom: 1px solid #008489;
	}

	.local-source {
		transform: translateY(-113px);
	}

	.system-source {
		/* margin-top: -83px; */
		/* transform: translateY(10px); */
		/* transform: translateY(-83px); */
		/* transform: translateY(0px); */
	}



	.time-system-source {
		-webkit-animation-name: fadeIn;
		/*动画名称*/
		-webkit-animation-duration: 0.3s;
		/*动画持续时间*/
		-webkit-animation-iteration-count: 1;
		/*动画次数*/
		-webkit-animation-delay: 0s;
		/*延迟时间*/
	}

	.time-local-source {
		-webkit-animation-name: fadeOut;
		/*动画名称*/
		-webkit-animation-duration: 0.3s;
		/*动画持续时间*/
		-webkit-animation-iteration-count: 1;
		/*动画次数*/
		-webkit-animation-delay: 0s;
		/*延迟时间*/
	}

	.hide-checking {
		-webkit-animation-name: fadeOut;
		/*动画名称*/
		-webkit-animation-duration: 0.3s;
		/*动画持续时间*/
		-webkit-animation-iteration-count: 1;
		/*动画次数*/
		-webkit-animation-delay: 0s;
		/*延迟时间*/
	}

	@-webkit-keyframes fadeIn {
		0% {
			opacity: 0;
		}

		/*初始状态 透明度为0*/
		50% {
			opacity: 0.6;
		}

		/*中间状态 透明度为0*/
		100% {
			opacity: 1;
		}

		/*结尾状态 透明度为1*/
	}

	@-webkit-keyframes fadeOut {
		0% {
			opacity: 1;
		}

		/*初始状态 透明度为0*/
		50% {
			opacity: 0.5;
		}

		/*中间状态 透明度为0*/
		100% {
			opacity: 0;
		}

		/*结尾状态 透明度为1*/
	}

	.result-table {
		border-collapse: collapse;
	}

	.result-table,
	.table-content,
	.table-title {
		border: 1px solid #008489;
	}

	.el-table .warning-row {
		background: oldlace;
		font-size: 10px;
	}

	.el-table .success-row {
		font-size: 10px;
	}



	/* 加载动画 */
	.wrapper {
		margin: 0 auto;
		margin-top: 100px;
		/*position: absolute; 
	  top: 50%;
	  left: 50%; */
		/* -webkit-transform: translate(-50%, -50%);
	          transform: translate(-50%, -50%); */
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-pack: center;
		-ms-flex-pack: center;
		justify-content: center;
		width: 100%;
		max-width: 500px;
		height: 200px;
	}

	.box {
		width: 30px;
		height: 30px;
		margin: 0 10px;
		border-radius: 0%;
		-webkit-transform: translateY(0) rotate(0deg);
		transform: translateY(0) rotate(0deg);
		-webkit-animation: change 1s infinite alternate;
		animation: change 1s infinite alternate;
	}

	.box:nth-child(1) {
		background-color: #fff;
		-webkit-animation-delay: 0.1s;
		animation-delay: 0.1s;
	}

	.box:nth-child(2) {
		background-color: #08D9D6;
		-webkit-animation-delay: 0.2s;
		animation-delay: 0.2s;
	}

	.box:nth-child(3) {
		background-color: #fff;
		-webkit-animation-delay: 0.3s;
		animation-delay: 0.3s;
	}

	.box:nth-child(4) {
		background-color: #08D9D6;
		-webkit-animation-delay: 0.4s;
		animation-delay: 0.4s;
	}

	.box:nth-child(5) {
		background-color: #fff;
		-webkit-animation-delay: 0.5s;
		animation-delay: 0.5s;
	}

	.box:nth-child(6) {
		background-color: #08D9D6;
		-webkit-animation-delay: 0.6s;
		animation-delay: 0.6s;
	}

	.box:nth-child(7) {
		background-color: #fff;
		-webkit-animation-delay: 0.7s;
		animation-delay: 0.7s;
	}

	.box:nth-child(8) {
		background-color: #08D9D6;
		-webkit-animation-delay: 0.8s;
		animation-delay: 0.8s;
	}

	.box:nth-child(9) {
		background-color: #fff;
		-webkit-animation-delay: 0.9s;
		animation-delay: 0.9s;
	}

	.box:nth-child(10) {
		background-color: #08D9D6;
		-webkit-animation-delay: 1s;
		animation-delay: 1s;
	}

	@-webkit-keyframes change {
		0% {
			-webkit-transform: translateY(0px) rotate(0deg);
			transform: translateY(0px) rotate(0deg);
			border-radius: 0%;
		}

		50% {
			-webkit-transform: translateY(150px) rotate(180deg);
			transform: translateY(150px) rotate(180deg);
			border-radius: 50%;
		}

		100% {
			-webkit-transform: translateY(0px) rotate(360deg);
			transform: translateY(0px) rotate(360deg);
			border-radius: 0%;
		}
	}

	@keyframes change {
		0% {
			-webkit-transform: translateY(0px) rotate(0deg);
			transform: translateY(0px) rotate(0deg);
			border-radius: 0%;
		}

		50% {
			-webkit-transform: translateY(150px) rotate(180deg);
			transform: translateY(150px) rotate(180deg);
			border-radius: 50%;
		}

		100% {
			-webkit-transform: translateY(0px) rotate(360deg);
			transform: translateY(0px) rotate(360deg);
			border-radius: 0%;
		}
	}
	
	.clearfix{
		text-align: left;
	}

	.clearfix>.el-select {
		/* margin-left: 100px; */
		float: right;
	}

	.clearfix>.el-select>.el-input>.el-input__inner {
		height: 33px;

	}

	.clearfix>.el-select>.el-input>.el-input__suffix>.el-input__suffix>.el-input__icon {
		margin-top: 3px;
	}
</style>
