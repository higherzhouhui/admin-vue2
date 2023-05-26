<template>
    <div class="mark-components" v-if="list.length">
        <div class="mark-box">
            <transition-group name="scroll">
                <div class="mark-item flex" v-for="(item, index) in  list "
                    :key="item.onlineTime + '_' + index + '-' + item.uid">
                    <img src="@/assets/imgs/notice-icon.png" alt="">
                    <div class="txt">用户 <b style="margin-left: 5px;"> {{ item.uid }}（ <span class="name"> {{ item.nickname ||  item.nickName }} </span> ）</b>上线了!
                    </div>
                </div>
            </transition-group>
        </div>
        <el-dropdown class="avatar-container  hover-effect" trigger="click">
            <img class="notice" src="../../assets/imgs/list-icon.png" alt="" @click="getList()">
            <el-dropdown-menu slot="dropdown" class="user-dropdown">
                <el-dropdown-item :divided="index != 0" v-for="( item, index ) in  history.slice(len, 10) "
                    :key="item.onlineTime + '_' + index + '-' + item.uid">
                    <div class="mark-item">
                        <div class="txt">用户 &nbsp;{{ item.uid }}（{{ item.nickName }}）上线了!</div>
                        <div class="time">{{ formatUnixTime(item.onlineTime) }}</div>
                    </div>
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>

    </div>
</template>
<script>
import { formatUnixTime } from '@/utils/tools'
import { getRecordList } from '@/api/center/user/base'

const TIME = 5000
export default {
    data() {
        return {
            list: [],
            history: []
        }
    },
    created() {
        this.getList(true)
        this.scrollFun()
        window.document.addEventListener('sendNotice', this.addNotice)
        // this.$root.$on('sendNotice', this.addNotice)
    },

    computed: {
        len() {
            return this.history.length < 10 ? 0 : this.history.length - 10
        }
    },
    beforeDestroy() {
        this.clearTime()
        window.document.removeEventListener('sendNotice', this.addNotice)
        // this.$root.$off('sendNotice', this.addNotice)
    },
    methods: {
        formatUnixTime,
        getList(bol = false) {
            getRecordList().then(rt => {
                if (rt.data.length) {
                    this.history = rt.data.slice(0);
                    if (bol) {
                        this.list = [rt.data[0]];
                    }
                }
            })
        },
        addNotice(data) {
            this.list.push(data.noticeValue)
        },
        clearTime() {
            clearInterval(this.timer)
        },
        scrollFun() {
            setInterval(() => {
                if (this.list.length > 1) {
                    this.list.shift()
                }
            }, TIME)
        }
    }
}
</script>
<style scoped lang="scss">
.mark-components {
    margin-left: 20px;
    display: flex;
    align-items: center;
    color: #fff;
    min-width: 300px;

    img {
        margin-right: 8px;
        width: 14px;
        height: 14px;
    }

    .notice {
        margin-top: 3px;
        margin-left: 8px;
        cursor: pointer;
    }
    b{
        display: flex;
        align-items: center;
    }
    .mark-box {
        margin-right: 25px;
        // min-width: 260px;
        height: 16px;
        line-height: 16px;
        overflow: hidden;

    }
}

.mark-item {
    text-align: left;

    &.flex {
        display: flex;
        align-items: center;
    }

    .txt {
        display: flex;
        align-items: center;
        font-size: 14px;
        width: 100%;
        white-space: nowrap;

        .name {
            display: inline-block;
            max-width: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }

    .time {
        color: #ccc;
        line-height: 14px;
    }
}

.scroll-enter-active,
.scroll-leave-active {
    transition: .5s all;
}

.scroll-enter {
    transform: translateY(16px);
}

.scroll-leave-to {
    transform: translateY(-16px);
}
</style>