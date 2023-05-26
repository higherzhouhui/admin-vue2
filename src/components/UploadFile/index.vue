<template>
    <div>
        <el-upload accept=".jpg, .jpeg, .png, .mp4" ref="upload" :action="axiosUrl"
            :limit="9"
            :on-error="changeFile"
            :on-success="uploadSuccess"
            :file-list="filelist"
            :before-upload="checkFile"
            :on-remove="removeFile"
            :before-remove="removeSuccess"
            :headers="myHeaders"
            :on-preview="download"
            :disabled="disabled"
          >
            <template #trigger v-if="showDo">
              <el-button size="small" type="primary">选取文件</el-button>
            </template>
            <template #tip v-if="showDo">
              <div class="el-upload__tip">只能上传图片/视频 大小小于30M</div>
            </template>
          </el-upload>
    </div>
</template>

<script>
import { handleUploadExcel } from "@/api/center/user/handle";
export default {
    name: "file",
    props: {
        files: Array,
        showBtn: Boolean,
        isDisabled: Boolean,
    },
    data() {
        return {
            // axiosUrl:axiosUrl()+'/attachment/upload',
            axiosUrl:handleUploadExcel,
            filelist:[],
            myHeaders:{
                token:window.sessionStorage.token
            },
            showDo: true,
            disabled: false,
        }
    },
    methods: {
        checkFile(file){
            if(file.size > 30*1024*1024){
                this.$message({
                message: "单个文件大小最大为30M！",
                type: "warning",
                center: true
                });
                return false;
            }
        },
        changeFile(err,file, fileList){
            this.$message({
                message: "文件上传失败，请稍后再试！",
                type: "warning",
                center: true
            });
        },
        uploadSuccess(response, file, fileList){
            if(response.ret == '200')
            {
                this.filelist = fileList;
            }else{
                this.filelist = [];
                this.changeFile();
            }
            this.$emit("updateList", this.filelist);
        },
        async removeSuccess(file, fileList){
            let result = await this.$confirm("确认要删除"+file.name+"吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
            return result;
        },
        async removeFile(f){
            let attId = '';
            if(f.attId){
                attId = f.attId;
            }else if(f.response){
                attId = f.response.data;
            }
            let result = await file.del(attId);
            if(result.ret == '200'){
                this.$message({
                    message: "删除成功！",
                    type: "success",
                    center: true
                });
                this.$emit("updateList", this.filelist);
            }
        },
        download(file){
            if(file.url){
                window.open(file.url+'&token='+window.sessionStorage.token);
            }else{
                let attId = file.response.data;
                window.open(axiosUrl()+"/attachment/download?attId="+attId+'&token='+window.sessionStorage.token);
            }
        },
    },
    mounted(){
        if(this.showBtn) this.showDo = false;
        if(this.isDisabled) this.disabled = true;
        this.filelist = this.files;
    },
    watch: {
        files(val) {
            this.filelist = val;
        },
    },
}
</script>