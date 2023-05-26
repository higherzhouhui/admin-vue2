<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-button size="small" type="success" icon="el-icon-plus" @click="showCreateDialogClick()">添加红包活动
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-select size="small" v-model="listQuery.status" style="width: 120px" placeholder="请选择状态">
          <el-option v-for="item in statusArr" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-tag type="info">创建时间：</el-tag>
        <el-date-picker v-model="listQuery.pickerValue" size="small" clearable type="daterange" range-separator="~"
          start-placeholder="开始时间" end-placeholder="结束时间" align="right" format="yyyy-MM-dd" value-format="timestamp" />
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-search" @click="fetchData()" />
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-refresh" @click="reloadData()" />
      </el-form-item>
    </el-form>

    <el-table v-cloading="listLoading" class="tableBox" :data="list" border size="mini"
      :default-sort="{ prop: 'sort', order: 'ascending' }">
      <el-table-column type="index" width="60" label="序号" />
      <el-table-column prop="redPacketName" label="活动标题" min-width="100" />
      <el-table-column prop="redTypeName" label="红包类型" min-width="80" />
      <el-table-column prop="userHierarchyName" label="派送层级" min-width="200" />
      <el-table-column prop="startTimeFormat" label="活动期限" min-width="135">
        <template slot-scope="{ row }">
          <p> {{ row.startTimeFormat }} </p>
          <p> {{ row.endTimeFormat }} </p>
        </template>
      </el-table-column>
      <el-table-column prop="participationName" label="参与方式" min-width="100" />
      <el-table-column prop="startTimeFormat" label="领取起始时间" min-width="100">
        <template slot-scope="{ row }">
          <p> {{ row.startFormat }} </p>
          <p> {{ row.endFormat }} </p>
        </template>
      </el-table-column>
      <el-table-column prop="moneyRange" label="开放红包金额" min-width="100" />
      <el-table-column prop="redPacketNumber" label="开放红包数量" min-width="100" />
      <el-table-column prop="winProbability" label="中奖率" />
      <el-table-column prop="conditionType" label="参与要求" width="350">
        <template slot-scope="{ row }">
          <div v-if="row.conditionType == 1">
            <div v-for="(xitem, xindex) in row.conditionContentList" :key="`list-${xindex}-conditionContentList`">
              {{ xindex + 1 }}、
              <span v-if="xitem.lotteryCondition"> {{ xitem.lotteryCondition }}, </span>
              <span v-if="xitem.depositCondition"> {{ xitem.depositCondition }}, </span>
              <span v-if="xitem.giftCondition"> {{ xitem.giftCondition }}, </span>
              <span> {{ xitem.num }} </span>
            </div>
          </div>
          <div v-else>{{ row.redNumber }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="participationName" label="随机值" width="150">
        <template slot-scope="{ row }">
          <p> 单个红包最小值{{ row.min }} </p>
          <p> 单个红包最大值{{ row.max }} </p>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="140" prop="status">
        <template slot-scope="{ row }">
          <el-switch v-model="row.status" :width="30" active-text="启用" :active-value="1" inactive-text="禁用"
            :inactive-value="0" @change="handleStatusChange(row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="{ row }">
          <el-button plain type="primary" size="mini" @click="showUpdateDialogClick(row)">修改</el-button>
          <el-button plain type="danger" size="mini" @click="showDeleteDialogClick(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.page" :page-sizes="[10, 20, 50]"
      :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />

    <!-- 新建/修改 版本  round 700px -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" width="1200px" :visible.sync="dialogCreateVisible"
      :close-on-click-modal="false" :destroy-on-close="true" top="5vh"
      @close="dialogCreateVisible = false; stepNum = 1">
      <div class="Round">
        <el-form ref="createModel" :model="createModel" :rules="rules" size="medium" label-width="130px"
          label-position="top">
          <el-form-item label="活动标题" prop="redPacketName">
            <el-input v-model="createModel.redPacketName" :disabled="showFormDisble" clearable placeholder="请输入活动标题" />
          </el-form-item>
          <el-form-item label="红包类型" prop="redType">
            <el-select v-model="createModel.redType" disabled placeholder="请选择红包类型">
              <el-option v-for="item in redType" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="派送层级" prop="userHierarchy">
            <el-select v-model="createModel.userHierarchy" :disabled="showFormDisble" multiple placeholder="请选择派送层级">
              <el-option v-for="item in familyList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="同步端口" prop="redPort">
            <el-checkbox-group v-model="createModel.redPort" :disabled="showFormDisble">
              <el-checkbox label="1">用户端</el-checkbox>
              <el-checkbox label="2">主播端</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="参与方式" prop="participation">
            <el-radio-group v-model="createModel.participation" :disabled="showFormDisble">
              <el-radio v-for="(item, index) in participationArr" :key="`${index}-participationArr`"
                :label="item.value">
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 每周 -->
          <el-form-item label="参与时间" prop="weeks" v-if="createModel.participation == '2'">
            <el-select v-model="createModel.weeks" :disabled="showFormDisble" placeholder="请选择时间">
              <el-option v-for="item in weeks" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <p v-show="createModel.participation == '2'" class="grayTip">您选的是每周
            {{ formatLable(weeks, createModel.weeks) }}</p>

          <!-- 每月 -->
          <el-form-item label="参与时间" prop="month" v-if="createModel.participation == '3'">
            <el-select v-model="createModel.month" :disabled="showFormDisble" placeholder="请选择时间">
              <el-option v-for="item in 28" :key="item" :label="`${item}号`" :value="item" />
            </el-select>
          </el-form-item>

          <p v-show="createModel.participation == '3'" class="grayTip">您选的是每月 {{ createModel.month }}号</p>

          <el-form-item label="起始时间:" prop="pickerValue" v-if="createModel.participation != '4'">
            <el-date-picker v-model="createModel.pickerValue" type="daterange" style="width: 400px;"
              :picker-options="pickerOptions" range-separator="-" :disabled="showFormDisble" start-placeholder="开始日期"
              end-placeholder="结束日期" value-format="timestamp" @change="changePickerValue" />
          </el-form-item>

          <!--自定义 日期 -->
          <el-form-item label="参与时间" prop="custom" v-if="createModel.participation == '4'">
            <el-date-picker v-model="createModel.custom" type="date" value-format="timestamp" placeholder="选择日期"
              @change="changeCustom" />
          </el-form-item>

          <p v-show="createModel.participation != '4'" class="grayTip">开始时间是选择日期的00:00:00, 结束时间是结束日期的23:59:59</p>

        </el-form>
      </div>

      <div class="singleRound" style="width: 100%; height: 100%">
        <el-form ref="createSingModelTimer" :model="createSingModel" size="medium" label-width="130px"
          label-position="top">
          <el-form-item label="每轮开启时间段">
            <el-table class="singleTable" :data="createSingModel.timeSlot" border>
              <el-table-column prop="date" label="起始时间">
                <template slot-scope="scope">
                  <el-form-item :prop="`timeSlot.${scope.$index}.value1`" :rules="[
                      { required: true, validator: ((rule, value, callback) => { validateTimer(rule, value, callback, scope.$index) }), trigger: 'change' }
                    ]">
                    <el-time-picker v-model="scope.row.value1" is-range range-separator="-" start-placeholder="开始时间"
                      end-placeholder="结束时间" :clearable="false" :editable="false" :disabled="showFormDisble"
                      value-format="timestamp" placeholder="选择时间范围" @change="changeTimer(scope.row.value1)" />
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
            <span class="tipGray">提示：红包雨持续时长在5s-60s之间</span>
          </el-form-item>
        </el-form>
        <el-form ref="createSingModelSet" :model="createSingModel" size="medium" label-width="130px"
          label-position="top">
          <el-form-item label="奖项设置:">
            <el-table class="singleTable" :data="createSingModel.setData" border>
              <el-table-column prop="moneyRange" label="开放红包金额" />
              <el-table-column prop="redPacketNumber" label="开放红包数量">
                <template slot-scope="scope">
                  <el-form-item :prop="`setData.${scope.$index}.redPacketNumber`" :rules="[
                      { required: true, message: '请输入数字' },
                    ]">
                    <el-input v-model="scope.row.redPacketNumber" style="width: 100px" type="number"
                      :disabled="showFormDisble" :min="1"
                      onkeyup="this.value=this.value.replace(/^[^1-9]+|[^0-9]/g, '')"
                      @input="countMoneyRange(scope.row, scope.$index)" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="winProbability" label="中奖率">
                <template slot-scope="scope">
                  <el-form-item :rules="[
                      { required: true, message: '请输入数字' },
                      { required: true, validator: ((rule, value, callback) => { validateWinRate(rule, value, callback) }), trigger: 'blur' }
                    ]" :prop="`setData.${scope.$index}.winProbability`">
                    <el-input v-model="scope.row.winProbability" style="width: 100px" type="number" max="100" min="0"
                      step="1" :disabled="showFormDisble" onkeyup="this.value=this.value.replace(/\D/g,'')"
                      @input="countMoneyRange(scope.row, scope.$index)">
                      <template slot="append">%</template>
                    </el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="min" label="单个红包最低值">
                <template slot-scope="scope">
                  <el-form-item :rules="[
                      { required: true, message: '请输入数字' },
                      { required: true, validator: ((rule, value, callback) => { validateMoney(rule, value, callback, scope.$index) }), trigger: 'blur' }
                    ]" :prop="`setData.${scope.$index}.min`">
                    <el-input v-model="scope.row.min" style="width: 100px" type="number" :disabled="showFormDisble"
                      :min="1" onkeyup="this.value=this.value.replace(/^[^1-9]+|[^0-9]/g, '')"
                      @input="countMoneyRange(scope.row, scope.$index)" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="max" label="单个红包最高值">
                <template slot-scope="scope">
                  <el-form-item :rules="[
                      { required: true, message: '请输入数字' },
                      { required: true, validator: ((rule, value, callback) => { validateMax(rule, value, callback, scope.$index) }), trigger: 'blur' }
                    ]" :prop="`setData.${scope.$index}.max`">
                    <el-input v-model="scope.row.max" style="width: 100px" type="number" :disabled="showFormDisble"
                      onkeyup="this.value=this.value.replace(/^[^1-9]+|[^0-9]/g, '')" :min="1"
                      @input="countMoneyRange(scope.row, scope.$index)" />
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
            <span class="tipRed">小提示：默认为0时不中奖，如果为1时证明单轮总中奖率为1%，以此类推</span>
          </el-form-item>
        </el-form>

        <el-form ref="createSingModelRequire" :model="createSingModel" size="medium" label-width="130px"
          label-position="top">
          <el-form-item label="参与要求" prop="conditionType">
            <el-radio-group v-model="createSingModel.conditionType"
              :disabled="showFormDisble || dialogStatus != 'create'">
              <el-radio label="1">条件设置</el-radio>
              <el-radio label="0">无条件设置</el-radio>
            </el-radio-group>
            <div v-if="createSingModel.conditionType == '1'">
              <el-card v-for="(item, index) in createSingModel.requireData" :key="`${index}-requireData`"
                class="box-card require_box">
                <div slot="header" class="clearfix">
                </div>
                <div v-for="(nItem, nIndex) in item.details" :key="`${nIndex}-requireData-nItem`" class="text item"
                  :class="{dottedLine: item.details.length>1 && nIndex != item.details.length - 1 }">
                  <div style="margin-bottom: 10px;">
                    <span class="redTip">*</span>
                    <el-checkbox v-model="item.depositSwitch" :disabled="nIndex != 0 || showFormDisble"
                      @change="changeOnOff(item.depositSwitch)">
                      <template>
                        存款要求：
                        <el-form-item class="inlineFormItem"
                          :prop="`requireData.${index}.details.${nIndex}.deposit.start`" :rules="[
                            { required: item.depositSwitch, validator: ((rule, value, callback) => { validateStart(rule, value, callback, item.depositSwitch, {
                              nIndex, item: item.details, objName: 'deposit'
                            }) }), trigger: 'blur' }
                          ]">
                          <el-input v-model="nItem.deposit.start" style="width: 100px" type="number"
                            on-input="this.value=this.value.replace(/\D/g,'')"
                            :disabled="!item.depositSwitch || showFormDisble" />
                        </el-form-item>
                        -
                        <el-form-item class="inlineFormItem"
                          :prop="`requireData.${index}.details.${nIndex}.deposit.end`" :rules="[
                            { required: item.depositSwitch, validator: ((rule, value, callback) => { validateEnd(rule, value, callback, item.depositSwitch, {
                              currStartNum: nItem.deposit.start, currEndNum: nItem.deposit.end
                            }) }), trigger: 'blur' }
                          ]">
                          <el-input v-model="nItem.deposit.end" style="width: 100px" type="number"
                            :disabled="!item.depositSwitch || showFormDisble"
                            onkeyup="this.value=this.value.replace(/^[^1-9]+|[^0-9]/g, '')" />
                        </el-form-item>
                      </template>
                    </el-checkbox>
                    <el-checkbox v-model="item.lotterySwitch" :disabled="nIndex != 0 || showFormDisble"
                      @change="changeOnOff(item.lotterySwitch)">
                      <template>
                        彩票有效：
                        <el-form-item class="inlineFormItem"
                          :prop="`requireData.${index}.details.${nIndex}.lottery.start`" :rules="[
                            { required: item.lotterySwitch, validator: ((rule, value, callback) => { validateStart(rule, value, callback, item.lotterySwitch, {
                              nIndex, item: item.details, objName: 'lottery'
                            }) }), trigger: 'blur' }
                          ]">
                          <el-input v-model="nItem.lottery.start" style="width: 100px" type="number"
                            :disabled="!item.lotterySwitch || showFormDisble"
                            onkeyup="this.value=this.value.replace(/\D/g,'')" />
                        </el-form-item>
                        -
                        <el-form-item class="inlineFormItem"
                          :prop="`requireData.${index}.details.${nIndex}.lottery.end`" :rules="[
                            { required: item.lotterySwitch, validator: ((rule, value, callback) => { validateEnd(rule, value, callback, item.lotterySwitch, {
                              currStartNum: nItem.lottery.start, currEndNum: nItem.lottery.end
                            }) }), trigger: 'blur' }
                          ]">
                          <el-input v-model="nItem.lottery.end" style="width: 100px" type="number"
                            :disabled="!item.lotterySwitch || showFormDisble"
                            onkeyup="this.value=this.value.replace(/^[^1-9]+|[^0-9]/g, '')" />
                        </el-form-item>
                      </template>
                    </el-checkbox>
                    <el-checkbox v-model="item.giftSwitch" :disabled="nIndex != 0 || showFormDisble"
                      @change="changeOnOff(item.giftSwitch)">
                      <template>
                        送礼物要：
                        <el-form-item class="inlineFormItem" :prop="`requireData.${index}.details.${nIndex}.gift.start`"
                          :rules="[
                            { required: item.giftSwitch, validator: ((rule, value, callback) => { validateStart(rule, value, callback, item.giftSwitch, {
                              nIndex, item: item.details, objName: 'gift'
                            }) }), trigger: 'blur' }
                          ]">
                          <el-input v-model="nItem.gift.start" style="width: 100px" type="number"
                            :disabled="!item.giftSwitch || showFormDisble"
                            onkeyup="this.value=this.value.replace(/\D/g,'')" />
                        </el-form-item>
                        -
                        <el-form-item class="inlineFormItem" :prop="`requireData.${index}.details.${nIndex}.gift.end`"
                          :rules="[
                            { required: item.giftSwitch, validator: ((rule, value, callback) => { validateEnd(rule, value, callback, item.giftSwitch, {
                              currStartNum: nItem.gift.start, currEndNum: nItem.gift.end
                            }) }), trigger: 'blur' }
                          ]">
                          <el-input v-model="nItem.gift.end" style="width: 100px" type="number"
                            :disabled="!item.giftSwitch || showFormDisble"
                            onkeyup="this.value=this.value.replace(/^[^1-9]+|[^0-9]/g, '')" />
                        </el-form-item>
                      </template>
                    </el-checkbox>

                    <p v-show="!item.giftSwitch && !item.lotterySwitch && !item.depositSwitch" class="redTip">*
                      以上条件至少选填一个，如未填写默认为无条件限制！</p>
                  </div>
                  <div>
                    <el-form-item label="可抢红包个数：" :prop="`requireData.${index}.details.${nIndex}.num`" :rules="[
                        { required: true, message: '请输入数字' },
                        { required: true, validator: ((rule, value, callback) => { validateRedNum(rule, value, callback, 0 ) }), trigger: 'blur' }
                      ]">
                      <el-input v-model="nItem.num" style="width: 150px" type="number" :disabled="showFormDisble"
                        onkeyup="this.value=this.value.replace(/^[^1-9]+|[^0-9]/g, '')" />
                    </el-form-item>
                  </div>
                  <div style="text-align: right">
                    <el-button v-show="nIndex == item.details.length - 1 && !showFormDisble" type="primary" size="mini"
                      @click="addRoundRequireSing(index)">新增</el-button>
                    <el-button v-show="nIndex != 0 && !showFormDisble" type="danger" size="mini"
                      @click="delRoundRequireSing(index, nIndex)">删除</el-button>
                  </div>
                </div>
              </el-card>

              <span class="tipGray">小提示: 每轮最多可设置5条限制条件</span>
            </div>

            <el-card v-if="createSingModel.conditionType == '0'">
              <el-form-item label="可抢红包个数：" prop="redPacketLimit" :rules="[
                  { required: true, message: '请输入数字' },
                  { required: true, validator: ((rule, value, callback) => { validateRedNum(rule, value, callback, 0) }), trigger: 'blur' }
                ]">
                <el-input v-model="createSingModel.redPacketLimit" style="width: 150px" type="number"
                  :disabled="showFormDisble" onkeyup="this.value=this.value.replace(/^[^1-9]+|[^0-9]/g, '')" />
              </el-form-item>
            </el-card>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <!--stepNum 1：总轮次配置 2预览  3发布-->
        <el-button v-show="stepNum != 1" size="medium" @click="goback()">上一步</el-button>
        <el-button v-show="stepNum != 2 && stepNum != 2" size="medium" @click="resetCreateModel()">清除本页</el-button>
        <el-button v-show="stepNum == 1" size="medium" type="primary" @click="nextClick()">预览</el-button>
        <el-button v-show="stepNum == 2" size="medium" type="primary" @click="release()">发布</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRedPacketList,
  getHierarchyList,
  RedPacketAdd,
  getRedDetailList,
  checkTime,
  redPacketUpdateStatus,
  RedPacketUpdate,
} from '@/api/config/red_packet'
import { nullS, formatUnixTime, formatSuTime, formatTime } from '@/utils/tools'
export default {
  name: 'ConfigRedPacketTypeController',
  data() {
    return {
      list: [],
      listLoading: true,
      listQuery: {
        page: 1,
        pickerValue: [],
        redType: undefined,
        status: undefined,
        limit: 20,
      },

      // 红包类型
      redType: [
        {
          label: '现金',
          value: '1',
        },
      ],

      // 状态数据
      statusArr: [
        { label: '启用', value: '1' },
        { label: '禁用', value: '0' },
      ],
      // 参与方式
      participationArr: [
        { label: '每日', value: '1' },
        { label: '每周', value: '2' },
        { label: '每月', value: '3' },
        { label: '自定义', value: '4' },
      ],
      weeks: [
        { label: '星期一', value: '1' },
        { label: '星期二', value: '2' },
        { label: '星期三', value: '3' },
        { label: '星期四', value: '4' },
        { label: '星期五', value: '5' },
        { label: '星期六', value: '6' },
        { label: '星期日', value: '7' },
      ],
      // 弹窗数值
      dialogCreateVisible: false, // 添加红包活动弹框是否开启
      dialogStatus: '',
      dialogTitleMap: {
        create: '添加活动',
        update: '修改活动',
      },
      stepNum: 1, // 创建活动步骤
      showFormDisble: false, // 预览单轮次所有可修改表单是否禁用
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        },
      },

      familyList: null,
      // 总轮次表单模型
      createModel: {
        pickerValue: [],

        redType: '1', // 红包类型
        redPacketName: undefined, // 活动标题
        userHierarchy: [], // 派送层级 展示和 参数需要分开
        participation: '1', // 参与方式
        startTime: undefined, // 开始时间
        endTime: undefined, // 结束时间
        status: 1, // 状态暂时写死 1
        redPort: [], // 同步端口
      },
      // 单轮次表单模型
      createSingModel: {
        weeks: '',
        month: '',
        custom: '',
        conditionType: '1', // 参与要求
        setData: [
          // 奖项设置数据
          {
            winProbability: '',
            min: '',
            max: '',
            redPacketNumber: '',
          },
        ],
        // 表格数据 时间段
        timeSlot: [
          {
            value1: [
              new Date(new Date().toLocaleDateString()).getTime(),
              new Date(new Date().toLocaleDateString()).getTime() + 10000,
            ],
            validateFlag: true,
          },
        ],
        // 参与要求数据 有条件
        requireData: [
          {
            lotterySwitch: false,
            depositSwitch: false,
            giftSwitch: false,
            details: [
              {
                lottery: {
                  start: '',
                  end: '',
                },
                deposit: {
                  start: '',
                  end: '',
                },
                gift: {
                  start: '',
                  end: '',
                },
                num: '',
              },
            ],
          },
        ],
        // 参与要求数据 无条件
        redPacketLimit: '',
      },

      // 时间段 对象初始值
      timeSlotObj: {
        value1: [
          new Date(new Date().toLocaleDateString()).getTime(),
          new Date(new Date().toLocaleDateString()).getTime() + 10000,
        ],
        validateFlag: true,
      },
      // 参与要求 单选 0-没有 1-彩票 2-存款 3-礼物
      // 验证规则
      rules: {
        redPacketName: [{ required: true, message: '请输入活动标题' }],
        redType: {
          required: true,
          message: '请选择红包类型',
          trigger: 'change',
        },
        userHierarchy: {
          required: true,
          message: '请选择派送层级',
          trigger: 'change',
        },
        pickerValue: {
          required: true,
          message: '请选择起始时间',
          trigger: 'change',
        },
        participation: {
          required: true,
          message: '请选择参与方式',
          trigger: 'change',
        },
        redPort: [{ required: true, message: '请选择端口', trigger: 'change' }],
        weeks: { required: true, message: '请选择时间', trigger: 'change' },
        month: { required: true, message: '请选择时间', trigger: 'change' },
        custom: { required: true, message: '请选择时间', trigger: 'change' },
      },
      isEidtGet: false, // 修改 新增轮次 控制多次点击
      isAddGet: false, // 新增弹框
      isNextGet: false, // 下一步
    }
  },
  created() {
    this.getHierarchyListDate()
    this.fetchData()
  },
  methods: {
    // 时间段校验
    validateTimer(rule, value, callback, index) {
      if (!value) {
        callback(new Error('请选择时间！'))
        return
      }

      if (
        value &&
        value.length > 1 &&
        !this.createSingModel.timeSlot[index].validateFlag
      ) {
        callback(new Error('时间已重叠！'))
        return
      }
      callback()
    },
    // 起始时间变化
    changePickerValue() {
      if (this.createModel.pickerValue) {
        const params = {
          startTime: this.createModel.pickerValue[0],
          endTime: this.createModel.pickerValue[1],
          start: formatSuTime(this.createSingModel.timeSlot[0].value1[0]),
          end: formatSuTime(this.createSingModel.timeSlot[0].value1[1]),
        }

        if (params.startTime == params.endTime) {
          params.endTime = params.endTime + (1000 * 60 * 60 * 24 - 1)
        }

        if (this.createModel.id && this.dialogStatus == 'update') {
          params.id = this.createModel.id
        }
        checkTime(params)
          .then((res) => {
            if (res.data != 'success') {
              this.$set(this.createSingModel.timeSlot[0], 'validateFlag', false)
              setTimeout(() => {
                this.$refs['createSingModelTimer'].validate((valid) => {
                  if (valid) {
                    console.log('时间校验')
                  }
                })
              }, 10)
            } else {
              this.$set(this.createSingModel.timeSlot[0], 'validateFlag', true)
              setTimeout(() => {
                this.$refs['createSingModelTimer'].validate((valid) => {
                  if (valid) {
                    console.log('时间校验')
                  }
                })
              }, 10)
            }
          })
          .catch((err) => {
            this.$set(this.createSingModel.timeSlot[0], 'validateFlag', false)
            setTimeout(() => {
              this.$refs['createSingModelTimer'].validate((valid) => {
                if (valid) {
                  console.log('时间校验')
                }
              })
            }, 10)
          })
      }
    },
    // 自定义 时间
    changeCustom() {
      if (this.createModel.custom) {
        const params = {
          startTime: this.createModel.custom,
          endTime: this.createModel.custom + (1000 * 60 * 60 * 24 - 1),
          start: formatSuTime(this.createSingModel.timeSlot[0].value1[0]),
          end: formatSuTime(this.createSingModel.timeSlot[0].value1[1]),
        }

        if (this.createModel.id && this.dialogStatus == 'update') {
          params.id = this.createModel.id
        }
        checkTime(params)
          .then((res) => {
            if (res.data != 'success') {
              this.$set(this.createSingModel.timeSlot[0], 'validateFlag', false)
              setTimeout(() => {
                this.$refs['createSingModelTimer'].validate((valid) => {
                  if (valid) {
                    console.log('时间校验')
                  }
                })
              }, 10)
            } else {
              this.$set(this.createSingModel.timeSlot[0], 'validateFlag', true)
              setTimeout(() => {
                this.$refs['createSingModelTimer'].validate((valid) => {
                  if (valid) {
                    console.log('时间校验')
                  }
                })
              }, 10)
            }
          })
          .catch((err) => {
            this.$set(this.createSingModel.timeSlot[0], 'validateFlag', false)
            setTimeout(() => {
              this.$refs['createSingModelTimer'].validate((valid) => {
                if (valid) {
                  console.log('时间校验')
                }
              })
            }, 10)
          })
      }
    },
    // 时间段 单个时间接口校验
    changeTimer(val) {
      const params = {
        startTime:
          this.createModel.participation != 4
            ? this.createModel.pickerValue[0]
            : this.createModel.custom,
        endTime:
          this.createModel.participation != 4
            ? this.createModel.pickerValue[1]
            : this.createModel.custom + (1000 * 60 * 60 * 24 - 1),
        start: formatSuTime(val[0]),
        end: formatSuTime(val[1]),
      }

      if (params.startTime == params.endTime) {
        params.endTime = params.endTime + (1000 * 60 * 60 * 24 - 1)
      }

      if (this.createModel.id && this.dialogStatus == 'update') {
        params.id = this.createModel.id
      }
      checkTime(params)
        .then((res) => {
          if (res.data != 'success') {
            this.$set(this.createSingModel.timeSlot[0], 'validateFlag', false)
            setTimeout(() => {
              this.$refs['createSingModelTimer'].validate((valid) => {
                if (valid) {
                  console.log('时间校验')
                }
              })
            }, 10)
          } else {
            this.$set(this.createSingModel.timeSlot[0], 'validateFlag', true)
            setTimeout(() => {
              this.$refs['createSingModelTimer'].validate((valid) => {
                if (valid) {
                  console.log('时间校验')
                }
              })
            }, 10)
          }
        })
        .catch((err) => {
          this.$set(this.createSingModel.timeSlot[0], 'validateFlag', false)
          setTimeout(() => {
            this.$refs['createSingModelTimer'].validate((valid) => {
              if (valid) {
                console.log('时间校验')
              }
            })
          }, 10)
        })
    },
    // 最大值校验规则
    validateMax(rule, value, callback, index) {
      if (!value) {
        callback(new Error('请输入大于0的正整数！'))
      } else if (value <= 0) {
        callback(new Error('请输入大于0的正整数！'))
      } else if (
        Number(this.createSingModel.setData[index].min) > Number(value)
      ) {
        callback(new Error('最大值不能小于最小值！'))
      } else {
        callback()
      }
    },
    // 中奖率校验规则
    validateWinRate(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入0-100的正整数！'))
      } else if (value < 0) {
        callback(new Error('请输入0-100的正整数！'))
      } else if (value > 100) {
        callback(new Error('请输入0-100的正整数！'))
      } else {
        callback()
      }
    },
    // 金额校验
    validateMoney(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入大于0的正整数！'))
      } else if (Number(value) <= 0) {
        callback(new Error('请输入大于0的正整数数字！'))
      } else {
        callback()
      }
    },
    // 参与要求 最小校验 start
    validateStart(rule, value, callback, onOff, conditionObj) {
      if (!onOff) {
        callback()
        return
      }

      if (!value) {
        callback(new Error('值必须是数字!'))
        return
      }

      //  像 012 类型数字 报错
      if (value && value.indexOf(0) == 0 && value.length > 1) {
        callback(new Error('值必须是数字！'))
        return
      }

      if (conditionObj.nIndex > 0) {
        // 判断输入金额区间
        const currStartNum =
          conditionObj.item[conditionObj.nIndex][conditionObj.objName].start
        const prevCurrEndNum =
          conditionObj.item[conditionObj.nIndex - 1][conditionObj.objName].end
        if (Number(prevCurrEndNum) != Number(currStartNum)) {
          callback(new Error('最小值要与前一个最大值相等！'))
          return
        }
      }

      callback()
    },
    // 参与要求 最大校验 end
    validateEnd(rule, value, callback, onOff, conditionObj) {
      if (!onOff) {
        callback()
        return
      }

      if (!value) {
        callback(new Error('不可低于0的数字！'))
        return
      }

      //  像 012 类型数字 报错
      if (value && value.indexOf(0) == 0 && value.length > 1) {
        callback(new Error('值必须是数字！'))
        return
      }

      if (Number(conditionObj.currEndNum) <= conditionObj.currStartNum) {
        callback(new Error('上限值不可低于下限值!'))
        return
      }

      callback()
    },
    // 参与要求 条件去掉选中 去掉校验
    changeOnOff() {
      this.$refs['createSingModelRequire'].validate((valid) => {
        if (valid) {
          console.log('createSingModelRequire true')
        } else {
          console.log('createSingModelRequire false')
        }
      })
    },
    // 参与要求 可抢红包个数校验
    validateRedNum(rule, value, callback, index) {
      if (!value) {
        callback(new Error('请输入大于0的正整数！'))
      } else if (Number(value) <= 0) {
        callback(new Error('请输入大于0的正整数数字！'))
      } else if (
        this.createSingModel.setData[index] &&
        this.createSingModel.setData[index].redPacketNumber &&
        Number(value) >
          Number(this.createSingModel.setData[index].redPacketNumber)
      ) {
        callback(new Error('不能大于开放红包数量！'))
      } else {
        callback()
      }
    },
    countMoneyRange(row, index) {
      let min = '--'
      let max = '--'
      if (row.redPacketNumber && row.min && row.winProbability != '') {
        min = (row.redPacketNumber * row.min * row.winProbability) / 100
      }

      if (row.redPacketNumber && row.max && row.winProbability != '') {
        max = (row.redPacketNumber * row.max * row.winProbability) / 100
      }
      this.$set(
        this.createSingModel.setData[index],
        'moneyRange',
        min + ' - ' + max
      )
    },
    // 参与要求 删除轮次
    delRoundrequire(index) {
      this.createSingModel.requireData.splice(index, 1)
    },
    // 参与要求 新增条件
    addRoundRequireSing(index) {
      if (this.createSingModel.requireData[index].details.length >= 5) {
        this.$notify({
          title: '提示',
          message: '每轮最多可设置5条限制条件！!',
          type: 'error',
          duration: 1000,
        })
        return
      }
      const obj = {
        lottery: {
          start: undefined,
          end: undefined,
        },
        deposit: {
          start: undefined,
          end: undefined,
        },
        gift: {
          start: undefined,
          end: undefined,
        },
        num: undefined,
      }
      this.createSingModel.requireData[index].details.push(
        JSON.parse(JSON.stringify(obj))
      )
    },
    // 参与要求 条件删除
    delRoundRequireSing(index, suIndex) {
      this.createSingModel.requireData[index].details.splice(suIndex, 1)
    },
    // 根据 stepNum 1：总轮次配置 2：单轮次配置 3预览 显示对应场景 时间段4准备发布
    showDemo() {
      switch (this.stepNum) {
        case 1:
          this.showFormDisble = false
          break
        case 2:
          this.showFormDisble = true
          break
        default:
          this.showFormDisble = false
          break
      }
    },
    // 下一步按钮
    nextClick() {
      if (this.isNextGet) return
      this.isNextGet = true
      // 需要对所有表单进行总校验 才到下一步
      const resultArr = []

      const resultCreateModel = new Promise((resolve, reject) => {
        this.$refs['createModel'].validate((valid) => {
          if (valid) {
            resolve()
          } else {
            reject()
          }
        })
      })

      resultArr.push(resultCreateModel)

      // 时间段校验 待添加
      const resultTimeSlot = new Promise((resolve, reject) => {
        this.$refs['createSingModelTimer'].validate((valid) => {
          if (valid) {
            resolve()
          } else {
            reject()
          }
        })
      })
      resultArr.push(resultTimeSlot)

      // 奖项设置校验
      const resultSingModelSet = new Promise((resolve, reject) => {
        this.$refs['createSingModelSet'].validate((valid) => {
          if (valid) {
            resolve()
          } else {
            reject()
          }
        })
      })
      resultArr.push(resultSingModelSet)

      const requireDataResult = this.createSingModel.requireData.findIndex(
        (item) => {
          return !item.depositSwitch && !item.lotterySwitch && !item.giftSwitch
        }
      )

      // 参与要求
      const resultSingModelRequire = new Promise((resolve, reject) => {
        this.$refs['createSingModelRequire'].validate((valid) => {
          if (valid) {
            resolve()
          } else {
            reject()
          }
        })
      })
      resultArr.push(resultSingModelRequire)

      Promise.all(resultArr)
        .then(() => {
          this.isNextGet = false
          if (
            this.createSingModel.conditionType == 1 &&
            requireDataResult != -1
          ) {
            this.$notify({
              title: '提示',
              message: '参与要求需要填写完善！',
              type: 'error',
              duration: 1000,
            })
            return
          }
          this.stepNum = 2
          this.showDemo()
        })
        .catch(() => {
          this.$notify({
            title: '提示',
            message: '您有资料未填写完成！',
            type: 'error',
            duration: 1000,
          })
          this.isNextGet = false
        })
    },
    // 根据传入的 时分秒格式 + 开始的时间戳 计算出组件需要的时间
    formatNeedTime(str, time) {
      // const arr = str.split(':').map(Number)
      let num = 0
      // arr.forEach((item, index) => {
      //   if (index == 0) {
      //     num += item * 60 * 60 * 1000
      //   }
      //   if (index == 1) {
      //     num += item * 60 * 1000
      //   }
      //   if (index == 2) {
      //     num += item * 1000
      //   }
      // })
      return str + time
    },
    // 上一步按钮
    goback() {
      this.stepNum = this.stepNum - 1
      this.showDemo()
    },
    // 发布
    release() {
      if (this.releaseFlag) return
      this.releaseFlag = true
      // 参数组装
      let params = JSON.parse(JSON.stringify(this.createModel))
      let arr = JSON.parse(JSON.stringify(this.createSingModel.setData))
      params.startTime = params.pickerValue[0]
      params.endTime = params.pickerValue[1] + (1000 * 60 * 60 * 24 - 1)
      params.redPort = params.redPort.join(',')
      params.userHierarchy = params.userHierarchy.join(',')
      // arr.forEach((item, index) => {
      let obj = arr[0]

      if (params.participation == 2) {
        obj.participationCondition = params.weeks
      } else if (params.participation == 3) {
        obj.participationCondition = params.month
      } else if (params.participation == 4) {
        obj.participationCondition = 0
        params.startTime = params.custom
        params.endTime = params.custom + (1000 * 60 * 60 * 24 - 1)
      } else {
        obj.participationCondition = 0
      }

      console.log(params.custom)

      // obj.participationCondition = 4  // 每周 每月 => 日期    每日 自定义 => 0
      obj.status = 1
      // 时间段 需要处理
      console.log(this.createSingModel)
      obj.start = this.formatSMSTime(this.createSingModel.timeSlot[0].value1[0])
      obj.end = this.formatSMSTime(this.createSingModel.timeSlot[0].value1[1])
      obj.startString = formatSuTime(this.createSingModel.timeSlot[0].value1[0])
      obj.endString = formatSuTime(this.createSingModel.timeSlot[0].value1[1])

      // 参与要求 有无条件
      obj.conditionType = this.createSingModel.conditionType

      let conditionObj = {}
      let conditionType = []

      if (obj.conditionType == '1') {
        let depositSwitch = this.createSingModel.requireData[0].depositSwitch
        let lotterySwitch = this.createSingModel.requireData[0].lotterySwitch
        let giftSwitch = this.createSingModel.requireData[0].giftSwitch
        if (depositSwitch) {
          conditionType.push(2)
        }
        if (lotterySwitch) {
          conditionType.push(1)
        }
        if (giftSwitch) {
          conditionType.push(3)
        }

        conditionObj.conditionType = conditionType.toString()
        conditionObj.details = this.createSingModel.requireData[0].details
        obj.condition = JSON.stringify(conditionObj)
      } else {
        obj.redNumber = this.createSingModel.redPacketLimit
      }
      params = Object.assign(params, obj)

      if (this.dialogStatus == 'create') {
        this.RedPacketAddApi(params)
      } else {
        this.RedPacketUpdateApi(params)
      }
    },
    // 新增
    RedPacketAddApi(params) {
      RedPacketAdd(params)
        .then(() => {
          this.releaseFlag = false
          this.$notify({
            title: '提示',
            message: '添加成功！',
            type: 'success',
            duration: 1000,
          })
          this.dialogCreateVisible = false
          this.fetchData()
        })
        .catch((err) => {
          this.releaseFlag = false
          this.$notify({
            title: '提示',
            message: err,
            type: 'error',
            duration: 1000,
          })
        })
    },
    // 修改接口
    RedPacketUpdateApi(params) {
      RedPacketUpdate(params)
        .then(() => {
          this.releaseFlag = false
          this.$notify({
            title: '提示',
            message: '修改成功！',
            type: 'success',
            duration: 1000,
          })
          this.dialogCreateVisible = false
          this.fetchData()
        })
        .catch((err) => {
          this.releaseFlag = false
          this.$notify({
            title: '提示',
            message: err,
            type: 'error',
            duration: 1000,
          })
        })
    },
    // 年月日时间戳 转 成时分秒时间戳
    formatSMSTime(ts) {
      let num = 0
      var ts = new Date(ts)
      var hour = ts.getHours()
      var minute = ts.getMinutes()
      var second = ts.getSeconds()

      num += hour * 60 * 60 * 1000
      num += minute * 60 * 1000
      num += second * 1000
      return num
    },
    // 重新设置表单数据
    resetCreateModel(val) {
      // 总轮次
      this.createModel = {
        pickerValue: [],
        redPacketName: undefined, // 活动标题
        redType: '1', // 红包类型
        userHierarchy: [], // 派送层级 展示和 参数需要分开
        participation: '1', // 参与方式
        startTime: undefined, // 开始时间
        endTime: undefined, // 结束时间
        status: 1, // 状态暂时写死 1
        redPort: [], // 端口
      }
      // 这里是单轮此的数据重置
      this.createSingModel = {
        redPort: [],
        conditionType: '1', // 参与要求
        setData: [
          // 奖项设置数据
          {
            moneyRange: '-- - --',
            winProbability: '',
            min: '',
            max: '',
            redPacketNumber: '',
          },
        ],
        // 表格数据 时间段
        timeSlot: [
          {
            value1: [
              new Date(new Date().toLocaleDateString()).getTime(),
              new Date(new Date().toLocaleDateString()).getTime() + 10000,
            ],
            validateFlag: true,
          },
        ],
        // 参与要求数据
        requireData: [
          {
            lotterySwitch: false,
            depositSwitch: false,
            giftSwitch: false,
            details: [
              {
                lottery: {
                  start: undefined,
                  end: undefined,
                },
                deposit: {
                  start: undefined,
                  end: undefined,
                },
                gift: {
                  start: undefined,
                  end: undefined,
                },
                num: undefined,
              },
            ],
          },
        ],
        // 参与要求数据 无条件
        requireDataNot: [{ redNumber: '' }],
      }
    },

    // 获取用户层级
    getHierarchyListDate() {
      this.familyList = null
      getHierarchyList()
        .then((res) => {
          this.familyList = (res.data.list || []).map((item) => {
            return {
              value: item.id,
              label: nullS(item.name),
            }
          })
        })
        .catch(() => {})
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      this.familyList = null
      getRedPacketList(
        this.listQuery.limit,
        this.listQuery.page,
        this.listQuery
      )
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            item.redTypeName = this.formatLable(this.redType, item.redType)
            item.startTimeFormat = formatUnixTime(item.startTime)
            item.endTimeFormat = formatUnixTime(item.endTime)
            item.startFormat = formatSuTime(item.start)
            item.endFormat = formatSuTime(item.end)
            item.participationName = this.formatLable(
              this.participationArr,
              item.participation
            )
            return item
          })
          this.listQuery.total = res.data.total
          this.listLoading = false
        })
        .catch((err) => {
          this.list = []
          this.listQuery.total = 0
          this.listLoading = false
          this.$notify({
            title: '提示',
            message: err,
            type: 'error',
            duration: 1000,
          })
        })
    },

    // id 转换 name lable value
    formatLable(arr, id) {
      const index = arr.findIndex((item) => {
        return item.value == id
      })

      if (index > -1) {
        return arr[index].label
      } else {
        return id
      }
    },
    // 显示创建弹出窗
    showCreateDialogClick() {
      // 开关初始化
      this.stepNum = 1
      this.showDemo()

      this.resetCreateModel(1)
      this.dialogCreateVisible = true
      this.dialogStatus = 'create'
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs['createModel'].clearValidate()
        })
      }, 10)
    },
    // 显示修改弹出窗
    showUpdateDialogClick(row) {
      this.stepNum = 1
      this.showDemo()
      const obj = JSON.parse(JSON.stringify(row))
      obj.userHierarchy = obj.userHierarchy.split(',').map(Number)
      this.createModel = {
        pickerValue: [obj.startTime, obj.endTime],
        id: obj.id,
        redType: String(obj.redType), // 红包类型
        redPacketName: obj.redPacketName, // 活动标题
        userHierarchy: obj.userHierarchy, // 派送层级 展示和 参数需要分开
        participation: String(obj.participation), // 参与方式
        startTime: undefined, // 开始时间
        endTime: undefined, // 结束时间
        status: 1, // 状态暂时写死 1
        redPort: obj.redPort.split(','),

        participation: String(obj.participation),
      }

      if (obj.participation == 4) {
        this.createModel.custom = obj.startTime
      } else if (obj.participation == 3) {
        this.createModel.month = obj.participationCondition
      } else if (obj.participation == 2) {
        this.createModel.weeks = String(obj.participationCondition)
      }

      // 时间
      let timeSlotObj = {
        value1: [
          this.formatNeedTime(
            obj.start,
            new Date(new Date().toLocaleDateString()).getTime()
          ),
          this.formatNeedTime(
            obj.end,
            new Date(new Date().toLocaleDateString()).getTime()
          ),
        ],
        validateFlag: true,
      }
      this.createModel.timeSlot = []
      this.createModel.timeSlot.push(timeSlotObj)

      // 奖项设置
      let setDataObj = {
        winProbability: obj.winProbability,
        min: obj.min,
        max: obj.max,
        redPacketNumber: obj.redPacketNumber,
        moneyRange: obj.moneyRange,
      }

      this.createSingModel.setData = []
      this.createSingModel.setData.push(setDataObj)

      //参与要求
      this.createSingModel.requireData = []
      if (obj.conditionType == '1') {
        let condition = obj.condition
        // 格式转不出来的时候 直接给空数组
        if (condition.conditionType) {
          condition.conditionType = condition.conditionType.split(',')
          let requireDataObj = {
            depositSwitch: condition.conditionType.indexOf('2') != -1,
            lotterySwitch: condition.conditionType.indexOf('1') != -1,
            giftSwitch: condition.conditionType.indexOf('3') != -1,
            details: condition.details,
          }

          requireDataObj.details.forEach((xitem) => {
            if (!requireDataObj.depositSwitch) {
              xitem.deposit = {
                start: '',
                end: '',
              }
            }
            if (!requireDataObj.lotterySwitch) {
              xitem.lottery = {
                start: '',
                end: '',
              }
            }
            if (!requireDataObj.giftSwitch) {
              xitem.gift = {
                start: '',
                end: '',
              }
            }
          })

          this.createSingModel.requireData.push(requireDataObj)
        }
      } else {
        this.createSingModel.redPacketLimit = obj.redNumber
      }

      this.dialogCreateVisible = true
      this.dialogStatus = 'update'
      // 需要对数据进行处理赋值
      this.$nextTick(() => {
        this.$refs['createModel'].clearValidate()
      })
    },

    // 显示删除弹窗
    showDeleteDialogClick(row) {
      if (row.id == null || row.id < 0) {
        this.$notify({
          title: '提示',
          message: '参数错误',
          type: 'error',
          duration: 1000,
        })
        return
      }
      this.$confirm('是否删除该红包雨活动？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          redPacketUpdateStatus({ redPacketId: row.id, operationType: 2 })
            .then(() => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '删除成功！',
                type: 'success',
                duration: 1500,
              })
              setTimeout(() => {
                this.fetchData()
              }, 200)
            })
            .catch((err) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: err,
                type: 'error',
                duration: 1000,
              })
            })
        })
        .catch(() => {})
    },
    // 状态修改
    handleStatusChange(row) {
      const rowDic = Object.assign({}, row)
      // 请求服务器
      this.listLoading = true
      redPacketUpdateStatus({
        redPacketId: rowDic.id,
        operationType: rowDic.status,
      })
        .then(() => {
          this.listLoading = false
          this.$notify({
            title: '提示',
            message: '修改状态成功',
            type: 'success',
            duration: 1000,
          })
          setTimeout(() => {
            this.fetchData()
          }, 20)
        })
        .catch(() => {
          row.status = !rowDic.status
          this.listLoading = false
          this.$notify({
            title: '提示',
            message: '修改状态失败!',
            type: 'error',
            duration: 1000,
          })
        })
    },
    // 刷新列表
    reloadData() {
      this.listQuery = {
        page: 1,
        total: 0,
        pickerValue: [],
        redType: undefined,
        status: undefined,
        limit: 20,
      }

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
  },
}
</script>
<style lang="scss" scoped>
.vue-pagination {
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 0px;
  padding: 0px;
}

