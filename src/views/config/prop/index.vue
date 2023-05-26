<template>
  <div class="app-container">
    <el-form :inline="true">
      <!-- <el-button size="medium" type="primary" icon="el-icon-edit-outline" @click="showCreateDialogClick()">添加道具</el-button>
      <span style="margin-right: 10px;"></span> -->
      <!-- 种类 -->
      <el-form-item>
        <el-select v-model="listQuery.type" size="small" placeholder="请选择道具类型" clearable @change="handleSearchFilter">
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <!-- 是否显示 -->
      <el-form-item>
        <el-select v-model="listQuery.isShow" size="small" placeholder="请选择显示状态" clearable @change="handleSearchFilter">
          <el-option v-for="item in showOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <!-- 是否废弃 -->
      <el-form-item>
        <el-select v-model="listQuery.isDiscard" size="small" placeholder="请选择废弃状态" clearable
          @change="handleSearchFilter">
          <el-option v-for="item in discardOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search" @click="handleSearchFilter">
          搜索
        </el-button>
        <el-button size="small" icon="el-icon-refresh" @click="reset">
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="showCreateDialogClick()">添加道具</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-s-promotion" @click="updateLiveClick()">更新到直播间</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" @click="getCarConfigListClick()">座驾配置</el-button>
      </el-form-item>
      <!-- <el-form-item>
        <el-button size="small" type="warning" @click="getCarConfigListClick()"
          >众筹礼物设置</el-button
        >
      </el-form-item> -->
      <el-form-item>
        <el-button size="small" @click="turntableClick()">转盘礼物设置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" @click="crowdFunding()">众筹礼物设置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" @click="worldBanner()">世界横幅设置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" @click="refreshList">手动刷新列表</el-button>
      </el-form-item>
    </el-form>
    <el-table v-cloading="listLoading" :data="list" size="mini">
      <!-- 展开 -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="小动画数">
              <span>{{ props.row.simgs }}</span>
            </el-form-item>
            <el-form-item label="大动画数">
              <span>{{ props.row.bimgs }}</span>
            </el-form-item>
            <el-form-item label="离子数">
              <span>{{ props.row.pimgs }}</span>
            </el-form-item>
            <el-form-item label="展示时间">
              <span>{{ props.row.duration }}</span>
            </el-form-item>
            <el-form-item label="资源地址">
              <a target="_blank" :href="props.row.resourceUrlHref" class="source-line operation_btn">
                {{ props.row.resourceUrl }}
              </a>
            </el-form-item>
            <el-form-item label="视频地址">
              <a target="_blank" :href="props.row.videoUrl" class="source-line operation_btn">
                {{ props.row.videoUrl }}
              </a>
            </el-form-item>
            <el-form-item label="Json文件地址">
              <a target="_blank" :href="props.row.videoJson" class="source-line operation_btn">
                {{ props.row.videoJson }}
              </a>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column type="index" width="60" label="序号" class-name="tb-font" />
      <el-table-column prop="sort" label="排序" width="60" class-name="tb-font" />
      <el-table-column label="封面" width="80">
        <template slot-scope="scope">
          <el-image class="vue-img-preview" :src="scope.row.cover" fit="contain" lazy>
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="gname" label="名称" min-width="100" class-name="tb-font" />
      <el-table-column prop="descript" label="描述" min-width="80" class-name="tb-font" />
      <el-table-column prop="goldCoin" label="价值" min-width="80" class-name="tb-font" sortable />
      <el-table-column prop="version" label="版本" width="80" class-name="tb-font" />
      <el-table-column label="类型" width="80">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.type | typeFilter">{{
            row.typeString
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="特效" width="80">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.playType | playFilter">{{
            row.playTypeString
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="标签" min-width="80">
        <template slot-scope="{ row }">
          <span v-if="row.tagList.length > 0">
            <el-tag v-for="tag in row.tagList" :key="tag.key" style="margin: 5px 5px 0px 0px" size="small"
              :closable="false" :disable-transitions="false">{{ tag.label }}</el-tag>
          </span>
          <span v-else>暂无</span>
        </template>
      </el-table-column>
      <el-table-column label="显示" width="60">
        <template slot-scope="{ row }">
          <el-switch v-model="row.isShow" :width="30" :active-value="1" :inactive-value="0"
            @change="changeSwitchClick(row, 'show')" />
        </template>
      </el-table-column>
      <el-table-column label="废弃" width="60">
        <template slot-scope="{ row }">
          <el-switch v-model="row.isDiscard" :width="30" :active-value="1" :inactive-value="0"
            @change="changeSwitchClick(row, 'discard')" />
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

    <!-- 新建/编辑 道具 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogCreateVisible" :close-on-click-modal="false"
      :destroy-on-close="true">
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :inline="true" :model="createModel" :rules="rules" label-position="top" label-width="80px"
          size="medium">
          <el-form-item style="width: 100%" label="道具名称" prop="gname">
            <el-input v-model="createModel.gname" style="width: 526px" clearable placeholder="请输入道具名称" maxlength="128"
              show-word-limit />
          </el-form-item>
          <el-form-item label="道具描述">
            <el-input v-model="createModel.descript" style="width: 526px" type="textarea" placeholder="请输入道具描述"
              :autosize="{ minRows: 1, maxRows: 4 }" maxlength="50" show-word-limit />
          </el-form-item>
          <el-form-item label="资源地址">
            <div style="width: 526px">
              <el-upload class="avatar-uploader" action="" :show-file-list="false" :before-upload="beforeImgUpload"
                :http-request="(params) => uploadImgRequest(params, 'resourceUrl', 'gimg')
                  ">
                <img v-if="createModel.resourceUrl" :src="createModel.resourceUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
              <div class="uploadFileDesc" v-html="getImageLibary('gimg', true)" />
              <el-input v-model="createModel.resourceUrl" type="textarea" placeholder="上传图片之后自动生成资源地址"
                :autosize="{ minRows: 3, maxRows: 4 }" />
            </div>
          </el-form-item>
          <el-form-item label="视频地址">
            <div style="width: 526px">
              <el-upload class="avatar-uploader" action="" :show-file-list="false" :before-upload="beforeImgUpload"
                :http-request="(params) => uploadImgRequest(params, 'videoUrl', 'gimg')
                  ">
                <video v-if="createModel.videoUrl" :src="createModel.videoUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
              <el-input v-model="createModel.videoUrl" type="textarea" placeholder="上传视频之后自动生成资源地址"
                :autosize="{ minRows: 3, maxRows: 4 }" />
            </div>
          </el-form-item>

          <el-form-item label="Json文件地址">
            <div style="width: 526px">
              <el-upload accept=".json,.JSON" action="" :show-file-list="false" :before-upload="beforeImgUpload" :http-request="(params) => uploadImgRequest(params, 'videoJson', 'gimg')
                ">
                <el-button type="primary">添加Json文件</el-button>
              </el-upload>
              <el-input style="margin-top: 10px" v-model="createModel.videoJson" type="textarea"
                placeholder="上传视频之后自动生成资源地址" :autosize="{ minRows: 3, maxRows: 4 }" />
            </div>
          </el-form-item>

          <el-form-item style="width: 100%" label="封面图">
            <el-upload class="avatar-uploader" action="" :show-file-list="false" :before-upload="beforeImgUpload"
              :http-request="(params) => uploadImgRequest(params, 'cover', 'gimg')
                ">
              <img v-if="createModel.cover" :src="createModel.cover" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
            <div class="uploadFileDesc" v-html="getImageLibary('gimg', true)" />
            <el-input v-model="createModel.cover" type="textarea" placeholder="上传图片之后自动生成资源地址"
              :autosize="{ minRows: 3, maxRows: 4 }" style="width: 526px" />
          </el-form-item>
          <el-form-item label="道具类型">
            <el-select v-model="createModel.type" placeholder="请选择道具类型">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="特效类型">
            <el-select v-model="createModel.playType" placeholder="请选择特效类型">
              <el-option v-for="item in playTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="小动画数" prop="simgs"><el-input v-model.number="createModel.simgs" clearable
              placeholder="请输入小动画数" maxlength="5" /></el-form-item>
          <el-form-item label="大动画数" prop="bimgs"><el-input v-model.number="createModel.bimgs" clearable
              placeholder="请输入大动画数" maxlength="5" /></el-form-item>
          <el-form-item label="离子数" prop="pimgs"><el-input v-model.number="createModel.pimgs" clearable
              placeholder="请输入离子数" maxlength="5" /></el-form-item>
          <el-form-item label="展示时间" prop="duration"><el-input v-model.number="createModel.duration" clearable
              placeholder="请输入展示时间" maxlength="10" /></el-form-item>
          <el-form-item label="道具价值" prop="goldCoin"><el-input v-model.number="createModel.goldCoin" clearable
              placeholder="请输入道具价值" maxlength="10" /></el-form-item>
          <el-form-item label="道具版本" prop="version"><el-input v-model.number="createModel.version" clearable
              placeholder="请输入道具版本" maxlength="10" /></el-form-item>
          <el-form-item label="排序" prop="sort"><el-input v-model.number="createModel.sort" clearable placeholder="请输入排序号"
              maxlength="5" /></el-form-item>

          <el-form-item label="公屏推送" prop="publicPushFlag">
            <el-select v-model="createModel.publicPushFlag" placeholder="请选择公屏推送">
              <el-option label="否" :value="0" />
              <el-option label="是" :value="1" />
            </el-select>
          </el-form-item>

          <el-form-item label="转盘礼物" prop="turntablePropsFlag">
            <el-select v-model="createModel.turntablePropsFlag" placeholder="请选择转盘礼物">
              <el-option label="否" :value="0" />
              <el-option label="是" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否热门" prop="flagHot">
            <el-select v-model="createModel.flagHot" placeholder="请选择转盘礼物">
              <el-option label="否" :value="0" />
              <el-option label="是" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="标签"><el-checkbox v-for="tag in createModel.tags" :key="tag.key" v-model="tag.value"
              :label="tag.label" /></el-form-item>
          <el-form-item label="分类">
            <!-- <el-checkbox
              v-for="tag in createModel.listGiftCateGoryD"
              :key="tag.key"
              v-model="createModel.value"
              :label="tag.label"
            /> -->
            <el-radio-group v-model="createModel.giftCategory">
              <el-radio v-for="tag in createModel.listGiftCateGoryD" :key="tag.code" :label="tag.code">{{ tag.chLan
              }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogCreateVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="handleDataClick()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 座驾配置列表 -->
    <el-dialog :title="'座驾配置'" :visible.sync="dialogCreateCarListVisible" :close-on-click-modal="false"
      :destroy-on-close="true">
      <el-button plain type="primary" size="mini" style="margin-bottom: 20px" @click="addCarConfig()">新增</el-button>
      <el-table v-cloading="carConfigLoading" :data="carConfigList" size="mini" :row-style="{ height: '40px' }">
        <el-table-column prop="day" label="添加天数">
          <template slot-scope="{ row, $index }">
            <EditCall number :text="row['day']" :active="0" :editable="callIndex === $index && callName === 'day'"
              @onChange="(val) => onEditCall('day', $index, val)" @onClick="onEditCallClick('day', $index)" />
          </template>
        </el-table-column>
        <el-table-column prop="discountRate" label="折扣比率 (0~1) 之间">
          <template slot-scope="{ row, $index }">
            <EditCall number0and1 :text="row['discountRate']" :active="0"
              :editable="callIndex === $index && callName === 'discountRate'"
              @onChange="(val) => onEditCall('discountRate', $index, val)"
              @onClick="onEditCallClick('discountRate', $index)" />
          </template>
        </el-table-column>
        <el-table-column prop="discountRate" label="操作">
          <template slot-scope="{ $index }">
            <span class="operation_btn" type="danger" size="mini" @click="handleDeleteCarConfigClick($index)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button size="medium" @click="dialogCreateCarListVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="handleAddCarConfigClick()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 转盘礼物 -->
    <el-dialog title="转盘礼物设置" :visible.sync="turntableOpen" :close-on-click-modal="false" :destroy-on-close="true">
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <div style="display: flex; align-items: center; margin-bottom: 20px">
          <div v-for="item in turntableData" :key="item.ids" style="margin: 0 10px; position: relative"
            :class="item.Check ? 'tabsDT' : 'tabsDF'" @click="tabsD(item)">
            <div style="position: absolute; top: -10px; right: 5px" class="absolute" @click.stop="deletes(item)">
              x
            </div>
            {{ item.programmeName }}
          </div>
          <el-button icon="el-icon-plus" size="small" @click="adds" />
        </div>
        <!-- 内容 -->
        <div v-for="item in turntableData" :key="item.ids">
          <el-form v-if="item.Check" ref="dataForm" :inline="true" label-position="top" label-width="120px" size="medium">
            <div v-for="items in item.props" :key="items.ids" style="display: flex; justify-content: space-between">
              <el-form-item label="表演道具名:" prop="propsName"><el-input v-model="items.propsName" clearable
                  placeholder="请输入表演道具名" /></el-form-item>
              <el-form-item label="概率:" prop="rate"><el-input v-model.number="items.rate" clearable placeholder="请输入概率"
                  maxlength="4" type="number" /></el-form-item>
              <!-- <div>
                <el-button
                  icon="el-icon-minus"
                  size="medium"
                  @click="deletes(item, items)"
                ></el-button>
              </div> -->
            </div>
            <!-- <div
              style="
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <el-button
                icon="el-icon-plus"
                size="medium"
                @click="adds(item)"
              ></el-button>
            </div> -->
            <el-form-item label="适用主播类型:">
              <el-checkbox-group v-model="item.anchorTypesD">
                <el-checkbox v-for="itemD in typeAllTypes" :key="itemD.id" :label="`${itemD.id}`">{{ itemD.typeName
                }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="turntableOpen = false">取消</el-button>
        <el-button size="medium" type="primary" @click="preservationClick()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 众筹礼物设置 -->
    <el-dialog title="众筹礼物设置" :visible.sync="turntableOpen2" :close-on-click-modal="false" :destroy-on-close="true"
      top="2vh" width="30%">
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <!-- <el-button
          @click="zcadd"
          style="margin-left: 120px; margin-bottom: 10px"
        >
          添加一行</el-button
        > -->
        <!-- 内容 -->
        <el-form ref="dataForm2" :inline="true" label-position="top" label-width="120px" size="medium">
          <el-form-item label="单次赠送金额:" prop="propsName">
            <el-input v-model="crowdFundingD.goldCoin" clearable placeholder="请输入单次赠送金额" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="turntableOpen2 = false">取消</el-button>
        <el-button size="medium" type="primary" @click="preservationClick2()">确定</el-button>
      </div>
    </el-dialog>
    <!-- 世界横幅 -->
    <el-dialog title="世界横幅配置" :visible.sync="visibleBanner" :close-on-click-modal="false" :destroy-on-close="true">
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <!-- <el-button
          @click="zcadd"
          style="margin-left: 120px; margin-bottom: 10px"
        >
          添加一行</el-button
        > -->
        <!-- 内容 -->
        <el-form ref="dataForm3" :inline="true" label-position="top" label-width="120px" size="medium"
          style="display: flex; flex-direction: column; align-items: flex-start">
          <el-form-item label="横幅开关:" prop="worldGift">
            关闭
            <el-switch v-model="visibleBannerD.worldSwitch" active-color="#13ce66" :active-value="1"
              :inactive-value="0" />
            开启
          </el-form-item>
          <el-form-item label="游戏单次赢钱:" prop="worldGift">
            大于或等于
            <el-input v-model="visibleBannerD.worldAward" style="width: 150px" clearable placeholder="请输入金币" />
            金币
          </el-form-item>
          <el-form-item label="单次打赏金额:" prop="worldGift">
            大于或等于
            <el-input v-model="visibleBannerD.worldGift" style="width: 150px" clearable placeholder="请输入金币" />
            金币
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="visibleBanner = false">取消</el-button>
        <el-button size="medium" type="primary" @click="visibleBannerOk()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPropList,
  createProp,
  updateProp,
  deleteProp,
  updateLiveProp,
  getListCarConfigList,
  updateCarConfig,
  propsList,
  propsSave,
  typeAllType,
  listGiftCateGory,
  getWorldBanner,
  worldBannerSet,
  refreshGiftCarList,
} from "@/api/config/prop";
import {
  emptyS,
  nullS,
  beforeUploadImage,
  uploadResourceFiles,
  getImageLibary,
} from "@/utils/tools";
import EditCall from "@/components/EditCall/index";

export default {
  name: "ConfigPropPage",
  components: {
    EditCall,
  },
  filters: {
    typeFilter(status) {
      const map = { 0: "", 1: "success", 2: "warning" };
      return map[status];
    },
    playFilter(status) {
      const map = { 0: "", 1: "success", 2: "warning" };
      return map[status];
    },
  },
  data() {
    var checkNumber = (rule, value, callback) => {
      if (!value && value != 0) {
        return callback(new Error("数值不能为空"));
      }
      if (!Number.isInteger(value)) {
        callback(new Error("请输入数字值"));
      } else {
        callback();
      }
    };
    return {
      list: [],
      listLoading: true,
      getImageLibary: getImageLibary,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        type: null,
        isShow: null,
        isDiscard: null,
      },
      visibleBanner: false,
      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: "",
      dialogTitleMap: {
        create: "添加道具",
        update: "编辑道具",
      },

      // 表单模型
      createModel: {
        id: 0,
        gname: null,
        descript: null,
        resourceUrl: null,
        cover: null,
        tags: [],
        sort: 0,
        simgs: 0,
        bimgs: 0,
        pimgs: 0,
        duration: 0,
        goldCoin: 0,
        version: 1,
        type: 0,
        isDiscard: 0,
        playType: 0,
        publicPushFlag: 0,
        turntablePropsFlag: 0,
        flagHot: 0,
        listGiftCateGoryD: [],
        giftCategory: null,
        videoUrl: null,
        videoJson: null
      },
      typeOptions: [
        { value: 0, label: "礼物" },
        { value: 1, label: "座驾" },
        { value: 10, label: "众筹" },
      ],
      playTypeOptions: [
        { value: 0, label: "连送礼物" },
        { value: 1, label: "全屏礼物" },
        { value: 2, label: "半屏礼物" },
      ],
      showOptions: [
        { value: 0, label: "不显示" },
        { value: 1, label: "显示" },
      ],
      discardOptions: [
        { value: 0, label: "正常" },
        { value: 1, label: "废弃" },
      ],

      // 验证规则
      rules: {
        gname: [{ required: true, message: "请输入道具名称" }],
        sort: [{ validator: checkNumber, trigger: "change" }],
        simgs: [{ validator: checkNumber, trigger: "change" }],
        bimgs: [{ validator: checkNumber, trigger: "change" }],
        pimgs: [{ validator: checkNumber, trigger: "change" }],
        duration: [{ validator: checkNumber, trigger: "change" }],
        goldCoin: [{ validator: checkNumber, trigger: "change" }],
        version: [{ validator: checkNumber, trigger: "change" }],
      },
      carConfigList: [],
      callName: null,
      callIndex: null,
      dialogCreateCarListVisible: false,
      listGiftCateGoryD: [],
      addCarModel: {
        day: "",
        discountRate: "",
      },
      carConfigLoading: false,
      carRules: {
        day: [{ required: true, message: "请输入添加天数" }],
        discountRate: [{ required: true, message: "折扣比率" }],
      },
      turntableOpen: false, // 转盘
      turntableData: [
        // 数据
        {
          programmeName: "方案一",
          anchorTypes: "",
          ids: "1",
          Check: true,
          anchorTypesD: [],
          props: [
            {
              ids: "11",
              propsName: "唱歌",
              rate: "10",
            },
            {
              ids: "111",
              propsName: "跳舞",
              rate: "10",
            },
            {
              ids: "1111",
              propsName: "篮球",
              rate: "10",
            },
            {
              ids: "11111",
              propsName: "rap",
              rate: "10",
            },
          ],
        },
        {
          programmeName: "方案二",
          anchorTypes: "",
          ids: "2",
          Check: false,
          anchorTypesD: [],
          props: [
            {
              ids: "22",
              propsName: "唱歌1",
              rate: "10",
            },
            {
              ids: "222",
              propsName: "跳舞1",
              rate: "10",
            },
            {
              ids: "2222",
              propsName: "篮球1",
              rate: "10",
            },
            {
              ids: "22222",
              propsName: "rap1",
              rate: "10",
            },
          ],
        },
      ],

      typeAllTypes: [],
      visibleBannerD: {
        worldSwitch: null,
        worldGift: null,
        worldAward: null,
      },
      turntableOpen2: false, // 众筹
      crowdFundingD: {
        giftType: 10,
        type: 10,
        goldCoin: "",
        playType: 0,
        tags: 0,
        cover: 0,
        simgs: 0,
        bimgs: 0,
        pimgs: 0,
        duration: 0,
        descript: 0,
        sort: 0,
        version: 0,
      }, // 众筹总数据
    };
  },
  created() {
    this.fetchData();
    this.listGiftCateGorys();
  },
  methods: {
    refreshList() {
      this.$confirm("是否确定清除缓存，刷新列表？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then((res) => {
          refreshGiftCarList().then((res) => {
            if (res.code === 200) {
              this.$notify({
                title: "提示",
                message: "操作成功",
                type: "success",
              });
            } else {
              this.$notify({
                title: "提示",
                message: "操作失败",
                type: "error",
              });
            }
          });
        })
        .catch(() => { });
    },
    reset() {
      this.listQuery = {
        page: 1,
        limit: 20,
      };
      this.fetchData();
    },
    sortBy(field) {
      // 根据传过来的字段进行排序
      return (x, y) => {
        return x[field] - y[field];
      };
    },
    getCarConfigListClick() {
      this.dialogCreateCarListVisible = true;
      this.carConfigLoading = true;
      getListCarConfigList({}).then((res) => {
        if (res) {
          this.carConfigLoading = false;
          if (res.data.length > 0) {
            this.carConfigList = res.data.sort(this.sortBy("day")) || [];
          }
        }
      });
    },
    // 礼物分类查询
    listGiftCateGorys() {
      listGiftCateGory().then((item) => {
        console.log("礼物反的数据", item.data);
        item.data.forEach((value, index, array) => {
          value.code = Number(value.code);
        });
        this.createModel.listGiftCateGoryD = item.data;
      });
    },

    // 转盘
    turntableClick() {
      typeAllType().then((item) => {
        console.log("主播类型", item);
        this.typeAllTypes = item.data;

        this.turntableOpen = true;
        propsList().then((item) => {
          const data = item.data;
          data.forEach((value, index, array) => {
            if (index === 0) {
              value.Check = true;
            } else {
              value.Check = false;
            }
            value.ids = index;
            value.anchorTypesD = value.anchorTypes.split(",");
            value.props.forEach((value_2, index_2) => {
              value_2.ids = index_2;
            });
            // 判断是否有四项
            if (value.props.length !== 4) {
              const lengths = value.props.length;
              for (let i = 0; i < 4 - lengths; i++) {
                value.props = [
                  ...value.props,
                  {
                    ids: lengths + i + 1,
                    propsName: "",
                    rate: "",
                  },
                ];
              }
            }
          });
          console.log("这是多少", data);
          this.turntableData = data;
        });
      });
    },
    // 众筹
    crowdFunding() {
      this.crowdFundingD = {
        giftType: 10,
        type: 10,
        goldCoin: "",
        playType: 0,
        tags: 0,
        cover: 0,
        simgs: 0,
        bimgs: 0,
        pimgs: 0,
        duration: 0,
        descript: 0,
        sort: 0,
        version: 0,
        gname: "",
      }; // 众筹总数据
      this.turntableOpen2 = true;
    },
    // 众筹 创建、编辑保存
    preservationClick2() {
      console.log("众筹数据", this.crowdFundingD);
      if (this.crowdFundingD.gid === undefined) {
        createProp({
          ...this.crowdFundingD,
          gname: this.crowdFundingD.goldCoin,
        })
          .then((item) => {
            this.$notify({
              title: "提示",
              message: "创建众筹金额成功",
              type: "success",
              duration: 1500,
            });
            this.turntableOpen2 = false;
            this.fetchData();
            this.crowdFundingD = {
              giftType: 10,
              type: 10,
              goldCoin: "",
              playType: 0,
              tags: 0,
              cover: 0,
              simgs: 0,
              bimgs: 0,
              pimgs: 0,
              duration: 0,
              descript: 0,
              sort: 0,
              version: 0,
              gname: "",
            }; // 众筹总数据
          })
          .catch((err) => {
            this.dialogCreateLoading = false;
            this.$message.error(err);
          });
      } else {
        updateProp({
          ...this.crowdFundingD,
          gname: this.crowdFundingD.goldCoin,
        })
          .then((item) => {
            this.$notify({
              title: "提示",
              message: "编辑众筹金额成功",
              type: "success",
              duration: 1500,
            });
            this.turntableOpen2 = false;
            this.fetchData();
            this.crowdFundingD = {
              giftType: 10,
              type: 10,
              goldCoin: "",
              playType: 0,
              tags: 0,
              cover: 0,
              simgs: 0,
              bimgs: 0,
              pimgs: 0,
              duration: 0,
              descript: 0,
              sort: 0,
              version: 0,
              gname: "",
            }; // 众筹总数据
          })
          .catch((err) => {
            this.dialogCreateLoading = false;
            this.$message.error(err);
          });
      }
    },
    // 世界横幅
    worldBanner() {
      getWorldBanner().then((item) => {
        this.visibleBanner = true;

        console.log("这是获取世界横幅配置", item.data);
        this.visibleBannerD = item.data;
      });
    },
    // 世界横幅确定
    visibleBannerOk() {
      let a = true;
      if (a) {
        if (
          this.visibleBannerD.worldAward == null ||
          this.visibleBannerD.worldAward == undefined ||
          this.visibleBannerD.worldAward.toString().length == 0
        ) {
          this.$message({
            message: "请输入单次赢钱金额",
            type: "warning",
          });
          a = false;
        }
      }
      if (a) {
        if (
          this.visibleBannerD.worldGift == null ||
          this.visibleBannerD.worldGift == undefined ||
          this.visibleBannerD.worldGift.toString().length == 0
        ) {
          this.$message({
            message: "请输入单次打赏金额",
            type: "warning",
          });
          a = false;
        }
      }
      worldBannerSet(this.visibleBannerD).then((item) => {
        console.log("新增", item);
        this.visibleBanner = false;
      });
    },
    // 添加
    adds() {
      let data = [];
      // data.forEach((value, index, array) => {

      // });
      data = [
        ...this.turntableData,
        {
          anchorTypes: "",
          ids: this.turntableData.length + 1,
          programmeName: `方案${this.turntableData.length + 1}`,
          Check: false,
          anchorTypesD: [],
          props: [
            {
              ids: "11",
              propsName: "",
              rate: "",
            },
            {
              ids: "111",
              propsName: "",
              rate: "",
            },
            {
              ids: "1111",
              propsName: "",
              rate: "",
            },
            {
              ids: "11111",
              propsName: "",
              rate: "",
            },
          ],
        },
      ];
      console.log("这是多少", data);
      this.turntableData = data;
    },
    // 删除
    deletes(a, b) {
      const data = [...this.turntableData];
      data.forEach((value, index, array) => {
        if (value.ids === a.ids) {
          data.splice(index, 1);
        }
        if (index === 0) {
          value.Check = true;
        } else {
          value.Check = false;
        }
      });
      this.turntableData = data;
    },
    // 保存
    preservationClick() {
      var a = true;
      const data = [...this.turntableData];
      data.forEach((value, index, array) => {
        value.anchorTypes = value.anchorTypesD.join(",");
        value.props.forEach((value_2, index_2) => {
          if (value_2.propsName.length === 0 || value_2.rate.length === 0) {
            a = false;
            this.$alert("有数据未填写完整,请补充完整", "提示", {
              confirmButtonText: "确定",
              type: "warning",
            }).then(() => {
              this.$message({
                type: "info",
                message: "已取消保存!",
              });
            });
          }
        });
      });
      // 判断是否填写完整
      if (a) {
        propsSave(data)
          .then((item) => {
            this.turntableOpen = false;
            this.$message({
              type: "success",
              message: item.message,
            });
            // console.log("这是多少", item);
          })
          .catch((err) => {
            this.$message({
              type: "error",
              message: err,
            });
          });
      }
    },
    addCarConfig() {
      const addCarModel = {
        day: "",
        discountRate: "",
      };
      this.carConfigList.push(addCarModel);
    },
    handleAddCarConfigClick() {
      for (let i = 0; i < this.carConfigList.length; i++) {
        const temp = this.carConfigList[i];
        if (temp.day == "" || temp.discountRate == "") {
          return this.$message({
            message: "请输入完整",
            type: "warning",
          });
        }
        if (temp.discountRate > 1) {
          return this.$message({
            message: "折扣比率输入范围在(0~1) 之间",
            type: "warning",
          });
        }
      }
      // 请求服务器
      updateCarConfig({ configPropBases: this.carConfigList })
        .then((res) => {
          this.$notify({
            title: "提示",
            message: "座驾配置成功",
            type: "success",
            duration: 1500,
          });
          setTimeout(() => {
            this.getCarConfigListClick();
          }, 200);
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    handleDeleteCarConfigClick(index) {
      this.$confirm("是否删除该行数据？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.carConfigList.splice(index, 1);
          this.$notify({
            title: "提示",
            message: "删除成功",
            type: "success",
            duration: 1500,
          });
        })
        .catch(() => { });
    },
    onEditCall(name, index, val) {
      this.carConfigList[index][name] = val;
      this.callName = "";
      this.callIndex = "";
      this.callType = "";
    },
    onEditCallClick(name, index, type) {
      this.callName = name;
      this.callIndex = index;
      this.callType = type;
    },
    // 重新设置表单数据
    resetCreateModel() {
      this.createModel = {
        id: 0,
        gname: null,
        descript: null,
        resourceUrl: null,
        cover: null,
        isDiscard: 0,
        tags: [],
        sort: 0,
        simgs: 0,
        bimgs: 0,
        pimgs: 0,
        duration: 0,
        goldCoin: 0,
        version: 1,
        type: 0,
        playType: 0,
        publicPushFlag: 0,
        turntablePropsFlag: 0,
        flagHot: 0,
        listGiftCateGoryD: [],
        giftCategory: null,
        videoUrl: null,
        videoJson: null
      };
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      getPropList({
        pageSize: this.listQuery.limit,
        pageNum: this.listQuery.page,
        type: this.listQuery.type,
        isShow: this.listQuery.isShow,
        isDiscard: this.listQuery.isDiscard,
      })
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            // 道具标签
            this.$set(item, "tagList", this.handePropTags(item.tags));
            //
            var playTypeStr = "";
            if (item.playType == 0) {
              playTypeStr = "连送";
            } else if (item.playType == 1) {
              playTypeStr = "全屏";
            } else if (item.playType == 2) {
              playTypeStr = "半屏";
            }
            this.$set(item, "playTypeString", playTypeStr);
            //
            var typeStr = "";
            if (item.type == 0) {
              typeStr = "礼物";
            } else if (item.type == 1) {
              typeStr = "座驾";
            }
            this.$set(item, "typeString", typeStr);
            //
            var resourceUrlHref = "";
            if (
              `${item.resourceUrl}` === "" ||
              typeof item.resourceUrl === undefined
            ) {
              resourceUrlHref = "";
            } else if (
              `${item.resourceUrl}`.indexOf("http") === -1 &&
              `${item.resourceUrl}`.indexOf("https") === -1
            ) {
              resourceUrlHref = `http://${item.resourceUrl}`;
            } else {
              resourceUrlHref = `${item.resourceUrl}`;
            }
            this.$set(item, "resourceUrlHref", resourceUrlHref);
            return item;
          });
          this.listQuery.total = res.data.total;
          this.listLoading = false;
        })
        .catch((err) => {
          this.list = null;
          this.listQuery.total = 0;
          this.listLoading = false;
          this.$message.error(err);
        });
    },
    // 切换
    tabsD(item) {
      this.turntableData.forEach((value, index, array) => {
        if (value.ids === item.ids) {
          value.Check = true;
        } else {
          value.Check = false;
        }
      });
    },
    updateLiveClick() {
      this.listLoading = false;
      this.$confirm("是否更新道具？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true;
          updateLiveProp(this.listQuery)
            .then((res) => {
              this.listLoading = false;
              this.$notify({
                title: "提示",
                message: "更新道具成功",
                type: "success",
                duration: 1500,
              });
              setTimeout((_) => {
                this.fetchData();
              }, 200);
            })
            .catch((err) => {
              this.listLoading = false;
              this.$message.error(err);
            });
        })
        .catch(() => { });
    },

    // 显示创建弹出窗
    showCreateDialogClick() {
      this.listGiftCateGorys();
      this.resetCreateModel();
      this.createModel.tags = this.handeEditPropTags(this.createModel.tags);
      this.dialogCreateVisible = true;
      this.dialogStatus = "create";
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    // 显示编辑弹出窗
    showUpdateDialogClick(row) {
      if (row.type == 10) {
        console.log(row);
        this.crowdFundingD = Object.assign({}, row);
        this.turntableOpen2 = true;
        return;
      }

      this.resetCreateModel();
      this.listGiftCateGorys();
      this.dialogCreateVisible = true;
      this.dialogStatus = "update";
      this.createModel = Object.assign({}, row, {
        listGiftCateGoryD: this.listGiftCateGoryD,
      });
      this.createModel.tags = this.handeEditPropTags(this.createModel.tags);
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    // 显示删除弹窗
    showDeleteDialogClick(row) {
      if (row.gid == null || row.gid < 0) {
        this.$message.error("参数错误");
        return;
      }
      this.$confirm("是否删除该道具？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true;
          deleteProp([row.gid])
            .then((res) => {
              this.listLoading = false;
              this.$notify({
                title: "提示",
                message: "删除道具成功",
                type: "success",
                duration: 1500,
              });
              setTimeout((_) => {
                this.fetchData();
              }, 200);
            })
            .catch((err) => {
              this.listLoading = false;
              this.$message.error(err);
            });
        })
        .catch(() => { });
    },

    // 创建/更新 数据
    handleDataClick() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel);
          this.dialogCreateLoading = true;
          // 处理参数
          var tags = formDic.tags;
          var tagStr = "";
          if (Array.isArray(tags) && tags.length > 0) {
            tags = tags.filter((item) => item.value === true);
            var tagList = tags.map((item) => item.key);
            tagStr = tagList.join(",");
          }
          const params = {
            gname: nullS(formDic.gname),
            resourceUrl: nullS(formDic.resourceUrl),
            cover: nullS(formDic.cover),
            descript: nullS(formDic.descript),
            tags: tagStr,
            bimgs: formDic.bimgs || 0,
            simgs: formDic.simgs || 0,
            pimgs: formDic.pimgs || 0,
            sort: formDic.sort || 0,
            goldCoin: formDic.goldCoin || 0,
            duration: formDic.duration || 0,
            playType: formDic.playType || 0,
            type: formDic.type || 0,
            version: formDic.version || 0,
            publicPushFlag: formDic.publicPushFlag || 0,
            turntablePropsFlag: formDic.turntablePropsFlag || 0,
            giftCategory: formDic.giftCategory || null,
            flagHot: formDic.flagHot || 0,
            videoUrl: nullS(formDic.videoUrl),
            videoJson: nullS(formDic.videoJson)
          };
          console.log("这是多少数据", params);
          // 请求服务器
          if (this.dialogStatus === "create") {
            createProp(params)
              .then((res) => {
                this.dialogCreateLoading = false;
                this.dialogCreateVisible = false;
                this.$notify({
                  title: "提示",
                  message: "创建道具成功",
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
            params["gid"] = formDic.gid || 0;
            updateProp(params)
              .then((res) => {
                this.dialogCreateLoading = false;
                this.dialogCreateVisible = false;
                this.$notify({
                  title: "提示",
                  message: "修改道具成功",
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
          }
        }
      });
    },

    // 添加众筹金额设置
    // zcadd() {
    //   let data = [
    //     ...this.crowdFundingD,
    //     { ids: this.crowdFundingD.length + 1, content: "" },
    //   ];
    //   this.crowdFundingD = data;
    // },
    // 删除
    // zcdelete(i) {
    //   let data = [...this.crowdFundingD];
    //   data.forEach((item, index) => {
    //     if (item.ids === i.ids) {
    //       data.splice(index, 1);
    //     }
    //   });
    //   this.crowdFundingD = data;
    // },
    // 滑块按钮改变
    changeSwitchClick(row, method) {
      this.listLoading = true;
      const rowDic = Object.assign({}, row);
      var params = {
        gid: rowDic.gid || 0,
      };
      if (method === "show") {
        params["isShow"] = rowDic.isShow;
      } else if (method === "discard") {
        params["isDiscard"] = rowDic.isDiscard;
      }
      // 请求网络
      updateProp(params)
        .then((res) => {
          this.listLoading = false;
          this.$notify({
            title: "提示",
            message: "修改成功",
            type: "success",
            duration: 1000,
          });
        })
        .catch((err) => {
          // 错误的情况下，修改内存属性
          if (method === "show") {
            row.isShow = !row.isShow;
          } else if (method === "discard") {
            row.isDiscard = !row.isDiscard;
          }
          this.listLoading = false;
          this.$message.error(err);
        });
    },

    // 处理道具标签
    handePropTags(tags) {
      var tagKVList = [];
      if (!emptyS(`${tags}`)) {
        const tagString = nullS(`${tags}`);
        const tagArray = tagString.split(",");
        if (tagArray instanceof Array) {
          for (const tag of tagArray) {
            if (tag > 0) {
              if (tag == 1) {
                tagKVList.push({ key: 1, label: "子爵" });
              } else if (tag == 2) {
                tagKVList.push({ key: 2, label: "伯爵" });
              } else if (tag == 3) {
                tagKVList.push({ key: 3, label: "公爵" });
              } else if (tag == 4) {
                tagKVList.push({ key: 4, label: "国王" });
              } else if (tag == 5) {
                tagKVList.push({ key: 5, label: "皇帝" });
              } else if (tag == 6) {
                tagKVList.push({ key: 6, label: "豪气" });
              } else if (tag == 7) {
                tagKVList.push({ key: 7, label: "跳蛋" });
              } else if (tag == 8) {
                tagKVList.push({ key: 8, label: "互动头像" });
              }
            }
          }
        }
      }
      return tagKVList;
    },

    // 处理编辑道具标签
    handeEditPropTags(tags) {
      var defaultTags = [
        { key: 1, value: false, label: "子爵" },
        { key: 2, value: false, label: "伯爵" },
        { key: 3, value: false, label: "公爵" },
        { key: 4, value: false, label: "国王" },
        { key: 5, value: false, label: "皇帝" },
        { key: 6, value: false, label: "豪气" },
        { key: 7, value: false, label: "跳蛋" },
        { key: 8, value: false, label: "互动头像" },
      ];
      var tagList = [];
      if (!emptyS(`${tags}`)) {
        const tagString = nullS(`${tags}`);
        const tagArray = tagString.split(",");
        if (tagArray instanceof Array) {
          tagList = tagArray.filter((tag) => tag > 0);
        }
      }
      for (var tag of defaultTags) {
        for (const t of tagList) {
          if (~~t == tag.key) {
            tag.value = true;
            break;
          }
        }
      }
      return defaultTags;
    },

    // 过滤
    handleSearchFilter() {
      this.listQuery.page = 1;
      this.fetchData();
    },

    // 每页的条数改变
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.listQuery.page = 1;
      this.fetchData();
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.fetchData();
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

    uploadImgRequest(option, content, dir) {
      console.log("-----------自定义上传方法------------");
      this.$store
        .dispatch("oss/getOSSInfos")
        .then((res) => {
          return uploadResourceFiles({
            ossParams: res,
            fileName: option.file.name,
            file: option.file,
            dir,
          });
        })
        .then((url) => {
          this.$set(this.createModel, content, url);
          this.dialogCreateLoading = false;
        })
        .catch((err) => {
          console.error("oss失败" + JSON.stringify(err));
          this.dialogCreateLoading = false;
          this.$message.error("上传失败，请重试");
        });
    },
  },
};
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

.vue-img-preview {
  width: 30px;
  height: 30px;
  margin: 0px;
  padding: 0px;
  border-radius: 3px;
}

.tabsDT {
  width: 80px;
  height: 30px;
  color: blue;
  cursor: pointer;
  border: 1px solid blue;
  text-align: center;
  line-height: 30px;
  border-radius: 5px;
}

.tabsDF {
  width: 80px;
  height: 30px;
  border: 1px solid #ccc;
  text-align: center;
  border-radius: 5px;
  line-height: 30px;
}

.tabsDF:hover {
  cursor: pointer;
  color: rgb(16, 73, 217);
  border: 1px solid rgb(16, 73, 217);
}

.source-line {
  display: block;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
