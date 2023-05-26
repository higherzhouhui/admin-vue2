<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="showCreateDialogClick()">添加支付渠道</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-refresh" @click="fetchData()">刷新</el-button>
      </el-form-item>
    </el-form>
    <!-- <div style="display: flex;align-items: center;">
        <el-select size="small" v-model="listQuery.status" placeholder="请选择商户名称" clearable @change="handleSearchFilter">
          <el-option v-for="item in statusOptions1" :label="item.label1" :key="item.value1" :value="item.value1"></el-option>
        </el-select>
    </div> -->

    <el-table v-cloading="listLoading" :data="list" size="mini" :default-sort="{ prop: 'sort', order: 'ascending' }"
       @sort-change="listSortChange">
      <el-table-column prop="sort" sortable="custom" label="排序" width="80" />
      <el-table-column prop="name" label="渠道名称" min-width="80" />
      <el-table-column prop="channelName1" label="商户名称" min-width="180" />
      <el-table-column label="商户图片" min-width="80">
        <template slot-scope="{ row }">
          <el-image class="vue-img-preview" :src="row.channelImage" fit="contain" lazy
            :preview-src-list="[row.channelImage]">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="logsTypeString" label="渠道图标" min-width="80" />
      <!-- <el-table-column prop="submitUrl" label="提交地址或客服QQ" min-width="280"  ></el-table-column> -->
      <el-table-column prop="lowest" label="区间最低充值金额" min-width="150" sortable />
      <el-table-column prop="highest" label="区间最高充值金额" min-width="150" sortable />
      <el-table-column prop="hierarchyId" label="用户层级" min-width="400" />
      <el-table-column prop="reward" label="奖励百分比%" min-width="120" sortable />
      <!--    <el-table-column prop="supportBank" label="支持银行" min-width="200"  ></el-table-column> -->
      <el-table-column label="渠道类型" width="100">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.type | typeFilter">{{
            row.typeString
          }}</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column label="回调类型" width="100"  >
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.callbackType | callbackFilter">{{ row.callbackTypeString }}</el-tag>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="支付产品" width="100"  >
        <template slot-scope="{ row }">
          <el-popover title="支付产品列表" placement="right" width="500" trigger="manual" v-model="row.popoverShow">
            <div>
              <el-table :data="row.productList" border size="mini" max-height="500">
                <el-table-column prop="sort" label="排序" width="60"  ></el-table-column>
                <el-table-column prop="code" label="代码" min-width="60"  ></el-table-column>
                <el-table-column prop="userRmb" label="RMB" min-width="60"  ></el-table-column>
                <el-table-column prop="goldCoin" label="金币" min-width="60"  ></el-table-column>
                <el-table-column label="状态" width="80"  >
                  <template slot-scope="scope">
                    <el-tag size="medium" :type="scope.row.status | statusFilter">{{ scope.row.status == 0 ? '启用' : '禁用' }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="80"  >
                  <template slot-scope="scope">
                    <el-button plain type="danger" size="mini" icon="el-icon-delete" @click="delOneChannelOneProduct(row, scope.row)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div style="margin-top: 10px;display: flex;justify-content: flex-end;">
                <el-button plain size="mini" @click="closeRowPopoverClick(row)">关闭</el-button>
                <el-button plain size="mini" type="primary" @click="showEditProductDialog(row)">添加</el-button>
              </div>
            </div>
            <el-button size="mini" slot="reference" @click="showRowPopoverClick(row)">
              详细
              <i class="el-icon-arrow-right el-icon--right"></i>
            </el-button>
          </el-popover>
        </template>
      </el-table-column> -->
      <el-table-column label="状态" width="140">
        <template slot-scope="{ row }">
          <el-switch v-model="row.status" :width="30" active-text="启用" :active-value="0" inactive-text="禁用"
            :inactive-value="1" @change="handleStatusChange(row)" />
        </template>
      </el-table-column>
      <!-- <el-table-column label="是否是vip通道" width="140"  >
        <template slot-scope="{ row }">
          <el-switch v-model="row.isVip" :width="30" active-text="是" :active-value="1" inactive-text="否" :inactive-value="0" @change="handleVipChange(row)"></el-switch>
        </template>
      </el-table-column> -->
      remark
      <el-table-column label="是否是包含区间金额" width="140">
        <template slot-scope="{ row }">
          <!--   <el-switch v-model="row.sizeStatus" :width="30" active-text="是" :active-value="1" inactive-text="否" :inactive-value="0" @change="handleSizeStautsChange1(row)"></el-switch> -->
          <el-switch v-model="row.sizeStatus" :width="30" active-text="是" :active-value="1" inactive-text="否"
            :inactive-value="0" @change="handleSizeStautsChange1(row)" />
        </template>
      </el-table-column>
      <el-table-column label="充值说明" width="70" fixed="right">
        <!-- <el-table-column prop="remark" label="玩法说明"  min-width="80"  ></el-table-column> -->
        <template slot-scope="{ row }">
          <span class="operation_btn" type="info" size="mini" @click="examinePay(row)">查看</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="{ row }">
          <span class="operation_btn" type="primary" size="mini" @click="showUpdateDialogClick(row)">编辑</span>
          <span class="operation_btn" type="danger" size="mini" @click="showDeleteDialogClick(row)">删除</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.page" :page-sizes="[10, 20, 50]"
      :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />

    <!-- 新建编辑 弹窗 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogCreateVisible1" :close-on-click-modal="false"
      :destroy-on-close="true">
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-position="top" label-width="120px"
          size="medium">
          <el-form-item prop="name" label="渠道名称"><el-input v-model="createModel.name" clearable placeholder="用户id"
              maxlength="20" /></el-form-item>
          <el-form-item prop="remark" label="备注"><el-input v-model="createModel.remark" type="textarea" clearable
              placeholder="备注" maxlength="10000" @input="change($event)" /></el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogCreateVisible1 = false">取消</el-button>
        <el-button size="medium" type="primary" @click="updatePayExplain()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 新建/编辑 版本 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogCreateVisible" :close-on-click-modal="false"
      :destroy-on-close="true" top="5vh" width="700px">
      <div v-cloading="dialogCreateLoading" style="width: 100%;">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-position="top" size="medium">
          <el-form-item label="渠道名称" prop="name"><el-input v-model="createModel.name" clearable placeholder="请输入渠道名称"
              maxlength="200" show-word-limit /></el-form-item>
          <el-form-item label="排序" prop="sort"><el-input v-model.number="createModel.sort" clearable
              placeholder="请输入排序号" maxlength="5" /></el-form-item>

          <el-form-item label="商户名称">
            <el-input v-model="createModel.channelName" clearable placeholder="请输入商户名称" maxlength="200" />
            <!-- <el-select v-model="createModel.channelName" size="small" placeholder="请选择状态">
              <el-option v-for="item in statusOptions1" :key="item.value1" :label="item.label1" :value="item.value1" />
            </el-select> -->
          </el-form-item>
          <el-form-item label="商户图片">
            <el-upload class="avatar-uploader" action="" :show-file-list="false" :before-upload="beforeImgUpload"
              :http-request="
                (params) => uploadImgRequest(params, 'channelImage')
              ">
              <img v-if="createModel.channelImage" :src="createModel.channelImage" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
            {{ createModel.channelImage }}
          </el-form-item>

          <!--  <el-form-item label="商户名称" prop="channelName1"><el-input v-model.number="createModel.channelName" clearable placeholder="请输入商户名称" maxlength="20" /></el-form-item> -->
          <el-form-item label="下单提交地址或客服QQ" prop="submitUrl">
            <el-input v-model="createModel.submitUrl" type="textarea" placeholder="请输入下单提交地址或客服QQ" maxlength="2000"
              :autosize="{ minRows: 2, maxRows: 4 }" show-word-limit />
          </el-form-item>

          <el-form-item label="区间最低充值金额" prop="lowest"><el-input v-model="createModel.lowest" clearable
              placeholder="请输入最低金额" maxlength="60" show-word-limit /></el-form-item>
          <el-form-item label="区间最高充值金额" prop="highest"><el-input v-model="createModel.highest" clearable
              placeholder="请输入最高金额" maxlength="60" show-word-limit /></el-form-item>
          <el-form-item label="充值奖励百分比%" prop="reward"><el-input v-model="createModel.reward" clearable
              placeholder="请输入充值奖励百分比" maxlength="200" /></el-form-item>
          <!--   <el-form-item label="支持银行" prop="reward"><el-input v-model="createModel.supportBank" clearable placeholder="请输入支持银行,多个银行请以英文逗号','间隔" maxlength="2000" /></el-form-item> -->
          <el-form-item label="支持银行/USDT类型">
            <el-input v-model="createModel.supportBank" type="textarea" placeholder="请输入支持银行,多个银行/USDT类型请以英文逗号','间隔"
              maxlength="2000" :autosize="{ minRows: 2, maxRows: 4 }" show-word-limit />
          </el-form-item>

          <el-form-item label="渠道类型">
            <el-select v-model="createModel.type" placeholder="请选择渠道类型">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="createModel.type == 29" label="USDT兑换越南盾汇率" prop="rate"><el-input
              v-model="createModel.rate" clearable placeholder="请输入USDT兑换越南盾汇率" maxlength="200" /></el-form-item>
          <el-form-item label="渠道图标">
            <el-select v-model="createModel.logs" placeholder="请选择渠道图标">
              <el-option v-for="item in logstypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="回调数据类型">
            <el-select v-model="createModel.callbackType" placeholder="请选择回调数据类型">
              <el-option v-for="item in callbackOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="是否VIP通道">
            <el-select v-model="createModel.isVip" placeholder="请选择是否VIP通道">
              <el-option v-for="item in isVipOptions" :label="item.label" :key="item.value" :value="item.value" />
            </el-select>
          </el-form-item> -->

          <el-form-item label="是否包含区间金额">
            <el-select v-model="createModel.sizeStatus" placeholder="请选择">
              <el-option v-for="item in sizeStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item prop="remark" label="备注"><el-input v-model="createModel.remark" type="textarea" clearable
              placeholder="备注" maxlength="10000" @input="change($event)" /></el-form-item>
          <!-- <el-form-item label="用户层级">
          <el-select size="medium" style="width: 300px;"  v-model="listQuery.familyIds" multiple filterable clearable placeholder="请选择用户层级">
            <el-option v-for="item in familyList" :label="item.label" :key="item.value" :value="item.value"></el-option>
          </el-select>
         </el-form-item> -->

          <el-form-item label="用户层级">
            <div style="
                margin-bottom: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
              ">
              <!-- 多选家族搜索 -->
              <el-select v-model="listQuery.familyIds" size="medium" style="width: 300px" multiple filterable clearable
                placeholder="请输入或选择家族" @clear="handleSearchFilter">
                <el-option v-for="item in familyList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </div>
          </el-form-item>

          <el-form-item label="选择产品(正序排序)">
            <el-table ref="productTable" :data="
                dialogStatus === 'create'
                  ? dialogCreateProductOptions
                  : dialogUpdateProductOptions
              " size="mini" max-height="400" @selection-change="dialogCreateProductListSelChange">
              <el-table-column type="index" label="序号" width="70" />
              <el-table-column prop="sort" label="排序" width="60" />
              <el-table-column prop="code" label="代码" min-width="60" />
              <el-table-column prop="userRmb" label="VND" min-width="60" />
              <el-table-column prop="goldCoin" label="金币" min-width="60" />
              <el-table-column label="状态" width="80">
                <template slot-scope="{ row }">
                  <el-tag size="medium" :type="row.status | statusFilter">{{
                    row.status == 0 ? "启用" : "禁用"
                  }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column type="selection" width="55" />
            </el-table>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogCreateVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="handleDataClick()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 添加支付产品 -->
    <el-dialog :title="dialogProductTitle" :visible.sync="dialogProductVisible" :close-on-click-modal="false"
      :destroy-on-close="true">
      <div v-cloading="dialogProductLoading" style="width: 100%; height: 100%">
        <el-table :data="dialogProductList" size="mini" max-height="500" empty-text="暂无可添加的产品"
          @selection-change="dialogProductListSelChange">
          <el-table-column prop="sort" label="排序" width="60" />
          <el-table-column prop="code" label="代码" min-width="60" />
          <el-table-column prop="userRmb" label="VND" min-width="60" />
          <el-table-column prop="goldCoin" label="金币" min-width="60" />
          <el-table-column label="状态" width="80">
            <template slot-scope="{ row }">
              <el-tag size="medium" :type="row.status | statusFilter">{{
                row.status == 0 ? "启用" : "禁用"
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column type="selection" width="55" />
        </el-table>
      </div>
      <div slot="footer">
        <el-button size="mini" plain @click="dialogProductVisible = false">取消</el-button>
        <el-button size="mini" plain type="primary" @click="confirmAddProductClick()">添加（正序排列）</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPayChannelList,
  updatePayExplain,
  createPayChannel,
  updatePayChannel,
  updatePayChannel1,
  updatePayChannelProduct,
  deletePayChannel,
  updateStatus,
  getHierarchyList,
} from '@/api/config/pay'
import { getPayProductList } from '@/api/config/pay_product'
import {
  emptyS,
  nullS,
  MergeArray,
  beforeUploadImage,
  listCompareBy,
  sortBy,
  uploadResourceFiles,
} from '@/utils/tools'

export default {
  name: 'ConfigPayChannelPage',
  filters: {
    callbackFilter(status) {
      const map = {
        1: '',
        2: 'success',
        3: 'warning',
      }
      return map[status]
    },
    typeFilter(status) {
      const map = {
        1: '',
        2: 'success',
        3: 'warning',
        4: 'info',
      }
      return map[status]
    },
    statusFilter(status) {
      const map = {
        0: 'success',
        1: 'info',
      }
      return map[status]
    },
    isVipFilter(isVip) {
      const map = {
        0: 'success',
        1: 'info',
      }
      return map[isVip]
    },
  },
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        familyIds: null,
        total: 0,
      },

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateVisible1: false,
      dialogCreateLoading: false,
      dialogStatus: '',
      dialogTitleMap: {
        create: '添加支付渠道',
        update: '编辑支付渠道',
      },
      dialogUpdateProductOptions: [],
      dialogCreateProductOptions: [],
      statusOptions1: [
        /* { label1: '优付包-TrueMoney', value1: '0' },
                      { label1: '优付包-Airpay', value1: '1' },
                      { label1: '优付包-银行扫码', value1: '2' }, */
        { label1: 'rp-銀行轉卡', value1: 'VNBANK' },
        { label1: 'rp-momo', value1: 'VNMOMO' },
        { label1: 'rp-zalo', value1: 'VNZALO' },
        { label1: 'rp-ViettelPay', value1: 'VNVTPAY' },
        { label1: 'rp-网关支付', value1: 'VNDIRECT' },
        { label1: 'rp-扫码支付', value1: 'VNBANKQR' },
        /*  { label1: '优付包-网银支付', value1: '3' },
                      { label1: '优付包-网关支付', value1: '4' }, */
        { label1: '公司入款', value1: '16' },
        { label1: 'USDT', value1: '106' },
      ],

      familyList: null,
      // 表单模型
      createModel: {
        id: 0,
        name: null,
        submitUrl: null,
        sort: 0,
        type: 1,
        callbackType: 1,
        isVip: 0,
        productSelList: null,
        logs: null,
        lowest: 0,
        highest: 0,
        reward: 0,
        sizeStatus: 0,
        supportBank: null,
        hierarchy: null,
        channelName: null,
        channelName1: null,
        remark: null,
        rate: 1,
        channelImage: null,
      },
      callbackOptions: [
        { value: 1, label: 'URL' },
        { value: 2, label: 'HTML' },
        { value: 3, label: '二维码' },
        { value: 4, label: '外部浏览器调用' },
        { value: 5, label: 'H5' },
      ],
      logstypeOptions: [
        { value: '1', label: '火' },
        { value: '2', label: '推荐' },
        { value: '3', label: '热' },
        { value: '4', label: '极速到账' },
      ],

      typeOptions: [
        /* { value: 1, label: '支付宝' }, { value: 2, label: '微信' }, { value: 3, label: '人工客服' }, { value: 4, label: '银联' } , { value: 5, label: 'QQ客服' } , */

        /* { value: 6, label: '代理充值' }, { value: 7, label: '银行卡充值' }, { value: 8, label: '京东扫码' }, { value: 9, label: 'QQwap' }, { value: 10, label: '快捷wap' },
      { value: 11, label: '网银' }, */ { value: 7, label: '公司入款' },
        { value: 12, label: 'momo' },
        { value: 13, label: 'zalo' },
        { value: 18, label: '银行扫码' },
        { value: 15, label: '直链' },
        { value: 16, label: '网关' },
        { value: 17, label: 'VTPay' },
        { value: 14, label: 'veittel' },
        { value: 19, label: '充值卡' },
        { value: 29, label: 'USDT' },
      ],
      isVipOptions: [
        { value: 0, label: '否' },
        { value: 1, label: '是' },
      ],
      sizeStatusOptions: [
        { value: 0, label: '否' },
        { value: 1, label: '是' },
      ],
      // 验证规则
      rules: {
        name: [
          { required: true, message: '请输入渠道名称', trigger: 'change' },
          { min: 1, max: 200, message: '最多为200个字符', trigger: 'change' },
        ],
        submitUrl: [
          {
            required: true,
            message: '请输入下单提交地址或客服QQ',
            trigger: 'change',
          },
          { min: 1, max: 300, message: '最多为300个字符', trigger: 'change' },
        ],
        sort: [
          { required: true, message: '请输入排序号' },
          { type: 'number', message: '请输入正确的排序号' },
        ],
      },

      // 添加支付产品
      dialogProductRowDic: null,
      dialogProductTitle: '编辑支付产品',
      dialogProductVisible: false,
      dialogProductLoading: false,
      dialogProductList: null,
      dialogProductListSels: [],
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 重新设置表单数据
    resetCreateModel() {
      this.createModel = {
        id: 0,
        name: null,
        submitUrl: null,
        sort: 0,
        type: null,
        isVip: 0,
        callbackType: 1,
        productSelList: null,
        logs: null,
        lowest: 0,
        highest: 0,
        reward: 0,
        sizeStatus: 0,
        supportBank: null,
        hierarchy: null,
        channelName: null,
        channelName1: null,
        remark: null,
        rate: 1,
        channelImage: null,
      }
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      var productTags = []
      this.familyList = null
      // 获取支付产品列表
      this.dialogCreateVisible1 = false
      getHierarchyList()
        .then((res) => {
          this.familyList = (res.data.list || []).map((item) => {
            return {
              value: item.id,
              label: nullS(item.name),
            }
          })
          this.todayListLoading = true
          return getPayProductList({})
        })
        //  getPayProductList({})
        .then((res) => {
          productTags = res.data.list || []

          // 给添加和编辑弹窗用
          this.dialogUpdateProductOptions = productTags.sort(sortBy('sort'))
          this.dialogCreateProductOptions = productTags
            .filter((item) => item.status == 0)
            .sort(sortBy('sort'))

          // 获取支付渠道
          return getPayChannelList(this.listQuery.limit, this.listQuery.page)
        })
        .then((res) => {
          const list = (res.data.list || []).map((item) => {
            var typeStr = ''
            if (item.type == 1) {
              typeStr = '支付宝'
            } else if (item.type == 2) {
              typeStr = '微信'
            } else if (item.type == 3) {
              typeStr = '人工客服'
            } else if (item.type == 4) {
              typeStr = '银联'
            } else if (item.type == 5) {
              typeStr = 'QQ客服'
            } else if (item.type == 6) {
              typeStr = '代理充值'
            } else if (item.type == 7) {
              typeStr = '公司入款'
            } else if (item.type == 8) {
              typeStr = '京东扫码'
            } else if (item.type == 9) {
              typeStr = 'QQwap'
            } else if (item.type == 10) {
              typeStr = '快捷wap'
            } else if (item.type == 11) {
              typeStr = '网银'
            } else if (item.type == 12) {
              typeStr = 'TrueMoney'
            } else if (item.type == 13) {
              typeStr = 'Airpay'
            } else if (item.type == 14) {
              typeStr = 'veittel'
            } else if (item.type == 15) {
              typeStr = '直链'
            } else if (item.type == 16) {
              typeStr = '网关'
            } else if (item.type == 17) {
              typeStr = 'VTPay'
            } else if (item.type == 18) {
              typeStr = '银行扫码'
            } else if (item.type == 19) {
              typeStr = '充值卡'
            } else if (item.type == 29) {
              typeStr = 'USDT'
            }

            var channelName1 = ''
            if (item.channelName == 'VNBANK') {
              channelName1 = 'RP-銀行轉卡'
            } else if (item.channelName == 'VNDIRECT') {
              channelName1 = 'RP-網銀直連'
            } else if (item.channelName == 'VNBANKQR') {
              channelName1 = 'RP-银行扫码'
            } else if (item.channelName == 'VNZALO') {
              channelName1 = 'RP-ZALO'
            } else if (item.channelName == 'VNMOMO') {
              channelName1 = 'RP-MOMO'
            } else if (item.channelName == '106') {
              channelName1 = 'USDT'
            } else if (item.channelName == '16') {
              channelName1 = '公司入款'
            } else if (item.channelName == 'VNVTPAY') {
              channelName1 = 'RP-ViettelPay'
            } else if (item.channelName == 'QRPay') {
              channelName1 = '壹支付-扫码支付'
            }

            var callbackTypeStr = ''
            if (item.callbackType == 1) {
              callbackTypeStr = 'URL'
            } else if (item.callbackType == 2) {
              callbackTypeStr = 'HTML'
            } else if (item.callbackType == 3) {
              callbackTypeStr = '二维码'
            } else if (item.callbackType == 4) {
              callbackTypeStr = '外部浏览器调用'
            } else if (item.callbackType == 5) {
              callbackTypeStr = 'H5'
            }

            var logsTypeString = ''
            if (item.logs == 1) {
              logsTypeString = '火'
            } else if (item.logs == 2) {
              logsTypeString = '推荐'
            } else if (item.logs == 3) {
              logsTypeString = '热'
            } else if (item.logs == 4) {
              logsTypeString = '极速到账'
            }

            this.$set(item, 'channelName1', channelName1)
            this.$set(item, 'logsTypeString', logsTypeString)
            this.$set(item, 'typeString', typeStr)
            this.$set(item, 'callbackTypeString', callbackTypeStr)
            this.$set(
              item,
              'productList',
              this.handeProductList(item.product, productTags)
            )

            for (const row of this.list || []) {
              if (row.id == item.id) {
                this.$set(item, 'popoverShow', row.popoverShow)
                break
              }
            }

            return item
          })

          this.list = list.sort(sortBy('sort'))
          this.listLoading = false
          this.listQuery.total = res.data.total
        })
        .catch((err) => {
          this.list = null
          this.listQuery.total = 0
          this.familyList = null
          this.listLoading = false
          this.$message.error(err)
        })
    },

    // 显示编辑弹出窗
    examinePay(row) {
      this.resetCreateModel()
      this.dialogCreateVisible1 = true
      this.dialogStatus = 'update'
      this.createModel = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 显示/关闭 Popover弹窗
    showRowPopoverClick(row) {
      for (const item of this.list || []) {
        item.popoverShow = row.id == item.id
      }
    },
    closeRowPopoverClick(row) {
      for (const item of this.list || []) {
        item.popoverShow = false
      }
    },

    // 显示创建弹出窗
    showCreateDialogClick() {
      this.resetCreateModel()
      this.dialogCreateVisible = true
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 显示编辑弹出窗
    showUpdateDialogClick(row) {
      this.resetCreateModel()
      this.dialogCreateVisible = true
      this.dialogStatus = 'update'
      this.createModel = Object.assign({}, row)
      this.listQuery.familyIds = this.createModel.hierarchy
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      // ////// 设置产品选择 //////////
      const that = this
      this.$nextTick(() => {
        that.$refs['productTable'].clearSelection()
        that.createModel.productList.forEach((item) => {
          that.$refs['productTable'].toggleRowSelection(item, true)
        })
      })
    },

    // 显示删除弹窗
    showDeleteDialogClick(row) {
      if (row.id == null || row.id < 0) {
        this.$message.error('参数错误')
        return
      }
      this.$confirm('是否删除该渠道？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          deletePayChannel([row.id])
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '删除渠道成功',
                type: 'success',
                duration: 1500,
              })
              setTimeout((_) => {
                this.fetchData()
              }, 200)
            })
            .catch((err) => {
              this.listLoading = false
              this.$message.error(err)
            })
        })
        .catch(() => {})
    },
    // 编辑充值说明弹窗
    updatePayExplain() {
      const formDic = Object.assign({}, this.createModel)
      const params = {
        name: nullS(formDic.name),
        id: formDic.id,
        remark: formDic.remark,
      }

      this.$confirm('是否修改该渠道充值说明？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          updatePayExplain(params)
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '修改渠道成功',
                type: 'success',
                duration: 1500,
              })
              this.dialogCreateVisible1 = false
              setTimeout((_) => {
                this.fetchData()
              }, 200)
            })
            .catch((err) => {
              this.listLoading = false
              this.$message.error(err)
            })
        })
        .catch(() => {})
    },

    // 更改渠道状态
    handleStatusChange(row) {
      const rowDic = Object.assign({}, row)
      // 请求服务器
      this.listLoading = true
      updateStatus({
        id: rowDic.id || 0,
        status: rowDic.status,
      })
        .then((res) => {
          this.listLoading = false
          this.$notify({
            title: '提示',
            message: '修改状态成功',
            type: 'success',
            duration: 1000,
          })
        })
        .catch((err) => {
          row.status = !rowDic.status
          this.listLoading = false
          this.$message.error(err)
        })
    },

    handleVipChange(row) {
      const rowDic = Object.assign({}, row)
      // 请求服务器
      this.listLoading = true
      updatePayChannel({
        id: rowDic.id || 0,
        isVip: rowDic.isVip,
      })
        .then((res) => {
          this.listLoading = false
          this.$notify({
            title: '提示',
            message: '修改VIP成功',
            type: 'success',
            duration: 1000,
          })
        })
        .catch((err) => {
          row.isVip = !rowDic.isVip
          this.listLoading = false
          this.$message.error(err)
        })
    },

    handleSizeStautsChange(row) {
      const rowDic = Object.assign({}, row)
      // 请求服务器
      this.listLoading = true
      updatePayChannel({
        id: rowDic.id || 0,
        sizeStatus: rowDic.sizeStatus,
      })
        .then((res) => {
          this.listLoading = false
          this.$notify({
            title: '提示',
            message: '修改区间状态成功',
            type: 'success',
            duration: 1000,
          })
        })
        .catch((err) => {
          row.sizeStatus = !rowDic.sizeStatus
          this.listLoading = false
          this.$message.error(err)
        })
    },

    handleSizeStautsChange1(row) {
      const rowDic = Object.assign({}, row)
      // 请求服务器
      this.listLoading = true
      updatePayChannel1({
        id: rowDic.id || 0,
        sizeStatus: rowDic.sizeStatus,
      })
        .then((res) => {
          this.listLoading = false
          this.$notify({
            title: '提示',
            message: '修改区间状态成功',
            type: 'success',
            duration: 1000,
          })
        })
        .catch((err) => {
          row.sizeStatus = !rowDic.sizeStatus
          this.listLoading = false
          this.$message.error(err)
        })
    },

    // 创建/更新 数据
    handleDataClick() {
      // console.log("====================================="+this.listQuery.familyIds)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel)

          // if (
          //   formDic.productSelList == null ||
          //   JSON.stringify(formDic.productSelList) === "[]"
          // ) {
          //   this.$message({
          //     message: "最少选择一项产品",
          //     type: "warning",
          //   });
          //   return;
          // }

          // 请求服务器
          this.dialogCreateLoading = true
          var abb = this.listQuery.familyIds
          const params = {
            name: nullS(formDic.name),
            logs: formDic.logs,
            hierarchy: abb,
            submitUrl: nullS(formDic.submitUrl),
            sort: formDic.sort || 0,
            type: formDic.type || 0,
            isVip: formDic.isVip || 0,
            callbackType: formDic.callbackType || 0,
            product: formDic.productSelList,
            lowest: formDic.lowest || 0,
            highest: formDic.highest || 0,
            reward: formDic.reward || 0,
            supportBank: nullS(formDic.supportBank),
            sizeStatus: formDic.sizeStatus,
            channelName: formDic.channelName,
            remark: formDic.remark,
            rate: formDic.rate || 1,
            channelImage: formDic.channelImage,
          }
          if (this.dialogStatus === 'create') {
            params['status'] = 1
            createPayChannel(params)
              .then((res) => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '创建渠道成功',
                  type: 'success',
                  duration: 1500,
                })
                setTimeout((_) => {
                  this.fetchData()
                }, 200)
              })
              .catch((err) => {
                this.dialogCreateLoading = false
                this.$message.error(err)
              })
          } else {
            params['id'] = formDic.id || 0
            params['status'] = formDic.status
            updatePayChannel(params)
              .then((res) => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '修改渠道成功',
                  type: 'success',
                  duration: 1500,
                })
                setTimeout((_) => {
                  this.fetchData()
                }, 200)
              })
              .catch((err) => {
                this.dialogCreateLoading = false
                this.$message.error(err)
              })
          }
        }
      })
    },

    // 过滤
    handleSearchFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },

    // 每页的条数改变
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.listQuery.page = 1
      this.fetchData()
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.fetchData()
    },

    // 列表排序改变
    listSortChange(val) {
      if (val.prop === 'sort') {
        var list = this.list
        if (val.order === 'ascending') {
          this.list = list.sort(sortBy('sort'))
        } else {
          this.list = list.sort(sortBy('sort', false))
        }
      }
    },

    // 创建/添加弹窗时，产品选择变化事件
    dialogCreateProductListSelChange(val) {
      const sortSelList = val.sort(sortBy('sort'))
      this.createModel.productSelList = sortSelList.map((item) => item.code)
    },

    /**
     * -------- 产品操作 --------
     */

    // 处理添加支付产品弹窗列表
    dialogProductListSelChange(val) {
      this.dialogProductListSels = (val || []).map((item) => {
        return {
          code: item.code,
          sort: item.sort || 0,
        }
      })
    },

    // 删除一个渠道的一个产品
    // delOneChannelOneProduct(row, item) {
    //   const rowDic = Object.assign({}, row);
    //   const itemDic = Object.assign({}, item);
    //   let plist = rowDic.productList.filter(p => p.code != item.code); // 过滤，来获取删除后的值
    //   const sortPList = plist.sort(sortBy('sort')); // 正序后的值
    //   const plistCode = sortPList.map(p => p.code);
    //   // 请求服务器
    //   updatePayChannelProduct(plistCode, rowDic.id)
    //     .then(res => {
    //       this.$notify({
    //         title: '提示',
    //         message: '删除成功',
    //         type: 'success',
    //         duration: 1000
    //       });
    //       setTimeout(_ => {
    //         this.fetchData();
    //       }, 200);
    //     })
    //     .catch(err => {
    //       this.$message.error(err);
    //     });
    // },

    // 处理道具标签
    handeProductList(tags, list) {
      var itemList = []
      if (!emptyS(`${tags}`)) {
        const tagString = nullS(`${tags}`)
        const tagArray = tagString.split(',')
        if (tagArray instanceof Array) {
          for (const tag of tagArray) {
            for (const item of list) {
              if (item.code == tag) {
                itemList.push(item)
                break
              }
            }
          }
        }
      }
      return itemList
    },

    // 显示添加支付产品弹窗
    showEditProductDialog(row) {
      const rowDic = Object.assign({}, row)
      this.dialogProductRowDic = null
      this.dialogProductList = null
      this.dialogProductListSels = []
      this.dialogProductRowDic = rowDic
      this.dialogProductTitle = `添加「${rowDic.name}渠道」的支付产品`
      this.dialogProductVisible = true
      this.dialogProductLoading = true
      const sels = this.handeDialogProductList(rowDic.product)

      // 获取(启用的)支付产品列表
      getPayProductList({})
        .then((res) => {
          const list = (res.data.list || []).filter((item) => {
            // 包含已选择
            if (sels.indexOf(item.code) != -1) {
              return false
            }
            // 启用
            if (item.status == 1) {
              return false
            }
            return true
          })
          this.dialogProductList = list.sort(sortBy('sort')) // 正序排序
          this.dialogProductLoading = false
        })
        .catch((err) => {
          this.dialogProductList = null
          this.dialogProductLoading = false
        })
    },
    // 隔行换色
    /* tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      }, */

    // 添加渠道产品
    confirmAddProductClick() {
      if (
        this.dialogProductRowDic.id == null ||
        this.dialogProductRowDic.id < 1
      ) {
        this.$message.error('参数错误')
        return
      }

      // 已经存在的
      var existProducts = (this.dialogProductRowDic.productList || []).map(
        (item) => {
          return {
            code: item.code,
            sort: item.sort || 0,
          }
        }
      )

      // 选择的
      var selProducts = this.dialogProductListSels
      if (selProducts.length < 1) {
        this.$message({
          message: '未选择产品',
          type: 'warning',
        })
        return
      }
      // 合并后的
      var products = MergeArray(existProducts, selProducts)
      // 正序排序
      const sortProducts = products.sort(sortBy('sort'))
      // 筛选
      const channelProducts = sortProducts.map((item) => item.code)

      // 请求服务器
      this.dialogProductLoading = true
      updatePayChannelProduct(channelProducts, this.dialogProductRowDic.id)
        .then((res) => {
          this.dialogProductLoading = false
          this.dialogProductVisible = false
          this.$notify({
            title: '提示',
            message: '添加成功',
            type: 'success',
            duration: 1000,
          })
          setTimeout((_) => {
            this.fetchData()
          }, 200)
        })
        .catch((err) => {
          this.dialogProductLoading = false
          this.$message.error(err)
        })
    },
    beforeImgUpload(file) {
      console.log('-----------上传之前------------')
      const { can, msg } = beforeUploadImage(file.type, file.size)
      if (!can) {
        this.$message.error(msg)
      } else {
        this.dialogCreateLoading = true
      }
      return can
    },

    uploadImgRequest(option, content) {
      console.log('-----------自定义上传方法------------')
      this.$store
        .dispatch('oss/getOSSInfos')
        .then((res) => {
          return uploadResourceFiles(
            {
              ossParams: res,
              fileName: option.file.name,
              file: option.file,
              dir: 'business'
            }
          )
        })
        .then((url) => {
          this.$set(this.createModel, content, url)
          this.dialogCreateLoading = false
        })
        .catch((err) => {
          console.error('oss失败' + JSON.stringify(err))
          this.dialogCreateLoading = false
          this.$message.error('上传失败，请重试')
        })
    },
  },
}
</script>
<style scoped>
.input-with-select {
  background-color: #fff;
  width: 360px;
  margin-right: 10px;
  /* .el-input-group__prepend {
    background-color: #fff;
  } */
}

.vue-pagination {
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 0px;
  padding: 0px;
}
</style>
