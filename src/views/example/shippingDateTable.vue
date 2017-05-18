<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;height: 50px;padding: 6px">
			<el-form :inline="true" :model="filters">

				<el-form-item >
					  <div class="block">
					    <el-date-picker size="small"
					      v-model="value"
					      type="datetime"
					      placeholder="选择抵港时间"
					      align="right"
					      :picker-options="pickerOptions1">
					    </el-date-picker>
					  </div>
				</el-form-item>
				<el-form-item label="节点">
					<el-select size="small" v-model="value" placeholder="请选择">
						<el-option
						v-for="item in options" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item>
					<el-input  v-model="filters.trafName" placeholder="船名" size="small"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input  v-model="filters.voyage" placeholder="航次" size="small"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" icon="search"  v-waves v-on:click="getShippingInfo">筛选</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" v-waves  @click="getShippingInfoAll">显示全部</el-button>
				</el-form-item>
				<el-form-item>
					<el-button size="small" type="primary" v-waves icon="document" @click="handleDownload">导出excel</el-button>
				</el-form-item>
			</el-form>
		</el-col>
			<!--列表-->
		<el-table :data="users"  stripe highlight-current-row v-loading="listLoading"  element-loading-text="拼命加载中" @selection-change="selsChange" style="width: 100%;font-size:10px;" :row-class-name="tableRowClassName">
			<!-- <el-table-column type="selection" width="55"> </el-table-column> -->
			<el-table-column type="index" label="序号" width="60"></el-table-column>
			<el-table-column prop="trafName" label="船名" width="150" ></el-table-column>
			<el-table-column prop="importVoyage" label="进口航次" width="100" ></el-table-column>
			<el-table-column prop="exportVoyage" label="出口航次" width="100" ></el-table-column>
			<el-table-column prop="cimoNo" label="IMO号" width="80" ></el-table-column>
			<el-table-column prop="currentState" label="状态" width="80"></el-table-column>
			<el-table-column prop="expectedArrival" label="预计抵港" width="120" sortable></el-table-column>
			<el-table-column prop="actualArrival" label="实际抵港" width="120" sortable></el-table-column>
			<el-table-column prop="expectedLeave" label="预计离港" width="120" sortable></el-table-column>
			<el-table-column prop="actualLeave" label="实际抵港" width="120" sortable></el-table-column>
			<el-table-column prop="position" label="位置" min-width="60"></el-table-column>

			<el-table-column label="操作" min-width="140">
				<template scope="scope">
					<el-button type="danger"  size="small" v-waves  @click="handleExport(scope.$index, scope.row)" :disabled="true">进口</el-button>
					<el-button type="success" size="small" v-waves @click="handleEdit(scope.$index, scope.row)">出口</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"  :current-page="currentPage"
		     :page-size="10" layout="total, sizes, prev, pager, next, jumper"
		      :total='total'  style="float:right;">
    	</el-pagination>
		<!--出口界面-->
		<el-dialog title="出口查询" v-model="editFormVisible"  ref="exportForm" :close-on-click-modal="false" style="width:110%;">
			<el-col>
				<el-form :inline="true">
					<el-form-item label="查询">
						<el-checkbox-group v-model="exportForm.type">
							<input type="checkbox"  true-exp="a" false-exp="b">整箱
							<input type="checkbox"	true-exp="a" false-exp="b">拼箱
						</el-checkbox-group>
					</el-form-item>
				</el-form>
			</el-col>
			<el-col>
				<el-form :inline="true">

					<el-form-item label="船名">
						<el-input v-model="exportForm.shippingName"  size="small" ></el-input>
					</el-form-item>
					<el-form-item label="航次">
						<el-input v-model="exportForm.voyage"  size="small"></el-input>
					</el-form-item>
					<el-form-item label="主单号">
						<el-input v-model="exportForm.mainNumber"  size="small"></el-input>
					</el-form-item>
				</el-form>
			</el-col>
			<el-col>
				<el-form :inline="true">
					<el-form-item label="场站">
						<el-select size="small" v-model="value" placeholder="请选择">
							<el-option
									v-for="item in options" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="箱数">
						<el-input v-model="exportForm.totalBox" :min="0" :max="200" size="small"></el-input>
					</el-form-item>
					<el-form-item label="分单数">
						<el-input v-model="exportForm.index" :min="0" :max="200" size="small"></el-input>
					</el-form-item>
				</el-form>
			</el-col>
			<el-col>
				<el-form :inline="true">
					<el-form-item label="分单号">
						<el-input v-model="exportForm.singleNumber" :min="0" :max="200" size="small"></el-input>
					</el-form-item>
					<el-form-item style="float:right;" v-show="isShow">
						<el-button type="primary" @click.native="exportOk" :loading="exportOkLoading">录入</el-button>
					</el-form-item>
				</el-form>

			</el-col>


			<el-col>
				<el-form :inline="true">
				 <div class="vue-xlsx-container">
				    <div class="xlsx-upload-wrapper">
				      <el-button type="button" v-show="isShow" class="xlsx-button" @click="handleUploadBtnClick">
				        <slot>批量导入</slot>
				      </el-button>
				      <input id="upload-input" type="file" :accept="accept" class="c-hide" @change="handkeFileChange">
				    </div>
				    <div v-show="showDialog" class="xlsx-dialog-wrapper">
				      <div class="xlsx-dialog-content">
				        <div class="xlsx-dialog__header">
				          <span class="el-dialog__title">
				            <slot name="dialog-title">请确认 Excel 中的数据是否正确</slot>
				          </span>
				        </div>
				        <div class="xlsx-dialog__body">
				          <xlsx-table :header="tableData.header" :body="tableData.body"></xlsx-table>
				        </div>
				        <div class="xlsx-dialog__footer">
				          <span class="dialog-footer">
				            <el-button type="button" class="xlsx-button button-large button-primary mr20" @click="hadnleCancel"><slot name="dialog-cancel">取消</slot></el-button>
				            <el-button type="button" class="xlsx-button button-large" @click="handleOk"><slot name="dialog-ok">正确</slot></el-button>
				          </span>
				        </div>
				      </div>
				    </div>
				    <div v-show="showDialog" class="xlsx-dialog-modal"></div>
				  </div>

				</el-form>
			</el-col>


			<el-table :data="excleExport" stripe height="250" highlight-current-row style="width: 100%;">
				<el-table-column type="index" label="序号" width="60"></el-table-column>
				<el-table-column prop="exportImport" label="进出口" width="100"></el-table-column>
				<el-table-column prop="shippingName" label="船名" width="100"></el-table-column>
				<el-table-column prop="voyage" label="航次" width="100" ></el-table-column>
				<el-table-column prop="mainNumber" label="主单号" width="150" ></el-table-column>
				<el-table-column prop="singleNumber" label="分单号" width="150" ></el-table-column>
				<el-table-column prop="totalBox" label="分单箱数" width="100" ></el-table-column>
				<el-table-column prop="terminal" label="场站" ></el-table-column>
			</el-table>

			<div slot="footer" class="dialog-footer">
				<el-button @click.native="hadnleExport">取消</el-button>
				<el-button type="primary" @click.native="exportSubmit" :loading="exportLoading">确认</el-button>
			</div>

		</el-dialog>
	</section>

