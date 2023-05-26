<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <el-form :inline="true">
      <!-- <el-form-item> -->
        <!-- <el-tag type="primary">开始时间:</el-tag> -->
        <!-- <el-date-picker
          v-model="listQuery.pickerValue"
          size="small"
          clearable
          type="datetimerange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          format="yyyy-MM-dd HH:mm"
          :default-time="['00:00:00', '23:59:59']"
          value-format="timestamp"
          @change="handleSearchFilter"
        />
      </el-form-item> -->
      <el-form-item>
        <el-input
          v-model="listQuery.uid"
          size="small"
          class="input-with-select"
          placeholder="请输入直播间ID"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="listQuery.state"
          size="small"
          placeholder="请选择状态"
          clearable
          @change="handleSearchFilter"
        >
          <el-option label="关闭" :value="0" />
          <el-option label="开启" :value="1" />
          <el-option label="过期" :value="-1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          icon="el-icon-search"
          type="primary"
          @click="handleSearchFilter"
          >搜索</el-button
        >
        <!-- 重置 -->
        <el-button size="small" icon="el-icon-refresh" @click="resets"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="showCreateDialogClick()"
        >
          添加</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      v-cloading="listLoading"
      :data="list"
      size="mini"
      fit
      highlight-current-row
      posi
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="month" label="活动月份" min-width="120" />
      <el-table-column prop="title" label="活动名称" min-width="100" />
      <el-table-column
        prop="participateSize"
        label="参与人数"
        min-width="100"
        sortable
      />

      <el-table-column prop="state" label="状态" min-width="80">
        <template slot-scope="{ row }">
          <div>
            {{ row.state == 0 ? "关闭" : row.state == 1 ? "开启" : "过期" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="anchorId" label="主播ID" min-width="100" />
      <el-table-column prop="startTime" label="开始时间" min-width="120">
        <template slot-scope="{ row }">
          {{ dateToSrting(row.startTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间" min-width="120">
        <template slot-scope="{ row }">
          {{ dateToSrting(row.endTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="120">
        <template slot-scope="{ row }">
          {{ dateToSrting(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="updateTimeString" :label="'操作'" width="150">
        <template slot-scope="{ row }">
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: flex-start;
            "
          >
            <span
              class="operation_btn"
              plain
              size="mini"
              @click="closeClick(row)"
              >{{ "编辑" }}</span
            >
            <span
              v-if="row.state == 1"
              class="operation_btn"
              plain
              type="danger"
              size="mini"
              @click="deleteClick(row, 0)"
              >{{ "禁用" }}</span
            >
            <span
              v-if="row.state == 0"
              class="operation_btn"
              plain
              type="success"
              size="mini"
              @click="deleteClick(row, 1)"
              >{{ "启用" }}</span
            >
            <span
              class="operation_btn"
              plain
              type="primary"
              size="mini"
              @click="detailsClick(row)"
              >{{ "中奖明细" }}</span
            >
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      class="vue-pagination"
      background
      :current-page="listQuery.pageNum"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]"
      :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQuery.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 新建/编辑  -->
    <el-dialog
      :title="dialogTitleMap[dialogStatus]"
      :visible.sync="dialogCreateVisible"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      top="2vh"
      width="70%"
    >
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form
          ref="dataForm"
          :inline="true"
          :model="createModel"
          label-position="top"
          label-width="100px"
          size="medium"
        >
          <div style="display: flex; justify-content: center">
            <div>
              <div
                style="
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                "
              >
                <el-form-item label="活动月份">
                  <!-- <el-input
                style="width: 526px"
                v-model="createModel.month"
                clearable
                placeholder="请输入活动月份"
                maxlength="128"
                show-word-limit
              /> -->
                  <el-date-picker
                    v-model="createModel.month"
                    style="width: 526px"
                    type="date"
                    format="yyyy-MM"
                    value-format="yyyy-MM"
                    placeholder="请输入活动月份"
                    :disabled="createModel.disabled == true ? true : false"
                  />
                </el-form-item>
                <el-form-item label="活动名称">
                  <el-input
                    v-model="createModel.title"
                    style="width: 526px"
                    placeholder="请输入活动名称"
                    maxlength="50"
                    clearable
                    :disabled="createModel.disabled == true ? true : false"
                  />
                </el-form-item>
                <el-form-item label="开始时间">
                  <el-date-picker
                    v-model="createModel.startTime"
                    style="width: 526px"
                    type="datetime"
                    placeholder="请选择开始时间"
                    default-time="00:00:00"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="timestamp"
                    :disabled="createModel.disabled == true ? true : false"
                  />
                </el-form-item>
                <el-form-item label="结束时间">
                  <el-date-picker
                    v-model="createModel.endTime"
                    style="width: 526px"
                    type="datetime"
                    placeholder="请选择结束时间"
                    default-time="00:00:00"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="timestamp"
                    :disabled="createModel.disabled == true ? true : false"
                  />
                </el-form-item>
                <el-form-item label="主播ID">
                  <el-input
                    v-model="createModel.anchorId"
                    style="width: 526px"
                    placeholder="请输入主播ID"
                    maxlength="50"
                    clearable
                    :disabled="createModel.disabled == true ? true : false"
                  />
                </el-form-item>
              </div>
              <!-- 名称加减 -->
              <el-form-item label="奖品列表">
                <div
                  style="
                    display: flex;
                    flex-direction: column;
                    /* align-items: center; */
                  "
                >
                  <div
                    v-for="(
                      item, index
                    ) in createModel.activityRoulettePrizeReqs"
                    :key="item.id"
                    style="display: flex; align-items: center"
                  >
                    <div
                      style="
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                      "
                    >
                      <div
                        style="
                          display: flex;
                          align-items: center;
                          margin-bottom: 5px;
                        "
                      >
                        <div
                          style="
                            display: flex;
                            align-items: center;
                            margin-right: 10px;
                          "
                        >
                          <div
                            style="
                              width: 40px;
                              font-weight: bold;
                              text-align: left;
                              margin-bottom: 5px;
                            "
                          >
                            类型
                          </div>
                          <el-input
                            v-model="item.typeName"
                            style="width: 160px"
                            placeholder="请输入类型"
                            maxlength="50"
                            clearable
                            :disabled="item.disabled == true ? true : false"
                          />
                        </div>
                        <div
                          style="
                            display: flex;
                            align-items: center;
                            margin-right: 10px;
                          "
                        >
                          <div
                            style="
                              width: 40px;
                              font-weight: bold;
                              text-align: left;
                              margin-bottom: 5px;
                            "
                          >
                            奖品
                          </div>
                          <el-input
                            v-model="item.rouletteName"
                            style="width: 160px"
                            placeholder="请输入奖品"
                            maxlength="50"
                            clearable
                            :disabled="item.disabled == true ? true : false"
                          />
                        </div>
                      </div>
                      <div style="display: flex; align-items: center">
                        <div
                          style="
                            display: flex;
                            align-items: center;
                            margin-right: 10px;
                          "
                        >
                          <div
                            style="
                              width: 40px;
                              font-weight: bold;
                              text-align: left;
                              margin-bottom: 5px;
                            "
                          >
                            数量
                          </div>
                          <el-input
                            v-model="item.size"
                            style="width: 160px"
                            placeholder="请输入数量"
                            maxlength="50"
                            clearable
                            :disabled="item.disabled == true ? true : false"
                          />
                        </div>
                        <div
                          style="
                            display: flex;
                            align-items: center;
                            margin-right: 10px;
                          "
                        >
                          <div
                            style="
                              width: 40px;
                              font-weight: bold;
                              text-align: left;
                              margin-bottom: 5px;
                            "
                          >
                            概率
                          </div>
                          <el-input
                            style="width: 160px"
                            placeholder="请输入概率"
                            maxlength="50"
                            :value="item.rate"
                            clearable
                            :disabled="item.disabled == true ? true : false"
                            @input="
                              (e) => {
                                inputsss(e, item);
                              }
                            "
                          >
                            <template slot="append">%</template>
                          </el-input>
                        </div>
                      </div>
                    </div>

                    <div
                      style="
                        display: flex;
                        flex-direction: column;
                        padding-top: 12px;
                      "
                    >
                      <!-- <div
                  style="
                    width: 60px;
                    font-weight: bold;
                    text-align: center;
                    margin-bottom: 5px;
                  "
                >
                  上传图片
                </div> -->
                      <el-upload
                        class="avatar-uploader"
                        action=""
                        :show-file-list="false"
                        :before-upload="beforeImgUpload"
                        :http-request="
                          (params) => uploadImgRequest(params, index)
                        "
                        :disabled="item.disabled == true ? true : false"
                      >
                        <img
                          v-if="item.roulettePic"
                          :src="item.roulettePic"
                          class="avatar2"
                        />
                        <i v-else class="el-icon-plus avatar-uploader-icon2" />
                      </el-upload>
                    </div>

                    <!-- 加 -->
                    <!-- <el-button
                      type="primary"
                      icon="el-icon-plus"
                      size="mini"
                      style="margin-left: 10px"
                      @click="adds"
                      :disabled="item.disabled == true ? true : false"
                    ></el-button> -->

                    <div
                      class="adds"
                      style="margin-left: 10px"
                      @click="(item.disabled == true) != true && adds()"
                    />

                    <!-- 减 -->
                    <!-- <el-button
                      v-if="createModel.activityRoulettePrizeReqs.length > 1"
                      type="danger"
                      size="mini"
                      icon="el-icon-minus"
                      style="margin-left: 10px"
                      @click="reduce(item)"
                      :disabled="item.disabled == true ? true : false"
                    ></el-button> -->

                    <div
                      v-if="createModel.activityRoulettePrizeReqs.length > 1"
                      class="subtract"
                      style="margin-left: 10px"
                      @click="item.disabled != true && reduce(item)"
                    />
                  </div>
                </div>
              </el-form-item>

              <div
                style="
                  display: flex;
                  align-items: flex-start;
                  flex-direction: column;
                "
              >
                <el-form-item label="抽奖条件">
                  <div style="display: flex; align-items: center">
                    <div
                      style="
                        display: flex;
                        align-items: center;
                        margin-right: 10px;
                      "
                    >
                      <el-checkbox
                        v-model="createModel.checkList"
                        :disabled="createModel.checkList2 ? true : false"
                        :label="true"
                        >累计存款达到
                      </el-checkbox>
                      <el-input
                        v-if="createModel.checkList"
                        v-model="createModel.totalEpositAmt"
                        style="width: 150px; margin-left: 10px"
                        placeholder="请输入累计存款"
                        maxlength="50"
                        clearable
                      />
                    </div>
                    <div style="display: flex; align-items: center">
                      <!--  ||
                      (createModel.totalEpositAmt !== null &&
                        createModel.totalEpositAmt !== undefined &&
                        createModel.totalEpositAmt.toString().length > 0) -->
                      <el-checkbox
                        v-model="createModel.checkList2"
                        :disabled="createModel.checkList ? true : false"
                        :label="true"
                        >月存款达到
                      </el-checkbox>
                      <el-input
                        v-if="createModel.checkList2"
                        v-model="createModel.monthEpositAmt"
                        style="width: 150px; margin-left: 10px"
                        placeholder="请输入月存款"
                        maxlength="50"
                        clearable
                      />
                    </div>
                  </div>
                </el-form-item>
                <el-form-item label="设定中奖">
                  <div
                    v-for="item_1 in createModel.winnersReqs"
                    :key="item_1.id"
                    style="
                      display: flex;
                      align-items: center;
                      margin-bottom: 10px;
                    "
                  >
                    <el-select
                      v-model="item_1.typeName"
                      placeholder="请选择类型"
                      :disabled="item_1.disabled == true ? true : false"
                    >
                      <el-option
                        v-for="(
                          item, index
                        ) in createModel.activityRoulettePrizeReqs"
                        :key="index"
                        :label="item.typeName"
                        :value="item.typeName"
                      />
                    </el-select>
                    <div
                      style="
                        display: flex;
                        align-items: center;
                        margin-left: 10px;
                      "
                    >
                      <div>中奖账号</div>
                      <el-input
                        v-model="item_1.uid"
                        :disabled="item_1.disabled == true ? true : false"
                        style="width: 150px; margin-left: 10px"
                        placeholder="请输入中奖UID"
                        maxlength="50"
                        clearable
                      />
                    </div>
                    <!-- 加 -->
                    <!-- <el-button
                      type="primary"
                      icon="el-icon-plus"
                      size="mini"
                      style="margin-left: 10px"
                      @click="adds2"
                    ></el-button> -->
                    <div
                      class="adds"
                      style="margin-left: 10px"
                      @click="adds2()"
                    />
                    <!-- 减 -->
                    <!-- <el-button
                      v-if="createModel.winnersReqs.length > 1"
                      type="danger"
                      size="mini"
                      icon="el-icon-minus"
                      style="margin-left: 10px"
                      @click="reduce2(item_1)"
                      :disabled="item_1.disabled == true ? true : false"
                    ></el-button> -->

                    <div
                      v-if="createModel.winnersReqs.length > 1"
                      class="subtract"
                      style="margin-left: 10px"
                      @click="item_1.disabled != true && reduce2(item_1)"
                    />
                  </div>
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogCreateVisible = false"
          >取消</el-button
        >
        <el-button size="medium" type="primary" @click="handleDataClick()"
          >确定</el-button
        >
      </div>
    </el-dialog>
    <!-- 中奖名单 -->
    <el-dialog
      title="中奖名单"
      :visible.sync="dialogCreateVisible2"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      top="2vh"
      width="70%"
    >
      <div v-cloading="dialogCreateLoading2" style="width: 100%; height: 100%">
        <el-form :inline="true">
          <el-form-item>
            <el-tag type="info">用户ID:</el-tag>
            <el-input
              v-model="listQuery2.uid"
              size="small"
              class="input-with-select"
              placeholder="请输入用户ID"
              clearable
              @keyup.enter.native="handleSearchFilter2"
              @clear="handleSearchFilter2"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              size="small"
              icon="el-icon-search"
              type="primary"
              @click="handleSearchFilter2"
            />
            <!-- 重置 -->
            <el-button size="small" icon="el-icon-refresh" @click="resets2" />
          </el-form-item>
        </el-form>
        <el-table
          v-cloading="listLoading2"
          :data="list2"
          size="mini"
          fit
          highlight-current-row
        >
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column prop="uid" label="用户ID" min-width="100" />
          <el-table-column prop="rouletteName" label="奖品" min-width="100" />
          <el-table-column
            prop="totalEpositAmt"
            label="累计存款金额"
            min-width="120"
            sortable
          />
          <el-table-column
            prop="monthEpositAmt"
            label="月存款"
            min-width="100"
            sortable
          />

          <el-table-column prop="status" label="状态" min-width="80">
            <template slot-scope="{ row }">
              <div>
                {{
                  row.status == 0 ? "待发放" : row.status == 1 ? "已发放" : ""
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="参与时间" min-width="100">
            <template slot-scope="{ row }">
              {{ dateToSrting(row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column :label="'操作'" width="120">
            <template slot-scope="{ row }">
              <!-- <el-button
                v-if="row.status == 0"
                plain
                type="success"
                size="mini"
                @click="deleteClick2(row)"
                >{{ "奖励发放" }}</el-button
              > -->

              <span
                v-if="row.status == 0"
                class="operation_btn"
                plain
                size="mini"
                @click="deleteClick2(row)"
                >{{ "奖励发放" }}</span
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogCreateVisible2 = false"
          >取消</el-button
        >
        <el-button size="medium" type="primary" @click="handleDataClick2()"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  rouletteList,
  saveActivityRoulette,
  updateActivityRoulette,
  updateState,
  winnersDetail,
  winnersGrant,
  rouletteDetail,
} from "@/api/roulette/activity";
import {
  emptyS,
  nullS,
  beforeUploadImage,
  uploadFile,
  formatUnixTime,
  getDateTime
} from "@/utils/tools";
// const {NOW_TIME_START, NOW_TIME_END} = getDateTime()

export default {
  name: "ActivityRouletteController",
  data() {
    return {
      list: [],
      list2: [],
      listLoading: true,
      listLoading2: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        pickerValue: [],
      },
      listQuery2: {
        id: "",
        uid: "",
      },
      // 弹窗数值
      // 弹窗数值

      dialogCreateVisible: false,
      dialogCreateLoading: false,

      dialogCreateLoading2: false,
      dialogCreateVisible2: false,

      dialogStatus: "",
      dialogTitleMap: {
        create: "新增",
        update: "编辑",
      },
      // 表单模型
      createModel: {
        id: 0,
        month: "",
        title: "",
        startTime: "",
        endTime: "",
        anchorId: "",
        activityRoulettePrizeReqs: [
          {
            id: 1,
            typeName: "",
            rouletteName: "",
            size: "",
            rate: "",
            roulettePic: "",
          },
        ],
        monthEpositAmt: null,
        totalEpositAmt: null,
        checkList: false,
        checkList2: false,
        winnersReqs: [{ id: "1", typeName: "", uid: "" }],
      },
      // 重新设置表单数据
      resetCreateModel() {
        this.createModel = {
          id: 0,
          month: "",
          title: "",
          startTime: "",
          endTime: "",
          anchorId: "",
          activityRoulettePrizeReqs: [
            {
              id: 1,
              typeName: "",
              rouletteName: "",
              size: "",
              rate: "",
              roulettePic: "",
            },
          ],
          checkList: false,
          checkList2: false,
          winnersReqs: [{ id: "1", typeName: "", uid: "" }],
        };
      },
    };
  },
  computed: {
    initTimer() {
      return this.$store.getters.timerDate
    }
  },
  created() {
    this.listQuery.pickerValue = this.initTimer
    this.fetchData();
  },
  methods: {
    dateToSrting(da) {
      return formatUnixTime(da);
      // let date = new Date(da);
      // let str = "";
      // let y = date.getFullYear();
      // let m = date.getMonth() + 1;
      // let d = date.getDate();
      // let h = date.getHours();
      // let min = date.getMinutes();
      // let s = date.getSeconds();
      // y = y < 10 ? "0" + y : y;
      // m = m < 10 ? "0" + m : m;
      // d = d < 10 ? "0" + d : d;
      // h = h < 10 ? "0" + h : h;
      // min = min < 10 ? "0" + min : min;
      // s = s < 10 ? "0" + s : s;
      // str = `${y}-${m}-${d}  ${h}:${min}:${s}`;
      // return str;
    },

    //
    // checkLists(e) {
    //   console.log(e);
    //   // this.createModel.checkList = e;
    //   // this.createModel.checkList2 = false;
    //   // console.log("这是什么1", this.createModel);
    // },
    // checkList2s(e) {
    //   console.log(e);
    //   // this.createModel.checkList = false;
    //   // this.createModel.checkList2 = e;
    //   // console.log("这是什么12", this.createModel);
    // },
    // 名称加
    adds() {
      this.createModel.activityRoulettePrizeReqs = [
        ...this.createModel.activityRoulettePrizeReqs,
        {
          id: this.createModel.activityRoulettePrizeReqs.length + 1,
          typeName: "",
          rouletteName: "",
          size: "",
          rate: "",
          roulettePic: "",
        },
      ];
    },
    // 减
    reduce(d) {
      const data = [...this.createModel.activityRoulettePrizeReqs];
      data.forEach((value, index) => {
        if (value.id == d.id) {
          data.splice(index, 1);
          // 减的时候清空选中
          this.createModel.winnersReqs.forEach((value_3) => {
            value_3.typeName = "";
          });
        }
        this.createModel.activityRoulettePrizeReqs = data;
      });
    },
    // 限制概率输入
    inputsss(e, a) {
      // v-model="item.rate"
      this.createModel.activityRoulettePrizeReqs.forEach((value) => {
        if (value.id == a.id) {
          if (e <= 100 && e >= 0) {
            value.rate = e;
          }
        }
      });
    },
    // 名称加
    adds2() {
      this.createModel.winnersReqs = [
        ...this.createModel.winnersReqs,
        {
          id: this.createModel.winnersReqs.length + 1,
          typeName: "",
          uid: "",
        },
      ];
    },
    // 减
    reduce2(d) {
      const data = [...this.createModel.winnersReqs];
      data.forEach((value, index) => {
        if (value.id == d.id) {
          data.splice(index, 1);
        }
        this.createModel.winnersReqs = data;
      });
    },
    // 重置
    resets() {
      this.reloadData();
      this.resetCreateModel();
    },
    // 重置2
    resets2() {
      this.listQuery2.uid = "";
      this.fetchData2();
    },
    // 显示创建弹出窗
    showCreateDialogClick() {
      this.resetCreateModel();
      this.dialogCreateVisible = true;
      this.dialogStatus = "create";
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 创建/更新 数据
    handleDataClick() {
      var datas = true;
      const data2 = JSON.stringify(this.createModel);
      // const createModelDemo = Object.assign({}, this.createModel);
      const createModelDemo = JSON.parse(data2);
      const {
        totalEpositAmt,
        monthEpositAmt,
        checkList,
        checkList2,
        activityRoulettePrizeReqs,
        winnersReqs,
      } = createModelDemo;
      // 奖品信息必填限制
      let rates = 0;

      if (
        createModelDemo.anchorId == undefined ||
        createModelDemo.anchorId.toString().length == 0
      ) {
        datas = false;
        this.$message({
          message: "请填写主播ID",
          type: "warning",
        });
      }

      if (datas) {
        activityRoulettePrizeReqs.forEach((value) => {
          if (
            value.typeName.length == 0 ||
            value.rouletteName.length == 0 ||
            value.size.length == 0 ||
            value.rate.length == 0 ||
            value.roulettePic.length == 0
          ) {
            datas = false;
            this.$message({
              message: "请把奖品信息填写完整",
              type: "warning",
            });
          }
          if (value.rate !== undefined) {
            rates += Number(value.rate);
          }
          if (value.rate !== undefined) {
            value.rate = Number(value.rate) / 100;
          }
        });
      }
      //  限制概率达到100
      console.log("这是概率", rates);
      if (datas) {
        if (rates < 100) {
          datas = false;
          this.$message({
            message: "奖品概率总和必须为100%",
            type: "warning",
          });
        }
        if (rates > 100) {
          datas = false;
          this.$message({
            message: "奖品概率总和不能大于100%",
            type: "warning",
          });
        }
      }

      // 选中必填信息限制
      if (datas) {
        if (
          checkList &&
          (totalEpositAmt == null || totalEpositAmt.length == 0)
        ) {
          datas = false;
          this.$message({
            message: "请把累计存款金额填写完整",
            type: "warning",
          });
          return;
        }
        if (
          checkList2 &&
          (monthEpositAmt == null || monthEpositAmt.length == 0)
        ) {
          datas = false;
          this.$message({
            message: "请把月存款金额填写完整",
            type: "warning",
          });
        }
      }
      // 设定中奖必填限制
      if (datas) {
        winnersReqs.forEach((value) => {
          if (
            value.typeName.toString().length == 0 &&
            value.uid.toString().length > 0
          ) {
            datas = false;
            this.$message({
              message: "请选择中奖类型",
              type: "warning",
            });
            return;
          }
          if (
            value.typeName.toString().length > 0 &&
            value.uid.toString().length == 0
          ) {
            datas = false;
            this.$message({
              message: "请输入中奖UID",
              type: "warning",
            });
            return;
          }
        });
      }
      // 判断是否通过
      if (datas) {
        // this.dialogCreateLoading = true;
        const params = {
          month: createModelDemo.month,
          title: createModelDemo.title,
          startTime:
            createModelDemo.startTime.toString().length > 0
              ? createModelDemo.startTime
              : null,
          endTime:
            createModelDemo.endTime.toString().length > 0
              ? createModelDemo.endTime
              : null,
          anchorId: createModelDemo.anchorId,
          activityRoulettePrizeReqs: createModelDemo.activityRoulettePrizeReqs,
          monthEpositAmt:
            createModelDemo.checkList2 == undefined ||
            createModelDemo.checkList2 == false
              ? null
              : createModelDemo.monthEpositAmt,
          totalEpositAmt:
            createModelDemo.checkList == undefined ||
            createModelDemo.checkList == false
              ? null
              : createModelDemo.totalEpositAmt,
          winnersReqs: createModelDemo.winnersReqs,
        };
        console.log("这是多少数据2", params);
        // 请求服务器  新增
        if (this.dialogStatus === "create") {
          console.log("新增", params);
          saveActivityRoulette(params)
            .then(() => {
              this.dialogCreateLoading = false;
              this.dialogCreateVisible = false;
              this.$notify({
                title: "提示",
                message: "新增成功",
                type: "success",
                duration: 1500,
              });
              setTimeout((_) => {
                this.fetchData();
              }, 200);
            })
            .catch((err) => {
              this.dialogCreateLoading = false;
              this.$message.error(err);
            });
        } else {
          console.log("编辑2", {
            ...createModelDemo,
            monthEpositAmt:
              createModelDemo.checkList2 == undefined ||
              createModelDemo.checkList2 == false
                ? null
                : createModelDemo.monthEpositAmt,
            totalEpositAmt:
              createModelDemo.checkList == undefined ||
              createModelDemo.checkList == false
                ? null
                : createModelDemo.totalEpositAmt,
          });
          updateActivityRoulette({
            ...createModelDemo,
            monthEpositAmt:
              createModelDemo.checkList2 == undefined ||
              createModelDemo.checkList2 == false
                ? null
                : createModelDemo.monthEpositAmt,
            totalEpositAmt:
              createModelDemo.checkList == undefined ||
              createModelDemo.checkList == false
                ? null
                : createModelDemo.totalEpositAmt,
          })
            .then(() => {
              this.dialogCreateLoading = false;
              this.dialogCreateVisible = false;
              this.$notify({
                title: "提示",
                message: "修改成功",
                type: "success",
                duration: 1500,
              });
              this.fetchData();
            })
            .catch((err) => {
              this.dialogCreateLoading = false;
              this.$message.error(err);
            });
        }
      }
    },
    // 确认按钮
    handleDataClick2() {
      this.dialogCreateVisible2 = false;
    },
    // 中奖明细
    detailsClick(row) {
      this.listQuery2.id = row.id;
      this.fetchData2();
      this.dialogCreateVisible2 = true;
    },
    // 上传图片
    beforeImgUpload(file) {
      console.log("-----------上传之前------------");
      const { can, msg } = beforeUploadImage(file.type, file.size);
      if (!can) {
        this.$message.error(msg);
      } else {
        this.dialogCreateLoading = true;
      }
      return can;
    },
    uploadImgRequest(option, index) {
      console.log("-----------自定义上传方法------------");
      this.$store
        .dispatch("oss/getOSSInfos")
        .then((res) => {
          return uploadFile(res, "ainfo", option.file.name, option.file);
        })
        .then((url) => {
          console.log("这是什么数据123213213", index, url);
          this.createModel.activityRoulettePrizeReqs[index].roulettePic = url;
          // this.$set(this.createModel, content, url);
          this.dialogCreateLoading = false;
        })
        .catch((err) => {
          console.error("oss失败" + JSON.stringify(err));
          this.dialogCreateLoading = false;
          this.$message.error("上传失败，请重试");
        });
    },
    // 刷新数据
    reloadData() {
      // 重置数据
      this.list = [];
      this.listLoading = true;
      this.listQuery = {
        pageSize: 20,
        pageNum: 1,
        pickerValue: this.initTimer,
      };
      setTimeout(() => {
        this.fetchData();
      }, 80);
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      // 请求服务器
      rouletteList(this.listQuery)
        .then((res) => {
          console.log("这是多少", res);
          this.list = res.data.list || [];
          this.listQuery.total = res.data.total || 0;
          this.listLoading = false;
        })
        .catch((err) => {
          this.list = null;
          this.listQuery.total = 0;
          this.listLoading = false;
          this.$message.error(err);
        });
    },
    // 获取列表数据
    fetchData2() {
      this.listLoading2 = true;
      // 请求服务器
      winnersDetail(this.listQuery2)
        .then((res) => {
          this.list2 = res.data || [];
          this.listLoading2 = false;
        })
        .catch((err) => {
          this.list2 = null;
          this.listLoading2 = false;
          this.$message.error(err);
        });
    },
    // 禁用/启用
    deleteClick(row, d) {
      this.listLoading = true;
      updateState({ ...row, state: d })
        .then(() => {
          this.listLoading = false;
          this.$notify({
            title: "提示",
            message: `${d == 0 ? "禁用成功" : "启用成功"}`,
            type: "success",
            duration: 1500,
          });
          this.fetchData();
        })
        .catch((err) => {
          this.listLoading = false;
          this.$message.error(err);
        });
    },
    // 发放
    deleteClick2(row) {
      this.listLoading2 = true;
      winnersGrant({ winnersId: row.id })
        .then(() => {
          this.listLoading2 = false;
          this.$notify({
            title: "提示",
            message: "发放成功",
            type: "success",
            duration: 1500,
          });
          this.fetchData2();
        })
        .catch((err) => {
          this.listLoading2 = false;
          this.$message.error(err);
        });
    },
    // 查询详细接口
    rouletteDetails(id) {
      rouletteDetail(id).then((item) => {
        console.log("详细数据", item.data);
        item.data.activityRoulettePrizeReqs.forEach((value_2, index_2) => {
          value_2.id = index_2;
        });
        item.data.winnersReqs.forEach((value_3, index_2) => {
          value_3.id = index_2;
        });
        const data = Object.assign({}, item.data);
        if (
          data.totalEpositAmt !== null &&
          data.totalEpositAmt !== undefined &&
          data.totalEpositAmt.toString().length > 0
        ) {
          data.checkList = true;
        }
        if (
          data.monthEpositAmt !== null &&
          data.monthEpositAmt !== undefined &&
          data.monthEpositAmt.toString().length > 0
        ) {
          data.checkList2 = true;
        }
        // 编辑没有设定中奖数据添加空项
        if (
          data.winnersReqs[0] == undefined ||
          data.winnersReqs[0].uid == undefined
        ) {
          data.winnersReqs = [{ id: "1", typeName: "", uid: "" }];
        }
        // 判断是设定中奖是否有数据，有数据只能看不能编辑
        data.winnersReqs.forEach((value) => {
          if (value.uid != undefined && value.uid.toString().length > 0) {
            value.disabled = true;
          } else {
            value.disabled = false;
          }
        });
        // 所有的概率展示乘以100
        data.activityRoulettePrizeReqs.forEach((value) => {
          value.rate = Number(value.rate) * 100;
        });
        // 判断当前时间是否大于开始时间进行限制
        if (new Date().getTime() > data.startTime) {
          console.log("大于");
          data.disabled = true;
          data.activityRoulettePrizeReqs.forEach((value) => {
            value.disabled = true;
          });
        } else {
          data.disabled = false;
          data.activityRoulettePrizeReqs.forEach((value) => {
            value.disabled = false;
          });
        }
        this.dialogCreateVisible = true;
        this.dialogStatus = "update";
        this.createModel = data;
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
      });
    },
    // 编辑
    closeClick(row) {
      this.resetCreateModel();
      console.log("这是", row);
      this.rouletteDetails(row.id);

      // this.$confirm("是否确认关闭该活动？", "提示", {
      //   confirmButtonText: "确认",
      //   cancelButtonText: "取消",
      //   type: "warning",
      //   showClose: false,
      // })
      //   .then(() => {
      //     // 请求网络
      //     this.listLoading = true;
      //     updateActivityStatus({ id: row.id, status: 0 })
      //       .then((res) => {
      //         this.listLoading = false;
      //         this.$notify({
      //           title: "提示",
      //           message: "关闭活动成功",
      //           type: "success",
      //           duration: 1500,
      //         });
      //         setTimeout((_) => {
      //           this.fetchData();
      //         }, 200);
      //       })
      //       .catch((err) => {
      //         this.listLoading = false;
      //         this.$message.error(err);
      //       });
      //   })
      //   .catch(() => {});
    },
    // 过滤
    handleSearchFilter() {
      console.log(this.listQuery);
      this.listQuery.pageNum = 1;
      this.fetchData();
    },
    // 过滤2
    handleSearchFilter2() {
      this.fetchData2();
    },

    // 每页的条数改变
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.listQuery.pageNum = 1;
      this.fetchData();
    },
    // 当前页改变
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.fetchData();
    },
  },
};
</script>
<style scoped>
.input-with-select {
  background-color: #fff;
  width: 260px;
  margin-right: 10px;

  /* .el-input-group__prepend {
    background-color: #fff;
  } */
}

.vue-img-preview {
  width: 30px;
  height: 30px;
  margin: 0px;
  padding: 0px;
  border-radius: 3px;
}

.vue-pagination {
  margin: 20px 0px;
  padding: 0px;
}
.span_primary {
  margin-right: 10px;
  color: #fc708b;
  cursor: pointer;
}
.adds {
  width: 32px;
  height: 32px;
  background: url("../../../assets/imgs/Line/plus-square.svg") no-repeat;
  background-size: 100% 100%;
}
.adds:hover {
  /* fill: #fa0; */

  filter: drop-shadow(#f90435 0 0);
}
.subtract {
  width: 32px;
  height: 32px;
  background: url("../../../assets/imgs/Line/Minus-Square.svg") no-repeat;
  background-size: 100% 100%;
}
.subtract:hover {
  /* fill: #fa0; */
  filter: drop-shadow(#f90435 0 0);
}
</style>
