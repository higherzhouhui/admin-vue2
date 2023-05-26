<template>
  <div>
    <!-- 按钮 -->
    <span v-if="isLink">
      <el-button type="text" :size="textSize" @click="showDrawerClick">
        <span v-if="showText">{{ showText }}</span>
        <span v-else>{{ uid }}</span>
      </el-button>
    </span>
    <span v-else>
      <div style="display: flex; align-items: center">
        <span v-if="showText">{{ showText }}</span>
        <!-- jumps -->
        <span v-else-if="jumps">
          <a style="color: blue" @click="clicks">{{ uid }}</a></span>
        <span v-else> {{ uid }}</span>
        <el-button
          style="margin: 0; padding: 0"
          type="text"
          @click.stop="showDrawerClick"
        >
          <i
            class="el-icon--right"
          ><svg-icon
            icon-class="eye-open"
            class-name="see-btn"
          /></i>
        </el-button>
      </div>
    </span>

    <!-- 侧边栏 -->
    <el-drawer
      direction="rtl"
      :append-to-body="true"
      :modal-append-to-body="false"
      :close-on-press-escape="true"
      :wrapper-closable="true"
      :show-close="true"
      :destroy-on-close="true"
      :title="title"
      :visible.sync="drawer"
      :size="drawerSize"
    >
      <div class="panel">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card>
              <div slot="header" class="panel-header">
                <span class="card-title">用户基础信息</span>
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-refresh"
                  @click="onRefreshClick(1)"
                >刷新</el-button>
              </div>
              <div v-cloading="baseInfoLoading" class="card-ctxs">
                <!-- <div class="card-switch">
                  <span>账户状态：</span>
                  <el-switch
                    v-model="baseInfoDatas.handle"
                    active-text="封禁"
                    :active-value="1"
                    inactive-text="正常"
                    :inactive-value="0"
                    @change="onSwitchChangeClick(1)"
                  ></el-switch>
                </div> -->
                <div class="card-column">
                  <div class="column-label">用户ID</div>
                  <div class="column-data">{{ baseInfoDatas.uid }}</div>
                </div>
                <div class="card-column">
                  <div class="column-label">用户层级</div>
                  <div class="column-data">
                    {{ baseInfoDatas.userHierarchy }}
                  </div>
                </div>
                <div class="card-column">
                  <div class="column-label">昵称</div>
                  <div class="column-data">{{ baseInfoDatas.nickName }}</div>
                </div>
                <div class="card-column">
                  <div class="column-label">用户udid</div>
                  <div class="column-data">{{ baseInfoDatas.udid }}</div>
                </div>
                <div class="card-column">
                  <div class="column-label">上级渠道</div>
                  <div class="column-data">
                    {{ baseInfoDatas.parentChannel }}
                  </div>
                </div>
                <div class="card-column">
                  <div class="column-label">上级代理ID</div>
                  <div class="column-data">
                    {{ baseInfoDatas.agentPid || "无上级代理" }}
                  </div>
                </div>
                <div class="card-column">
                  <div class="column-label">用户注册IP</div>
                  <div class="column-data">{{ baseInfoDatas.ip }}</div>
                </div>
                <div class="card-column">
                  <div class="column-label">用户实时登录IP</div>
                  <div class="column-data">{{ baseInfoDatas.timeIp }}</div>
                </div>
                <div class="card-column">
                  <div class="column-label">用户实时登录归属地</div>
                  <div class="column-data">{{ baseInfoDatas.attribution }}</div>
                </div>
                <div class="card-column">
                  <div class="column-label">注册时间</div>
                  <div class="column-data">
                    {{ baseInfoDatas.createTimeString }}
                  </div>
                </div>
                <div class="card-column">
                  <div class="column-label">最后登录时间</div>
                  <div class="column-data">
                    {{ baseInfoDatas.lastLoginTimeString }}
                  </div>
                </div>
                <div class="card-column">
                  <div class="column-label">同注册IP用户数量</div>
                  <div class="column-data">
                    {{ baseInfoDatas.sameRegistIp }}
                  </div>
                </div>
                <div class="card-column">
                  <div class="column-label">同实时登录IP用户数量</div>
                  <div class="column-data">{{ baseInfoDatas.sameLoginIp }}</div>
                </div>
                <div class="card-column">
                  <div class="column-label">同Udid用户数量</div>
                  <div class="column-data">{{ baseInfoDatas.sameUdid }}</div>
                </div>
                <div class="card-column">
                  <div class="column-label" style="line-height: 28px">
                    用户标签
                  </div>
                  <div class="column-data">
                    <div
                      :class="`${getLabelName(baseInfoDatas.userType).class}`"
                    >
                      {{ getLabelName(baseInfoDatas.userType).name }}
                    </div>
                  </div>
                </div>
                <div class="card-column">
                  <div class="column-label">备注</div>
                  <div class="column-data">{{ baseInfoDatas.typeDetail }}</div>
                </div>
                <!-- <span>用户ID{{ baseInfoDatas.uid || "" }}</span>
                <span>用户层级：{{ baseInfoDatas.userHierarchy || "" }}</span>
                <span>昵称：{{ baseInfoDatas.nickName || "" }}</span>
                <span>用户udid：{{ baseInfoDatas.udid || "" }}</span>
                <span>上级渠道：{{ baseInfoDatas.parentChannel || "" }}</span>
                <span>用户注册ip：{{ baseInfoDatas.ip || "" }}</span>
                <span>注册时间：{{ baseInfoDatas.createTimeString }}</span>
                <span>用户实时登录ip：{{ baseInfoDatas.timeIp || "" }}</span>
                <span>用户实时登录归属地：{{
                  baseInfoDatas.attribution || ""
                }}</span>
                <span>最后登录时间：{{ baseInfoDatas.lastLoginTimeString }}</span>
                <span>同注册IP用户数量：{{ baseInfoDatas.sameRegistIp }}</span>
                <span>同实时登录IP用户数量：{{ baseInfoDatas.sameLoginIp }}</span>
                <span>同Udid用户数量：{{ baseInfoDatas.sameUdid }}</span>
                <span>备注：{{ baseInfoDatas.typeDetail }}</span> -->
              </div>
            </el-card>
            <el-card>
              <div slot="header" class="panel-header">
                <span class="card-title">分享明细</span>
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-refresh"
                  @click="onRefreshClick(3)"
                >刷新</el-button>
              </div>
              <div v-cloading="shareLoading" class="card-ctxs">
                <div class="card-column">
                  <div class="column-label">邀请人数</div>
                  <div class="column-data">
                    {{ shareDatas.shareCount }}（人）
                  </div>
                </div>
                <div class="card-column">
                  <div class="column-label">过滤后邀请人数</div>
                  <div class="column-data">
                    {{ shareDatas.disShareCount }}（人）
                  </div>
                </div>
                <div class="card-column">
                  <div class="column-label">邀请总收益</div>
                  <div class="column-data">
                    {{ shareDatas.bindRebate }}（VND）
                  </div>
                </div>
                <div class="card-column">
                  <div class="column-label">充值返利总收益</div>
                  <div class="column-data">
                    {{ shareDatas.investRebate }}（VND）
                  </div>
                </div>
                <div class="card-column">
                  <div class="column-label">分享总收益</div>
                  <div class="column-data">
                    {{ shareDatas.allRebate }}（VND）
                  </div>
                </div>
                <div class="card-column">
                  <div class="column-label">分享余额</div>
                  <div class="column-data">{{ shareDatas.balance }}（VND）</div>
                </div>
                <div class="card-column">
                  <div class="column-label">分享已提现金额</div>
                  <div class="column-data">
                    {{ shareDatas.withdraw }}（VND）
                  </div>
                </div>
                <div class="card-column">
                  <div class="column-label">待审核提现金额</div>
                  <div class="column-data">{{ shareDatas.review }}（VND）</div>
                </div>
                <div class="card-column">
                  <div class="column-label">分享兑换金币</div>
                  <div class="column-data">
                    {{ shareDatas.exchange }}（VND）
                  </div>
                </div>

                <!--     <span>上级渠道：{{ shareDatas.parentChannel || '' }}</span> -->
                <!-- <span>有效邀请人数：{{ shareDatas.shareCount || 0 }}（人）</span>
                <span>过滤后邀请人数：{{
                  shareDatas.disShareCount || 0
                }}（人）</span>
                <span>邀请总收益：{{ shareDatas.bindRebate || 0 }}（VND）</span>
                <span>充值返利总收益：{{
                  shareDatas.investRebate || 0
                }}（VND）</span>
                <span>分享总收益：{{ shareDatas.allRebate || 0 }}（VND）</span>
                <span>分享余额：{{ shareDatas.balance || 0 }}（VND）</span>
                <span>分享已提现金额：{{ shareDatas.withdraw || 0 }}（VND）</span>
                <span>待审核提现金额：{{ shareDatas.review || 0 }}（VND）</span>
                <span>分享兑换金币：{{ shareDatas.exchange || 0 }}（VND）</span> -->
              </div>
            </el-card>
            <el-card>
              <div slot="header" class="panel-header">
                <span class="card-title">主播信息</span>
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-refresh"
                  @click="onRefreshClick(4)"
                >刷新</el-button>
              </div>
              <div v-cloading="anchorLoading" style="width: 100%; min-height: 100px">
                <div
                  v-if="
                    anchorDatas.authStatus == 0 || anchorDatas.authStatus == 2
                  "
                >
                  <div class="card-ctxs-anchor">
                    <div class="tag-v">
                      <div class="tag-title">主播标签</div>
                      <span v-if="anchorDatas.tagList.length > 0">
                        <el-tag
                          v-for="tag in anchorDatas.tagList"
                          :key="tag.key"
                          style="margin: 5px 5px 0px 0px"
                          size="small"
                          :closable="false"
                          :disable-transitions="false"
                        >
                          {{ tag.label }}
                        </el-tag>
                      </span>
                      <span
                        v-else
                        style="
                          color: #606266;
                          font-size: 16px;
                          font-weight: normal;
                          line-height: normal;
                        "
                      >暂无标签</span>
                    </div>
                    <div class="tag-v">
                      <div class="tag-title">主播类型</div>
                      <span>
                        <el-tag
                          size="small"
                          :type="anchorDatas.type | typeFilter"
                        >{{ anchorDatas.typeString }}</el-tag>
                      </span>
                    </div>
                    <div class="tag-v">
                      <div class="tag-title">开播状态</div>
                      <span>
                        <el-tag
                          size="small"
                          :type="anchorDatas.liveStatus | liveFilter"
                        >{{ anchorDatas.liveStatusString }}</el-tag>
                      </span>
                    </div>
                    <div class="tag-v">
                      <div class="tag-title">试播状态</div>
                      <span>
                        <el-tag
                          size="small"
                          :type="anchorDatas.status | statusFilter"
                        >{{ anchorDatas.statusString }}</el-tag>
                      </span>
                    </div>
                    <div class="tag-v">
                      <div class="tag-title">认证状态</div>
                      <span>
                        <el-tag
                          size="small"
                          :type="anchorDatas.authStatus | authFilter"
                        >{{ anchorDatas.authStatusString }}</el-tag>
                      </span>
                    </div>
                  </div>
                  <!--  <div style="margin-right: 20px;"></div> -->
                  <div class="card-ctxs">
                    <div class="column-wrapper">
                      <div class="card-column">
                        <div class="column-label">家族</div>
                        <div class="column-data">{{ anchorDatas.family }}</div>
                      </div>
                      <div class="card-column">
                        <div class="column-label">等级</div>
                        <div class="column-data">
                          {{ anchorDatas.level || 0 }}
                        </div>
                      </div>
                    </div>
                    <div class="card-column">
                      <div class="column-label" style="min-width: 25%">
                        最近开播
                      </div>
                      <div class="column-data">
                        {{ anchorDatas.lastLiveTimeString }}
                      </div>
                    </div>

                    <div class="column-wrapper">
                      <div class="card-column">
                        <div class="column-label">当前魅力值</div>
                        <div
                          :class="`column-data ${
                            anchorDatas.anchorCoinNow !=
                            anchorDatas.anchorShouldCoin
                              ? 'colorRed'
                              : ''
                          }`"
                        >
                          {{ anchorDatas.anchorCoinNow }} (金币)
                        </div>
                      </div>
                      <div class="card-column">
                        <div class="column-label">实际魅力值</div>
                        <div
                          :class="`column-data ${
                            anchorDatas.anchorCoinNow !=
                            anchorDatas.anchorShouldCoin
                              ? 'colorRed'
                              : ''
                          }`"
                        >
                          {{ anchorDatas.anchorShouldCoin }} (金币)
                        </div>
                      </div>
                    </div>
                    <div class="column-wrapper">
                      <div class="card-column">
                        <div class="column-label colorz">总增加魅力值</div>
                        <div class="column-data">
                          {{ anchorDatas.anchorAddAll || 0 }} (金币)
                        </div>
                      </div>
                      <div class="card-column">
                        <div class="column-label colorz">总消耗魅力值</div>
                        <div class="column-data">
                          {{ anchorDatas.anchorSub }} (金币)
                        </div>
                      </div>
                    </div>
                    <div class="column-wrapper">
                      <div class="card-column">
                        <div class="column-label">礼物分成</div>
                        <div
                          class="column-data colorL"
                          @click="routerClick('/anchor/live/user/gold/index')"
                        >
                          {{ anchorDatas.anchorMl }} (金币)
                        </div>
                      </div>
                      <div class="card-column">
                        <div class="column-label">福袋活动</div>
                        <div
                          class="column-data colorL"
                          @click="
                            routerClick('/center/center/BlessingBag/index', 2)
                          "
                        >
                          {{ anchorDatas.anchorLuckBag }} (金币)
                        </div>
                      </div>
                    </div>
                    <div class="column-wrapper">
                      <div class="card-column">
                        <div class="column-label">彩票分成</div>
                        <div
                          class="column-data colorL"
                          @click="routerClick('/anchor/live/user/gold/index')"
                        >
                          {{ anchorDatas.anchorLottery }} (金币)
                        </div>
                      </div>
                      <div class="card-column">
                        <div class="column-label">兑换金币</div>
                        <div
                          class="column-data colorL"
                          @click="routerClick('/anchor/live/exchange/index')"
                        >
                          {{ anchorDatas.anchorExchange }} (金币)
                        </div>
                      </div>
                    </div>
                    <div class="column-wrapper">
                      <div class="card-column">
                        <div class="column-label">付费房间分成</div>
                        <div
                          class="column-data colorL"
                          @click="routerClick('/anchor/live/user/gold/index')"
                        >
                          {{ anchorDatas.anchorFfml }} (金币)
                        </div>
                      </div>
                      <div class="card-column">
                        <div class="column-label">魅力值提现</div>
                        <div
                          class="column-data colorL"
                          @click="
                            routerClick(
                              '/finance/center/user/withdraw_bank/anchor/index'
                            )
                          "
                        >
                          {{ anchorDatas.anchorWithdraw }} (金币)
                        </div>
                      </div>
                    </div>
                    <div class="column-wrapper">
                      <div class="card-column">
                        <div class="column-label">工资补贴</div>
                        <div
                          class="column-data colorL"
                          @click="routerClick('/anchor/live/user/gold/index')"
                        >
                          {{ anchorDatas.anchorSubsidy }} (金币)
                        </div>
                      </div>
                      <div class="card-column">
                        <div class="column-label">日榜补贴</div>
                        <div class="column-data">
                          {{ anchorDatas.dayRankCoin }}
                        </div>
                      </div>
                    </div>
                    <div class="column-wrapper">
                      <div class="card-column">
                        <div class="column-label">人工添加</div>
                        <div
                          class="column-data colorL"
                          @click="
                            routerClick('/finance/center/user/assets_log/index')
                          "
                        >
                          {{ anchorDatas.anchorAdminOp }} (金币)
                        </div>
                      </div>
                      <div class="card-column">
                        <div class="column-label" />
                        <div class="column-data">
                          <!-- {{ anchorDatas.anchorCoinNow }} -->
                        </div>
                      </div>
                    </div>

                    <!-- <div class="column-wrapper">
                      <div class="card-column">
                        <div class="column-label">总魅力</div>
                        <div class="column-data">
                          {{ anchorDatas.anchorCoinAll }}
                        </div>
                      </div>
                      <div class="card-column">
                        <div class="column-label">当前魅力</div>
                        <div class="column-data">
                          {{ anchorDatas.anchorCoinNow }}
                        </div>
                      </div>
                    </div>
                    <div class="column-wrapper">
                      <div class="card-column">
                        <div class="column-label">魅力值提现</div>
                        <div class="column-data">
                          {{ anchorDatas.anchorCoinInWithdraw || "0.00" }}
                        </div>
                      </div>
                      <div class="card-column">
                        <div class="column-label">主播总收礼</div>
                        <div class="column-data">
                          {{ anchorDatas.receiveGiftCoin || "0.00" }}（金币）
                        </div>
                      </div>
                    </div>
                    <div class="column-wrapper">
                      <div class="card-column">
                        <div class="column-label">提现待审核</div>
                        <div class="column-data">
                          {{ anchorDatas.review || "0.00" }}（VND）
                        </div>
                      </div>
                      <div class="card-column">
                        <div class="column-label">已提现</div>
                        <div class="column-data">
                          {{ anchorDatas.withdraw || "0.00" }}（VND）
                        </div>
                      </div>
                    </div> -->

                    <!-- <div class="card-column">
                      <div class="column-label" style="min-width: 25%">
                        最近开播
                      </div>
                      <div class="column-data">
                        {{ anchorDatas.lastLiveTimeString }}
                      </div>
                    </div> -->

                    <!-- <span>最后一次开播时间{{ anchorDatas.lastLiveTimeString }}</span>
                    <span>主播家族：{{ anchorDatas.family || "" }}</span>
                    <span>主播等级：{{ anchorDatas.level || 0 }}</span>
                    <span>主播总魅力：{{ anchorDatas.anchorCoinAll || 0 }}</span>
                    <span>主播当前魅力：{{ anchorDatas.anchorCoinNow || 0 }}</span>
                    <span>魅力值提现：{{
                      anchorDatas.anchorCoinInWithdraw || 0
                    }}</span>
                    <span>魅力兑换金币数量：{{ anchorDatas.exchange || 0 }}</span>
                    <span>主播总收礼：{{
                      anchorDatas.receiveGiftCoin || 0
                    }}（金币）</span>
                    <span>提现待审核金额：{{
                      anchorDatas.review || 0
                    }}（VND）</span>
                    <span>已提现金额：{{ anchorDatas.withdraw || 0 }}（VND）</span> -->
                  </div>
                </div>
                <span
                  v-else-if="anchorDatas.authStatus == 1"
                  class="noAnchor"
                >{{ "当前是待审核的主播" }}</span>
                <span v-else class="noAnchor">{{ "当前是普通用户" }}</span>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card>
              <div slot="header" class="panel-header">
                <span class="card-title">资产明细</span>
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-refresh"
                  @click="onRefreshClick(2)"
                >刷新</el-button>
              </div>
              <div v-cloading="assetsLoading" class="card-ctxs">
                <!-- <div class="card-switch">
                  <span>提现状态：</span>
                  <el-switch
                    v-model="assetsDatas.handle"
                    active-text="封禁"
                    :active-value="1"
                    inactive-text="正常"
                    :inactive-value="2"
                    @change="onSwitchChangeClick(2)"
                  ></el-switch>
                </div> -->
                <div class="card-column">
                  <div class="column-label">用户等级</div>
                  <div class="column-data">{{ assetsDatas.level || 0 }}</div>
                </div>
                <div class="card-column">
                  <div class="column-label">金币余额</div>
                  <div class="column-data">
                    {{ assetsDatas.balance || "0.00" }}（金币）
                  </div>
                </div>
                <div class="card-column" style="color: red; font-weight: bold">
                  <div class="column-label">充值金额</div>
                  <div class="column-data">
                    {{ assetsDatas.payAmount }}（VND）
                  </div>
                </div>
                <div class="card-column">
                  <div class="column-label">最后一笔充值金额</div>
                  <div class="column-data">
                    {{ assetsDatas.lastPayAmount || "0.00" }}（VND）
                  </div>
                </div>
                <div class="card-column">
                  <div class="column-label">通道充值金额</div>
                  <div class="column-data">
                    {{ assetsDatas.order || "0.00" }}（VND）
                  </div>
                </div>
                <div class="card-column">
                  <div class="column-label">银行卡充值金额</div>
                  <div class="column-data">
                    {{ assetsDatas.bankCustom || "0.00" }}（VND）
                  </div>
                </div>
                <div class="card-column">
                  <div class="column-label">银行卡充值优惠金额</div>
                  <div class="column-data">
                    {{ assetsDatas.bankAmount }}（VND）
                  </div>
                </div>
                <div class="card-column">
                  <div class="column-label">USDT充值金额</div>
                  <div class="column-data">
                    {{ assetsDatas.usdtAmount || "0.00" }}（VND）
                  </div>
                </div>
                <div class="card-column">
                  <div class="column-label">USDT充值优惠金额</div>
                  <div class="column-data">
                    {{ assetsDatas.usdtRateMoney || "0.00" }}（VND）
                  </div>
                </div>
                <div class="card-column">
                  <div class="column-label">代理充值金额</div>
                  <div class="column-data">
                    {{
                      assetsDatas.agentCustom == "0"
                        ? "0.00"
                        : assetsDatas.agentCustom
                    }}（VND）
                  </div>
                </div>
                <div class="card-column">
                  <div class="column-label">人工总存款</div>
                  <div class="column-data">
                    {{
                      assetsDatas.backstageAmount || "0.00"
                    }}（金币）(人工彩金:{{ assetsDatas.manualDeposit || 0 }})
                  </div>
                </div>
                <div class="card-column">
                  <div class="column-label">人工提款</div>
                  <div class="column-data">
                    {{ assetsDatas.backstageAmountDown || "0.00" }}（金币）
                  </div>
                </div>
                <div class="card-column">
                  <div class="column-label">活动赠送</div>
                  <div class="column-data">
                    {{ assetsDatas.activityAmount || "0.00" }}（金币）
                  </div>
                </div>
                <div class="card-column">
                  <div class="column-label">彩票补偿加币</div>
                  <div class="column-data">
                    {{ assetsDatas.reimburseAmount || "0.00" }}（金币）
                  </div>
                </div>
                <div class="card-column" style="color: red; font-weight: bold">
                  <div class="column-label">用户已提现金额</div>
                  <div class="column-data">
                    {{ assetsDatas.withdraw || "0.00" }}（VND）
                  </div>
                </div>
                <div class="card-column">
                  <div class="column-label">用户待审核提现金额</div>
                  <div class="column-data">
                    {{ assetsDatas.review || "0.00" }}（VND）
                  </div>
                </div>
                <div class="card-column">
                  <div class="column-label">送礼总消费</div>
                  <div class="column-data">
                    {{ assetsDatas.sendAmount || "0.00" }}（金币）
                  </div>
                </div>
                <div class="card-column">
                  <div class="column-label">付费房间总消费</div>
                  <div class="column-data">
                    {{ assetsDatas.payLiveAmount || "0.00" }}（金币）
                  </div>
                </div>
                <div class="card-column">
                  <div class="column-label">购买座驾总消费</div>
                  <div class="column-data">
                    {{ assetsDatas.buyCarAmount || "0.00" }}（金币）
                  </div>
                </div>
                <div class="card-column" style="color: red; font-weight: bold">
                  <div class="column-label">游戏流水</div>
                  <div class="column-data">
                    {{
                      Math.abs(assetsDatas.gameAmount || 0) || "0.00"
                    }}（金币）
                  </div>
                </div>
                <div class="card-column">
                  <div class="column-label">历史总流水</div>
                  <div class="column-data">
                    {{ assetsDatas.allNowStatement }}（金币）
                  </div>
                </div>
                <div class="card-column">
                  <div class="column-label">当前游戏流水</div>
                  <div class="column-data">
                    {{ assetsDatas.allNow || "0.00" }}（金币）
                  </div>
                </div>
                <div class="card-column">
                  <div class="column-label">需要的流水</div>
                  <div class="column-data">
                    {{ assetsDatas.needStatement || "0.00" }}（金币）
                  </div>
                </div>
                <div class="card-column">
                  <div class="column-label">最后充值流水</div>
                  <div class="column-data">
                    {{ assetsDatas.lastPayStatement || "0.00" }}（金币）
                  </div>
                </div>

                <!-- <span>用户等级：{{ assetsDatas.level || 0 }}</span>
                <span>金币余额：{{ assetsDatas.balance || 0 }}（金币）</span>
                <span
                  style="color: red"
                ><b>充值金额：{{ assetsDatas.payAmount || 0 }}（VND）</b></span>
                <span>最后一笔充值金额：{{
                  assetsDatas.lastPayAmount || 0
                }}（金币）</span> -->
                <!--  <span>最后充值时间：{{ assetsDatas.lastPayTimeString }}</span> -->
                <!-- <span>通道充值金额：{{ assetsDatas.order || 0 }}（VND）</span>
                <span>银行卡充值金额：{{
                  assetsDatas.bankCustom || 0
                }}（VND）</span>
                <span>银行卡充值优惠金额：{{
                  assetsDatas.bankAmount || 0
                }}（VND）</span>
                <span>USDT充值金额：{{ assetsDatas.usdtAmount || 0 }}（VND）</span>
                <span>USDT充值优惠金额：{{
                  assetsDatas.usdtRateMoney || 0
                }}（VND）</span>
                <span>代理充值金额：{{ assetsDatas.agentCustom || 0 }}（VND）</span>
                <span>人工总存款：{{ assetsDatas.backstageAmount || 0 }}（金币）
                  (人工彩金:{{ assetsDatas.manualDeposit || 0 }})
                </span>
                <span>人工提款：{{
                  assetsDatas.backstageAmountDown || 0
                }}（金币）</span>
                <span>活动赠送：{{ assetsDatas.activityAmount || 0 }}（金币）</span>
                <span>彩票补偿加币：{{
                  assetsDatas.reimburseAmount || 0
                }}（金币）</span>
                <span
                  style="color: red"
                ><b>用户已提现金额：{{ assetsDatas.withdraw || 0 }}（VND）</b></span>
                <span>用户待审核提现金额：{{
                  assetsDatas.review || 0
                }}（VND）</span>
                <span>送礼总消费：{{ assetsDatas.sendAmount || 0 }}（金币）</span>
                <span>付费房间总消费：{{
                  assetsDatas.payLiveAmount || 0
                }}（金币）</span>
                <span
                  style="color: red"
                ><b>游戏流水：{{ assetsDatas.gameAmount || 0 }}（金币）</b></span> -->
                <!--     <span>至尊盈亏：{{ assetsDatas.gameConsume || 0 }}（金币）</span> -->
                <!-- <span>开元流水：{{ assetsDatas.kygameConsume || 0 }}</span>
                <span>BG流水：{{ assetsDatas.bggameConsume || 0 }}</span>
                <span>CMD流水：{{ assetsDatas.cmdgameConsume || 0 }}</span>
                <span>沙巴流水：{{
                  assetsDatas.sabaGameConsume || 0
                }}</span>
                <span>BTI流水：{{ assetsDatas.btiGameConsume || 0 }}</span>
                <span>AWC流水：{{ assetsDatas.awcGameConsume || 0 }}</span>
                <span>OB流水：{{ assetsDatas.obGameConsume || 0 }}</span>
                <span>XG流水：{{ assetsDatas.xgGameConsume || 0 }}</span> -->
                <!--                <span>PG流水：{{ assetsDatas.pgGameConsume || 0 }}（金币）</span>-->
                <!--  <span>富翁流水：{{ assetsDatas.fwgameConsume || 0 }}（金币）</span>
                <span>AG流水：{{ assetsDatas.agConsume || 0 }}（金币）</span> -->
                <!-- <span>彩票流水：{{ assetsDatas.cpConsume || 0 }}</span>
                <span>FB流水：{{ assetsDatas.fbGameConsume || 0 }}</span>
                <span>购买座驾总消费：{{
                  assetsDatas.buyCarAmount || 0
                }}</span>
                <span>历史总流水：{{ assetsDatas.allNowStatement || 0 }} </span>
                <span>当前游戏流水：{{ assetsDatas.allNow || 0 }} </span>
                <span>需要的流水：{{ assetsDatas.needStatement || 0 }} </span>
                <span>最后充值流水：{{ assetsDatas.lastPayStatement || 0 }}</span> -->
              </div>
              <el-table
                v-cloading="assetsLoading"
                :data="detailMoneyTabsource"
                show-summary
                size="mini"
              >
                <el-table-column label="平台名称" prop="name" />
                <el-table-column label="流水（金币）" prop="liushui" />
                <el-table-column label="盈亏（金币）" prop="yingkui">
                  <template slot-scope="{ row }">
                    <span
                      :style="{
                        color:
                          row.yingkui > 0
                            ? 'red'
                            : row.yingkui < 0
                              ? 'green'
                              : '',
                      }"
                    >
                      {{ row.yingkui.toFixed(2) }}
                    </span>
                  </template>
                </el-table-column>
              </el-table>
              <div class="list">
                <!-- <div v-if="JSON.stringify(assetsDatas.typeProfitLoss)!='{}'">
                  <b style="title">类型盈亏（金币）</b>
                  <span>体育盈亏：{{ assetsDatas.platformProfitLoss? assetsDatas.typeProfitLoss.sport || 0:0 }}</span>
                  <span>真人盈亏：{{ assetsDatas.platformProfitLoss? assetsDatas.typeProfitLoss.live || 0 :0}}</span>
                  <span>电子盈亏：{{  assetsDatas.platformProfitLoss? assetsDatas.typeProfitLoss.slot || 0 :0}}</span>
                  <span>虚拟体育盈亏：{{ assetsDatas.platformProfitLoss? assetsDatas.typeProfitLoss.virtual ||0 :0 }}</span>
                </div> -->
                <!-- <div>
                  <b style="title">类型流水（金币）</b>
                  <span>体育流水：{{ assetsDatas.sportGameConsume || 0 }}</span>
                  <span>真人流水：{{ assetsDatas.liveGameConsume || 0 }}</span>
                  <span>电子流水：{{ assetsDatas.slotGameConsume || 0 }}</span>
                  <span>虚拟体育流水：{{ assetsDatas.virtualGameConsume || 0 }}</span>
                </div> -->
                <!-- <div v-if="JSON.stringify(assetsDatas.platformProfitLoss)!='{}'">
                  <b style="title">平台盈亏（金币）</b>
                  <span>AG盈亏：{{ assetsDatas.platformProfitLoss ? assetsDatas.platformProfitLoss.AG || 0 :0 }}</span>
                  <span>AWC盈亏：{{ assetsDatas.platformProfitLoss ? assetsDatas.platformProfitLoss.AWC || 0:0 }}</span>
                  <span>BG盈亏：{{ assetsDatas.platformProfitLoss ? assetsDatas.platformProfitLoss.BG || 0:0 }}</span>
                  <span>PP盈亏：{{ assetsDatas.platformProfitLoss ? assetsDatas.platformProfitLoss.PP || 0 :0 }}</span>
                  <span>BTI盈亏：{{ assetsDatas.platformProfitLoss ? assetsDatas.platformProfitLoss.BTI || 0 :0 }}</span>
                  <span>CMD盈亏：{{ assetsDatas.platformProfitLoss ? assetsDatas.platformProfitLoss.CMD || 0 :0 }}</span>
                  <span>CP盈亏：{{ assetsDatas.platformProfitLoss ? assetsDatas.platformProfitLoss.CP || 0 :0 }}</span>
                  <span>FB盈亏：{{ assetsDatas.platformProfitLoss ? assetsDatas.platformProfitLoss.FB || 0 :0 }}</span>
                  <span>KY盈亏：{{ assetsDatas.platformProfitLoss ? assetsDatas.platformProfitLoss.KY || 0 :0 }}</span>
                  <span>OB盈亏：{{ assetsDatas.platformProfitLoss ? assetsDatas.platformProfitLoss.OB || 0 :0 }}</span>
                  <span>PG盈亏：{{ assetsDatas.platformProfitLoss ? assetsDatas.platformProfitLoss.PG || 0 :0 }}</span>
                  <span>PP盈亏：{{ assetsDatas.platformProfitLoss ? assetsDatas.platformProfitLoss.PP || 0 :0 }}</span>
                  <span>RSG盈亏：{{ assetsDatas.platformProfitLoss ? assetsDatas.platformProfitLoss.RSG || 0 :0 }}</span>
                  <span>SABA盈亏：{{ assetsDatas.platformProfitLoss ? assetsDatas.platformProfitLoss.SABA || 0 :0 }}</span>
                  <span>XG盈亏：{{ assetsDatas.platformProfitLoss ? assetsDatas.platformProfitLoss.XG || 0 :0 }}</span>
                  <span>WW盈亏：{{ assetsDatas.platformProfitLoss ? assetsDatas.platformProfitLoss.WW || 0 :0 }}</span>
                  <span>CF盈亏：{{ assetsDatas.platformProfitLoss ? assetsDatas.platformProfitLoss.CF || 0 :0 }}</span>
                </div> -->
                <!-- <div>
                  <b style="title">平台流水（金币）</b>
                  <span>FB流水：{{ assetsDatas.fbGameConsume || 0 }}</span>
                  <span>RWB流水：{{ assetsDatas.rwbGameConsume || 0 }}</span>
                  <span>EVO流水：{{ assetsDatas.evoGameConsume || 0 }}</span>
                  <span>PP流水：{{ assetsDatas.ppGameConsume || 0 }}</span>
                  <span>QT流水：{{ assetsDatas.qtGameConsume || 0 }}</span>
                </div> -->
              </div>
            </el-card>
          </el-col>
        </el-row>
        <!--  <div style="height: 20px;width: 100%;"></div>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-card>
              <div slot="header" class="panel-header">
                <span class="card-title">主播信息</span>
              </div>
              <div v-cloading="anchorLoading" style="width: 100%;height: 100%;">
                <div v-if="anchorDatas.authStatus == 0 || anchorDatas.authStatus == 2" style="display: flex;">
                  <div class="card-ctxs-anchor">
                    <div class="tag-v">
                      <div class="tag-title">主播标签：</div>
                      <span v-if="anchorDatas.tagList.length > 0">
                        <el-tag style="margin: 5px 5px 0px 0px;" size="small" v-for="tag in anchorDatas.tagList" :key="tag.key" :closable="false" :disable-transitions="false">
                          {{ tag.label }}
                        </el-tag>
                      </span>
                      <span v-else style="color: #606266; font-size: 16px; font-weight: normal; line-height: normal;">暂无标签</span>
                    </div>
                    <div class="tag-v">
                      <div class="tag-title">主播类型：</div>
                      <el-tag size="small" :type="anchorDatas.type | typeFilter">{{ anchorDatas.typeString }}</el-tag>
                    </div>
                    <div class="tag-v">
                      <div class="tag-title">主播开播状态：</div>
                      <el-tag size="small" :type="anchorDatas.liveStatus | liveFilter">{{ anchorDatas.liveStatusString }}</el-tag>
                    </div>
                    <div class="tag-v">
                      <div class="tag-title">主播试播状态：</div>
                      <el-tag size="small" :type="anchorDatas.status | statusFilter">{{ anchorDatas.statusString }}</el-tag>
                    </div>
                    <div class="tag-v">
                      <div class="tag-title">主播认证状态：</div>
                      <el-tag size="small" :type="anchorDatas.authStatus | authFilter">{{ anchorDatas.authStatusString }}</el-tag>
                    </div>
                  </div>
                  <div style="margin-right: 20px;"></div>
                  <div class="card-ctxs" style="width: 50%;">
                    <span>最后一次开播时间：{{ anchorDatas.lastLiveTimeString }}</span>
                    <span>主播家族：{{ anchorDatas.family || '' }}</span>
                    <span>主播等级：{{ anchorDatas.level || 0 }}</span>
                    <span>主播总魅力：{{ anchorDatas.anchorCoinAll || 0 }}</span>
                    <span>主播当前魅力：{{ anchorDatas.anchorCoinNow || 0 }}</span>
                    <span>魅力兑换金币数量：{{ anchorDatas.exchange || 0 }}</span>
                    <span>主播总收礼：{{ anchorDatas.receiveGiftCoin || 0 }}（金币）</span>
                    <span>提现待审核金额：{{ anchorDatas.review || 0 }}（VND）</span>
                    <span>已提现金额：{{ anchorDatas.withdraw || 0 }}（VND）</span>
                  </div>
                </div>
                <span v-else-if="anchorDatas.authStatus == 1">{{ '当前是待审核的主播' }}</span>
                <span v-else>{{ '当前是普通用户' }}</span>
              </div>
            </el-card>
          </el-col>
        <el-col :span="8">
            <el-card>
              <div slot="header" class="panel-header">
                <span class="card-title">家族信息</span>
              </div>
              <div class="card-ctxs" v-cloading="familyLoading">
                <span>家族名称：{{ familyDatas.name || '' }}</span>
                <span>家族长id+名字：{{ familyDatas.x || '' }}</span>
                <span>家族金牌主播人数：{{ familyDatas.x || 0 }}（人）</span>
                <span>家族银牌主播人数：{{ familyDatas.x || 0 }}（人）</span>
                <span>家族高提成主播人数：{{ familyDatas.x || 0 }}（人）</span>
                <span>家族礼物分成：{{ familyDatas.x || 0 }}</span>
              </div>
            </el-card>
          </el-col>
        </el-row> -->
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  getPromotionBaseInfo,
  getUserAssetsInfo,
  getUserBase,
  getAnchorBaseInfo,
  updateUserHandleStatus,
  updateWihtdrawHandleStatus
} from '@/api/center/user/all_tag_info'
import { getUserCategoryList } from '@/api/center/assets/assets'
import { nullS, formatUnixTime } from '@/utils/tools'
import { getTypeList } from '@/api/center/user/anchor'

export default {
  name: 'UserDrawer',
  filters: {
    authFilter(status) {
      const map = { 0: 'info', 1: 'warning', 2: 'success', 3: '' }
      return map[status]
    },
    liveFilter(status) {
      const map = { 0: 'info', 1: 'success' }
      return map[status]
    },
    statusFilter(status) {
      const map = { 0: 'info', 1: 'success' }
      return map[status]
    },
    typeFilter(status) {
      const map = { 0: '', 1: 'warning', 2: 'danger' }
      return map[status]
    }
  },
  props: {
    uid: {
      required: true,
      type: Number
    },
    showText: {
      required: false,
      type: String,
      default: ''
    },
    title: {
      required: false,
      type: String,
      default: '用户详细信息'
    },
    textSize: {
      required: false,
      type: String,
      default: 'mini'
    },
    drawerSize: {
      required: false,
      type: String,
      default: '80%'
    },
    isLink: {
      required: false,
      type: Boolean,
      default: false
    },
    jumps: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      drawer: false,

      // loading ...
      shareLoading: true,
      assetsLoading: true,
      baseInfoLoading: true,
      anchorLoading: true,
      familyLoading: true,
      labelOptionList: [],
      // data ...
      shareDatas: {},
      assetsDatas: {},
      baseInfoDatas: {},
      anchorDatas: {},
      familyDatas: {},
      typeList: [],
      detailMoneyTabsource: []
    }
  },
  computed: {},
  mounted() {},
  methods: {
    getLabelName(type) {
      const flist = this.labelOptionList.filter((item) => {
        return item.code == type
      })
      const obj = {
        name: '普通',
        class: 'mkeyi'
      }
      if (flist.length) {
        obj.name = flist[0].categoryName
        if (type == 1) {
          obj.class = 'mputong'
        }
        if (type == 9) {
          obj.class = 'mdaili'
        }
        if (type == 10) {
          obj.class = 'mteyao'
        }
        if (type == 11) {
          obj.class = 'myouzhi'
        }
      }
      return obj
    },
    // 跳转
    clicks() {
      // this.agentId = this.$route.query.agentId
      console.log('这是uid发送', this.uid)
      this.$router.push({
        path: '/anchor/live/user/gold/index',
        query: { uid: this.uid }
      })
    },
    // 跳路由
    routerClick(route, openType) {
      this.drawer = false
      this.$router.push({
        path: route,
        query: { uid: this.uid, openType: openType }
      })
    },
    // 加载数据
    async reloadData(idxs = []) {
      if (Array.isArray(idxs) === false) {
        return
      }

      if (idxs.indexOf(1) != -1) {
        if (!this.labelOptionList.length) {
          const res = await getUserCategoryList({})
          if (res.data) {
            this.labelOptionList = res.data
          }
        }
        this.baseInfoDatas = {}
        this.baseInfoLoading = true
        // 用户基础信息
        getUserBase(this.uid)
          .then((res) => {
            this.baseInfoDatas = res.data || {}
            this.baseInfoDatas['createTimeString'] = formatUnixTime(
              res.data.createTime || 0
            )
            this.baseInfoDatas['lastLoginTimeString'] = formatUnixTime(
              res.data.lastLoginTime || 0
            )
            this.baseInfoDatas['createTimeString'] = formatUnixTime(
              res.data.createTime || 0
            )
            this.baseInfoLoading = false
          })
          .catch((err) => {
            this.baseInfoDatas = {}
            this.baseInfoLoading = false
          })
      }

      if (idxs.indexOf(2) != -1) {
        this.assetsDatas = {}
        this.assetsLoading = true
        // 资产明细
        getUserAssetsInfo(this.uid)
          .then((res) => {
            this.assetsDatas = res.data || {}
            this.assetsDatas['lastPayTimeString'] = formatUnixTime(
              res.data.lastPayTime || 0
            )
            const tableSource = []
            Object.keys(res.data.platformProfitLoss).map((item) => {
              // 后端起名字不统一，只能特殊处理了
              const case1Item = item.toLowerCase() + 'gameConsume'
              const case2Item = item.toLowerCase() + 'GameConsume'
              const case3Item = item.toLowerCase() + 'Consume'
              const obj = {
                name: item,
                liushui:
                  res.data[case1Item] ||
                  res.data[case2Item] ||
                  res.data[case3Item],
                yingkui: res.data.platformProfitLoss[item]
              }
              obj.liushui = (obj.liushui || '').replace(/','/g, '')
              tableSource.push(obj)
            })
            this.detailMoneyTabsource = tableSource
            console.log(tableSource)
            this.assetsLoading = false
          })
          .catch((err) => {
            this.assetsDatas = {}
            this.assetsLoading = false
          })
      }

      if (idxs.indexOf(3) != -1) {
        this.shareDatas = {}
        this.shareLoading = true
        // 分享明细
        getPromotionBaseInfo(this.uid)
          .then((res) => {
            this.shareDatas = res.data || {}
            this.shareLoading = false
          })
          .catch((err) => {
            this.shareDatas = {}
            this.shareLoading = false
          })
      }

      if (idxs.indexOf(4) != -1) {
        this.anchorDatas = {}
        this.anchorLoading = true
        // 主播明细
        getTypeList()
          .then((res) => {
            this.typeList = (res.data.list || []).map((item) => {
              return {
                value: item.id,
                label: nullS(item.typeName)
              }
            })
            return getAnchorBaseInfo(this.uid)
          })
          .then((res) => {
            this.anchorDatas = res.data || {}
            console.log(JSON.stringify(res.data))
            this.anchorDatas['lastLiveTimeString'] = formatUnixTime(
              res.data.lastLiveTime || 0
            )
            //
            var authStatusString = ''
            if (res.data.authStatus == 0) {
              authStatusString = '取消认证'
            } else if (res.data.authStatus == 1) {
              authStatusString = '待审核'
            } else if (res.data.authStatus == 2) {
              authStatusString = '已认证'
            } else if (res.data.authStatus == 3) {
              authStatusString = '普通用户'
            }
            this.anchorDatas['authStatusString'] = authStatusString
            //
            var liveStatusString = ''
            if (res.data.liveStatus == 0) {
              liveStatusString = '关播'
            } else if (res.data.liveStatus == 1) {
              liveStatusString = '开播'
            } else {
              res.data.liveStatus = 0
              liveStatusString = '关播'
            }
            this.anchorDatas['liveStatusString'] = liveStatusString
            //
            var statusString = ''
            if (res.data.status == 0) {
              statusString = '试播'
            } else if (res.data.status == 1) {
              statusString = '正式'
            } else {
              res.data.status = 0
              statusString = '试播'
            }
            this.anchorDatas['statusString'] = statusString
            //
            // var typeString = '';
            // if (res.data.type == 0) {
            //   typeString = '普通主播';
            // } else if (res.data.type == 1) {
            //   typeString = '金牌主播';
            // } else if (res.data.type == 2) {
            //   typeString = '纯提成主播';
            // } else {
            //   typeString = '无';
            // }

            var typeString = ''

            for (const anchorType of this.typeList) {
              if (anchorType.value == res.data.type) {
                typeString = anchorType.label
                break
              }
            }

            this.anchorDatas['typeString'] = typeString
            //
            var tagList = []
            if (
              res.data.tags != null &&
              res.data.tags != undefined &&
              Array.isArray(res.data.tags)
            ) {
              for (var i = 0; i < res.data.tags.length; i++) {
                const tag = res.data.tags[i]
                tagList.push({
                  key: i,
                  label: `${tag}`
                })
              }
            }
            this.anchorDatas['tagList'] = tagList
            this.anchorLoading = false
          })
          .catch((err) => {
            this.anchorDatas = {}
            this.anchorLoading = false
          })
      }
    },

    // 刷新指定模块
    onRefreshClick(idx) {
      this.reloadData([idx])
    },

    // 显示侧边栏
    showDrawerClick() {
      this.drawer = true
      // 刷新全部模块
      this.reloadData([1, 2, 3, 4, 5])
    },

    // 状态变更器
    onSwitchChangeClick(idx) {
      if (idx === 1) {
        // 用户封禁
        updateUserHandleStatus(this.uid, this.baseInfoDatas.handle)
          .then((res) => {
            this.$notify({
              title: '提示',
              message: '操作成功',
              type: 'success',
              duration: 1000
            })
          })
          .catch((err) => {
            this.baseInfoDatas.handle = !this.baseInfoDatas.handle
            this.$message.error(err)
          })
      } else if (idx === 2) {
        // 提现封禁
        updateWihtdrawHandleStatus(this.uid, this.assetsDatas.handle)
          .then((res) => {
            this.$notify({
              title: '提示',
              message: '操作成功',
              type: 'success',
              duration: 1000
            })
          })
          .catch((err) => {
            this.assetsDatas.handle = !this.assetsDatas.handle
            this.$message.error(err)
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-card__header {
  padding: 0;
}
::v-deep .el-card__body {
  padding: 0;
}
::v-deep .el-drawer__header {
  padding: 5px 0 0 20px;
  margin-bottom: 0;
}
::v-deep .el-table--mini .el-table__cell {
  padding: 0 !important;
}
.noAnchor {
  padding: 10px 0 10px 10px;
  display: inline-block;
}
.panel-header {
  background-color: #fafafa;
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 10px;
  span {
    font-weight: bold;
  }
}

.panel {
  padding: 10px;
}

.see-btn {
  padding: 0;
  margin: 0;
  vertical-align: 0em;
}
.card-column {
  display: flex;
  border: 1px solid #ebeef5;
  border-top: none;
  &:hover {
    background-color: rgb(245, 247, 250);
  }
  .column-label {
    min-width: 40%;
    border-right: 1px solid #ebeef5;
    padding: 3px 0;
    font-size: 14px;
    text-align: center;
  }
  .column-data {
    padding: 3px 0 3px 10px;
    font-size: 14px;
  }
  .colorL {
    color: #47a2ff;
    cursor: pointer;
    &:hover {
      color: #0682ff;
    }
  }
}
.card-column:first-child {
  border-top: 1px solid #ebeef5;
}
.column-wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  .card-column {
    .column-label {
      width: 50%;
    }
    .colorz {
      color: #00b578;
    }
    border-top: none;
  }
  .card-column:first-child {
    border-right: none;
  }
}
.card-title {
  color: var(--theme);
  font-size: 16px;
  font-weight: 500;
}

.card-ctxs-anchor {
  display: flex;
  flex-direction: column;

  .tag-v {
    display: flex;
    align-items: center;
    border: 1px solid #ebeef5;
    border-top: none;
    .tag-title {
      color: #606266;
      font-size: 16px;
      line-height: 22px;
      font-weight: normal;
      line-height: normal;
      min-width: 24.8%;
      text-align: center;
    }
    > span {
      border-left: 1px solid #ebeef5;
      padding: 3px 0 3px 10px;
    }
  }
  .tag-v:first-child {
    border-top: 1px solid #ebeef5;
  }
}

.card-ctxs {
  display: flex;
  flex-direction: column;
  .card-switch {
    display: flex;
    align-items: center;
    padding: 0px;
    margin: 0px;
  }

  span {
    color: #606266;
    font-size: 16px;
    font-weight: normal;
    line-height: normal;
    padding: 3px 0px;
  }
}

.list {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 13px;
  b {
    color: red;
    display: flex;
    margin-bottom: 10px;
  }
  span {
    display: block;
    width: 100%;
    color: #606266;
    padding: 3px 0px;
    font-size: 16px;
  }
}

.colorRed {
  color: red;
}
</style>
