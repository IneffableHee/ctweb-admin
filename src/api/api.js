import axios from './http';
import qs from "qs";

const base = 'http://192.168.50.160:8802/financialct/admin';

export {base};
//  管理员的相关操作
export const requestLogin = params => {return axios.post(`${base}/login`, qs.stringify(params)).then(res => res.data);};
export const getMenus = params => {return axios.get(`${base}/home/menu`, {params: params});};
export const getAdminListPage = params => {return axios.get(`${base}/admin/listpage`, {params: params});};
export const removeUser = params => {return axios.get(`${base}/admin/delete`, {params: params});};
export const batchRemoveUser = params => {return axios.get(`${base}/admin/batchremove`, {params: params});};

// 用户信息更改
export const editUser = params => {return axios.get(`${base}/admin/update`, {params: params});};
// 创建用户
export const addAdmin = params => {return axios.get(`${base}/admin/create`, {params: params});};
// 创建管理员
export const addUser = params => {return axios.get(`${base}/user/create`, {params: params});};

//  后期需要更改  调到adminContorc0ller
export const getUserListPage = params => {return axios.get(`${base}/user/listpage`, {params: params});};

//  获取角色的json数据
export const getRoleList = params => {return axios.get(`${base}/role/list`, {params: params});};
//  创建角色
export const addRole = params => {return axios.post(`${base}/role/create`, params).then(res => res.data);};
// 角色的删除
export const removeRole = params => {return axios.get(`${base}/role/delete`, {params: params});};
// 角色的禁用
export const disableRole = params => {return axios.get(`${base}/role/disable`, {params: params});};
// 角色的启用
export const enableRole = params => {return axios.get(`${base}/role/enable`, {params: params});};
// 角色信息更改
export const editRole = params => {return axios.post(`${base}/role/edit`, params).then(res => res.data);};
//  获取权限的json数据
export const getPermissionList = params => {return axios.get(`${base}/permission/list`, {params: params});};
// listByRoleId
export const listByRoleId = params => {return axios.get(`${base}/permission/listByRoleId`, {params: params});};
//  创建权限
export const addPermission = params => {return axios.get(`${base}/permission/create`, {params: params});};
// 权限的删除
export const removePermission = params => {return axios.get(`${base}/permission/delete`, {params: params});};
// 权限信息更改
export const editPermission = params => {return axios.get(`${base}/permission/edit`, {params: params});};
//  获取部门的json数据
export const getDepartmentList = params => {return axios.get(`${base}/department/list`, {params: params});};
export const getDepartmentList1 = params => {return axios.get(`${base}/department/list1`, {params: params});};
//  创建部门
export const addDepartment = params => {return axios.get(`${base}/department/create`, {params: params});};
// 部门的删除
export const removeDepartment = params => {return axios.get(`${base}/department/delete`, {params: params});};
// 部门信息更改
export const editDepartment = params => {return axios.get(`${base}/department/edit`, {params: params});};

export const getMouldListPage = params => {return axios.get(`${base}/mould/listpage`, {params: params});};
//获取报表生成模板
export const getReportMouldListPage = params => {return axios.get(`${base}/report/mould/listpage`, {params: params});};
export const getUserReportMouldListPage = params => {return axios.get(`${base}/report/mould/userList`, {params: params});};
//删除报表生成模板
export const removeReportMould = params => {return axios.get(`${base}/report/mould/delete`, {params: params});};
//模板生成
export const reportGeneration = params => {return axios.get(`${base}/report/generation`, {params: params});};

export const removeMould = params => {return axios.get(`${base}/mould/delete`, {params: params});};

//查看是否已经上传完毕，为后续数据生成做检查
export const getGenerationInfo = params => {return axios.get(`${base}/excel/excelUploadInfo`, {params: params});};
// 数据生成
export const getDatainfo = params => {return axios.get(`${base}/datainfo/generation`, {params: params});};

// 上传的excel的表格信息ew
export const getExcelForGenerationInfo = params => {return axios.get(`${base}/excel/excelForGenerationInfoNew`, {params: params});};

// getExcelForGenerationInfo  得到统计信息，以下获得上传或是未上传的详细数据
export const getExcelCountUploadInfo = params => {return axios.get(`${base}/excel/excelCountUploadInfoNew`, {params: params});};

// excelUploadGetTime  得到统计信息，以下获得上传或是未上传的详细数据
export const excelUploadGetTime = params => {return axios.get(`${base}/excel/excelUploadGetTime`, {params: params});};

// getExcelForGenerationInfo  得到统计信息，以下获得总的详细数据
export const getExcelCountUploadAllInfo = params => {return axios.get(`${base}/excel/excelCountUploadInfoNews`, {params: params});};

// getExcelForGenerationInfo  得到上传失败信息列表
export const getExcelErrorInfoList = params => {return axios.get(`${base}/excel/excelErrorInfoList`, {params: params});};