</template>

<script>
	import util from '../../common/js/util'
	import XLSX from 'xlsx'
	import XlsxTable from './xlsx-table.vue'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser,exportList,ShippingInfo } from '../../api/api';

	export default {
		name: 'vue-xlsx-table',
		components: {
			XlsxTable
		},
		data() {
			return {
				showDialog: false,
				rawFile: null,
				workbook: null,
				tableData: {
					header: [],
					body: []
				},
				filters: {
					trafName: '',
					activeStartTimeDate: '',
					voyage: '',
					
				},

				options: [{
					value: '',
					label: '全部'
					}, {
					value: '1',
					label: '抵港'
					}, {
					value: '2',
					label: '出港'
					}],
				value: '',
				isShow: true,
				fileList3:[],
				users: [],
				excleExport: [],
				excleImport: [],
				total: 0,
				currentPage:1,
				pageNum:10,
				listLoading: false,
				exportOkLoading:false,
				exportFormVisible:false,
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				exportLoading:false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					activeStartTimeDate: [
						{ required:true, message:'请选择抵港日期',trigger:'blur'}
					]
				},
				//编辑界面数据
				exportForm: {
					shippingName: '',
					mainNumber: '',
					voyage: '',
					singleNumber: '',
					totalBox: '',
					terminal: '',
					exportImport:'出口'
				},

				 pickerOptions1: {
		          shortcuts: [{
		            text: '今天',
		            onClick(picker) {
		              picker.$emit('pick', new Date());
		            }
		          }, {
		            text: '昨天',
		            onClick(picker) {
		              const date = new Date();
		              date.setTime(date.getTime() - 3600 * 1000 * 24);
		              picker.$emit('pick', date);
		            }
		          }, {
		            text: '一周前',
		            onClick(picker) {
		              const date = new Date();
		              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
		              picker.$emit('pick', date);
		            }
		          }]
		        },
      
			}
		},
		 props: {
			accept: {
			  type: String,
			  default: '.xlsx, .xls'
			}
		  },
		  computed: {
			rABS () {
			  return window.xlsxEventBus.XLSX_EVENTS_DATA.options.rABS
			}
		  },
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},

			handleSizeChange(val) {
        		this.pageNum = val;
        		this.getShippingInfo();
      		},

			handleCurrentChange(val) {
				this.currentPage = val;
				this.getShippingInfo();
			},

			//获取船期大厅内容
			getShippingInfo() {
				let para = {
					trafName: this.filters.trafName,
					activeStartTimeDate: this.value,
					voyage:  this.filters.voyage,
					value: this.value,
					pageNum: this.pageNum,
					pageSize: this.currentPage
				};
				this.listLoading = true;
			
				ShippingInfo(para).then((res) => {
					this.total = res.data.count;
					this.users = res.data.list;
					this.listLoading = false;
				});
			},
			//导出excel表格
			handleDownload() {
				require.ensure([], () => {
					const { export_json_to_excel } = require('vendor/Export2Excel');
					const tHeader = ['序号', '文章标题', '作者', '阅读数', '发布时间'];
					const filterVal = ['currentState', 'trafName', 'importVoyage', 'exportVoyage', 'cimoNo'];
					const list = this.users;
					const data = this.formatJson(filterVal, list);
					export_json_to_excel(tHeader, data, '列表excel');
				})
			},
			formatJson(filterVal, jsonData) {
				return jsonData.map(v => filterVal.map(j => v[j]))
			},
			//获取all船期大厅内容
			getShippingInfoAll() {
				let para = {
					pageNum: this.pageNum,
					pageSize: this.currentPage
				};
				this.listLoading = true;
				this.filters.trafName=null;
				this.value=null;
				this.filters.voyage=null;
				this.value=null;
				ShippingInfo(para).then((res) => {
					this.total = res.data.count;
					this.users = res.data.list;
					this.listLoading = false;
				});
			},


			//显示出口页面
			handleEdit: function (index, row) {
				console.log(row);
				this.exportForm.shippingName=row.trafName;
				this.exportForm.voyage=row.exportVoyage
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);

			},
			//弹出框取消
			hadnleExport: function(){
				this.clearData();
			},
			//取消清楚数据
			 clearData () {
		      this.exportForm = {
	    		mainNumber:'',
				totalBox:'',
				index:'',
				singleNumber:''
		      }
				this.editFormVisible = false;
				this.isShow=true;
				this.excleExport=[];
				this.exportOkLoading=false;
		    },


			//显示界面
			handleExport: function (index, row) {
				this.exportFormVisible = true;
				this.editForm = Object.assign({}, row);
			},

			handleChange(file, fileList) {
        		this.fileList3 = fileList.slice(-3);
      		},

			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {

					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;

							let para = Object.assign({}, this.editForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							editUser(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getShippingInfo();
							});
						});
					}
				});
			},
			//出口编辑
			exportSubmit: function () {
				this.$confirm('确认提交吗？', '提示', {}).then(() => {
					
					this.exportLoading = true;
					let para = this.excleExport;
					exportList(para).then((res) => {
						this.exportLoading = false;
						if(res.data.code!=200){
							this.$message({
								message: res.data.message,
								type: 'error'
							});
							this.exportFormVisible = false;
						}else{
							this.exportLoading=false;
							_g.toastMsg('success', '保存成功');
							this.$router.replace(location);
							this.clearData();
							//this.$router.push({ path:'/table'});
							//this.getShippingInfo();
						}
					});
					/*this.$router.go({
					   name: 'table',
					   replace:true
					})*/
				});


			},
			//录入单条信息
			exportOk: function() {
				console.log(this.exportForm);
				this.excleExport.push(this.exportForm);
				this.isShow=false;
				this.exportOkLoading=true;
			},

			selsChange: function (sels) {
				this.sels = sels;
			},

			showCalendar:function(e){
				e.stopPropagation();
					var that=this;
					that.show=true;
					that.x=e.target.offsetLeft;
					that.y=e.target.offsetTop+e.target.offsetHeight+8;
					var bindHide=function(e){
					e.stopPropagation();
					that.show=false;
						document.removeEventListener('click',bindHide,false);
					};
					setTimeout(function(){
						document.addEventListener('click',bindHide,false);
				},500);
			},

			//导入excel表格
			handkeFileChange (e) {
		      if (this.rawFile !== null) {
		        return
		      }
		      this.rawFile = e.target.files[0]
		      this.fileConvertToWorkbook(this.rawFile)
		        .then((workbook) => {
		          let xlsxArr = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
		        
		          this.workbook = workbook
		          this.showDialog = true
		          this.initTable(
		            this.xlsxArrToTableArr(xlsxArr)
		          )
		        })
		        .catch((err) => {
		          console.error(err)
		        })
		    },
		    fileConvertToWorkbook (file) {
		      let reader = new FileReader()
		      let fixdata = (data) => {
		        let o = "", l = 0, w = 10240
		        for( ; l<data.byteLength/w ; ++l) {
		          o += String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)))
		        }
		        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)))
		        return o
		      }
		      return new Promise((resolve, reject) => {
		        try {
		          reader.onload = (renderEvent) => {
		            let data = renderEvent.target.result
		            if(this.rABS) {
		              /* if binary string, read with type 'binary' */
		              resolve(XLSX.read(data, {type: 'binary'}))
		            } else {
		              /* if array buffer, convert to base64 */
		              let arr = this.fixdata(data)
		              resolve(XLSX.read(btoa(arr), {type: 'base64'}))
		            }
		          }
		          reader.onerror = (error) => {
		            reject(error)
		          }
		          if (this.rABS) {
		            reader.readAsBinaryString(file)
		          } else {
		            reader.readAsArrayBuffer(file)
		          }
		        } catch (error) {
		          reject(error)
		        }
		      })
		    },
		    xlsxArrToTableArr (xlsxArr) {
		      let tableArr = []
		      let length = 0
		      let maxLength = 0
		      let maxLengthIndex = 0
		      xlsxArr.forEach((item, index) => {
		        length = Object.keys(item).length
		        if (maxLength < length) {
		          maxLength = length
		          maxLengthIndex = index
		        }
		      })
		      let tableHeader = Object.keys(xlsxArr[maxLengthIndex])
				let rowItem = {}
				//中文转英文
				let tableHeaderZn = ["index", "exportImport", "shippingName", "voyage", "mainNumber", "singleNumber", "totalBox"]
		      xlsxArr.forEach((item) => {
		        rowItem = {}
		        for (let i = 0; i < maxLength; i++) {
		          rowItem[tableHeaderZn[i]] = item[tableHeader[i]] || ''
		        }
		        tableArr.push(rowItem)
		      })
		      return {
		        header: tableHeader,
		        data: tableArr
		      }
		    },
		    tableArrToXlsxArr ({data, header}) {
		      let xlsxArr = []
		      let tempObj = {}
		      data.forEach((rowItem) => {
		        tempObj = {}
		        rowItem.forEach((item, index) => {
		          tempObj[header[index]] = item
		        })
		        xlsxArr.push(tempObj)
		      })
		      return xlsxArr
		    },
		    initTable ( {data, header} ) {
		      this.tableData.header = header
		      this.tableData.body = data
		    },
		    handleUploadBtnClick () {
		      document.getElementById('upload-input').click()
		    },
		    clearAllData () {
		      document.getElementById('upload-input').value = null
		      this.tableData = {
		        header: [],
		        body: []
		      }
		      this.rawFile = null
		      this.workbook = null
		      this.showDialog = false
		    },
		    hadnleCancel () {
		      this.$emit('on-click-cancel', this.tableData)
		      this.clearAllData()
		    },
		    handleOk () {
				this.excleExport=this.tableData.body;
				this.isShow=false;
				this.$emit('on-click-ok', this.tableData)
				this.clearAllData()
		    },
		    tableRowClassName(row, index) {
		        if (index === 1) {
		          return 'info-row';
		        } else if (index === 3) {
		          return 'positive-row';
		        }
		        return '';
		    },
		},

		mounted() {
			this.getShippingInfo();
		},

	}