.roundTitle {
  margin-left: 10px;
  color: #3f92e3;
  span {
    display: inline-block;
    width: 10px;
    height: 13px;
    background-color: #3f92e3;
  }

  .copyAll {
    margin-left: 10px;
  }
}

.RoundMarSing {
  margin-top: 50px;
}

.tipGray {
  color: #bdbaba;
}

.grayTip {
  color: #bdbaba;
  margin-left: 130px;
  margin-top: -5px;
  font-size: 12px;
}

.singleRound {
  .singleRoundTip {
    text-align: center;
    font-size: 20px;
    color: #e54949;
  }

  .tipRed {
    color: #e54949;
  }

  .dottedLine {
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px dashed #bdbaba;
  }

  .mar10 {
    margin-bottom: 10px;
  }
}
</style>

<style lang="scss">
.Round {
  width: 100%;
  height: 100%;

  .el-form-item .el-form-item__content {
    width: 400px;

    .el-select {
      width: 100%;
    }
  }
}

.singleRound {
  .el-input__inner {
    padding: 0 0 0 10px !important;
  }

  .singleTable .cell {
    height: 52px;
  }

  .el-form-item__error {
    right: 0;
  }

  .inlineFormItem {
    display: inline-block;
  }

  .item .el-checkbox {
    margin: 0 10px 10px 0;
  }

  .el-input-group__append {
    padding: 0 2px;
  }

  .redTip {
    margin-top: -5px;
    font-size: 8px;
    color: #e54949;
  }
}

.require_box .el-card__header {
  padding: 0;
}
</style>