//批量删除excel
export const batchRemoveExcel = params => {return axios.get(`${base}/excel/batchremove`, {params: params});};

// getExcelForDelete  更新表信息
export const getExcelForUpdate = params => {return axios.get(`${base}/excel/excelUpdateInfo`, {params: params});};

// 数据信息表
export const loadAllOnlyCode = params => {return axios.get(`${base}/datainfo/loadAllOnlyCode`, {params: params});};
export const getDataInfoListPage = params => {return axios.get(`${base}/datainfo/dataInfoListPage`, {params: params});};
export const generationByDataInfoIdAndTime = params => {return axios.get(`${base}/datainfo/singleGeneration`, {params: params});};
export const deleteDataInfoById = params => {return axios.get(`${base}/datainfo/delete`, {params: params});};

//取数规则模板表文件下载
export const downMould = params => {return axios.get(`${base}/dataInfoInsert/excelDown`, {params: params});};

// 数据信息表 更改取数规则
export const getEditDataInfo = params => {return axios.get(`${base}/datainfo/editDataInfo`, {params: params});};

// 数据信息表 新增取数规则
export const getAddDataInfo = params => {return axios.get(`${base}/datainfo/addDataInfo`, {params: params});};

// 数据信息表 新增取数规则
export const getGroupBank = params => {return axios.get(`${base}/datainfo/bankGroupList`, {params: params});};
//  获取角色的json数据
export const getRoleNameList = params => {return axios.get(`${base}/role/roleNameList`, {params: params});};
//  获取用户基本信息
export const gethandleSet = params => {return axios.get(`${base}/role/handleSet`, {params: params});};
//  获取用户基本信息
export const getBasicInfo = params => {return axios.get(`${base}/role/basicInfo`, {params: params});};

//  修改用户密码
export const editSet = params => {return axios.post(`${base}/role/editSet`, params).then(res => res.data);};

//  获得校验规则列表 
export const getCheckingRulesList = params => {return axios.post(`${base}/checkTables/checkingRulesList`, params).then(res => res.data);};

//  获得机构名称 
export const getCheckRulesNameList = params => {
	return axios.post(`${base}/checkTables/checkingGroupBankNameList`, params).then(res => res.data);
};


//  上传 校验规则
export const uploadCheckingRules = params => {return axios.post(`${base}/checkTables/uploadCheckingRule`, params).then(res => res.data);};

//  获取模板
export const getModule = params => {return axios.get(`${base}/checkTables/module`, {params: params});};

export const checkTables = params => {
		return axios.get(`${base}/checkTables/bbgxxy`, {
			params: params
		});
};

//  获得银行列表名称 
export const getBankNameList = params => {
		return axios.get(`${base}/checkTables/bankNameList`, {
			params: params
		});
};

//  根据mid获得检验规则名称 
export const getCheckTableRules = params => {
	return axios.get(`${base}/checkTables/checkTableRules`, {
		params: params
	});
};

// 批量修改取数规则
export const getAllEditDataInfo = params => {return axios.get(`${base}/datainfo/allEditDataInfo`, {params: params});}; 


// 校验规则编辑  提交
export const editCheckingRule = params => {
	return axios.post(`${base}/checkTables/editCheckingRule`, params).then(res => res.data);
};

// 数据生成
export const getGenerationInfoNew = params => {return axios.get(`${base}/datainfo/generation/new`, {params: params});}; 

//  获得银行列表名称 
export const getBankGroupNameList = params => {
	return axios.post(`${base}/datainfo/getBankGroupNameList`, params).then(res => res.data);};

// 校验规则新增  提交
export const addCheckingRule = params => { return axios.post(`${base}/checkTables/addCheckingRule`, params).then(res => res.data);};

//   校验规则 删除
export const delCheckingRule = params => {return axios.get(`${base}/checkTables/delCheckingRule`, {params: params});};

//本地审表接口
export const localCheckStart = params => {return axios.get(`${base}/check/local/start`, {params: params});};

//系统审表接口
export const systemCheckStart = params => {return axios.get(`${base}/check/system/start`, {params: params});};

//获取机构列表
export const getBankList = params => {return axios.get(`${base}/check/bankList`, {params: params});};

//审表规则列表
export const getCheckTableListPage = params => {return axios.get(`${base}/checkRule/listpage`, {params: params});};

//审表规则列表
export const getCheckTableList = params => {return axios.get(`${base}/checkRule/list`, {params: params});};

//审表规则明细
export const getCheckRuleInfoList = params => {return axios.get(`${base}/checkRule/info/listpage`, {params: params});};

//创建审表规则
export const createCheckTable = params => {return axios.get(`${base}/checkRule/create`, {params: params});};

// 模糊查询
export const fuzzySearching = params => {return axios.get(`${base}/checkTables/fuzzySearching`, {params: params});};

// 模板删除
export const deleteMould = params => {return axios.get(`${base}/checkTables/deleteMould`, {params: params});};