</script>

<style lang="scss">
	.vue-xlsx-container{
			display: inline-block;
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		*{
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}
		.c-hide{
			display: none;
		}
		.xlsx-upload-wrapper {
		}
		.xlsx-dialog-wrapper {
			position: fixed;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			overflow: auto;
			margin: 0;
			z-index: 2001;
			.xlsx-dialog-content {
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				background: #fff;
				border-radius: 2px;
				box-shadow: 0 1px 3px rgba(0,0,0,.3);
				box-sizing: border-box;
				margin-bottom: 50px;
				top: 15%;
				width:80%;
				.xlsx-dialog__header{
					padding: 20px 20px 0;
					font-weight: bold;
				}
				.xlsx-dialog__body{
					position: relative;
					overflow: hidden;
					padding: 30px 20px;
					color: #48576a;
					width:100%;
				}
				.xlsx-dialog__footer{
					padding: 10px 20px 15px;
					text-align: right;
					box-sizing: border-box;
				}
			}
		}
		.xlsx-dialog-modal {
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			opacity: .5;
			background: #000;
			z-index: 2000;
		}
		.xlsx-table-wrapper{
				font-size: 13px;
				width: 1000px;
				table {
				table-layout: fixed;
				width: 100%;
				text-align: center;
				border-collapse: collapse;
			}
			thead {
				font-weight: bold;
				background-color: #eff2f7;
			}
			td {
				border: 1px solid #8492a6;
				padding: 5px 0;
				word-wrap: break-word;
			}
		}
	}
	.xlsx-button {
		display: inline-block;
		line-height: 1;
		white-space: nowrap;
		cursor: pointer;
		border: 1px solid #20a0ff;
		-webkit-appearance: none;
		text-align: center;
		box-sizing: border-box;
		outline: 0;
		margin: 5px;
		padding: 7px 9px;
		font-size: 12px;
		border-radius: 4px;
		color: #fff;
		background-color: #20a0ff;
		&.button-large{
			padding: 10px 15px;
			font-size: 14px;
		}
		&.button-primary{
			color: #1f2d3d;
			border: 1px solid #bfcbd9;
			background-color: #fff;
		}
	}
	.mr20{
		margin-right: 20px;
	}


	.el-table .info-row {
   	 	background: #c9e5f5;
  	}

  	.el-table .positive-row {
    	background: #e2f0e4;
  }
</style>