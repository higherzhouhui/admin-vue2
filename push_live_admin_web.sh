#!/bin/bash
## push live-admin-web 
docker rmi live-admin-web:2.0.0 
docker rmi registry-intl.cn-hongkong.aliyuncs.com/sk-stream/live-admin-web:2.0.0 
docker build -t live-admin-web:2.0.0 .
docker tag live-admin-web:2.0.0 registry-intl.cn-hongkong.aliyuncs.com/sk-stream/live-admin-web:2.0.0
docker login -u=dgc.mtlcloud020@5903978896789214 -p=dockerABC123 registry-intl.cn-hongkong.aliyuncs.com
docker push registry-intl.cn-hongkong.aliyuncs.com/sk-stream/live-admin-web:2.0.0
curl https://cs.console.aliyun.com/hook/trigger?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHVzdGVySWQiOiJjNDFjY2Q4N2NkNTcwNGM0ZmE1NjY4YzBiMjc5ODI1ZWQiLCJpZCI6Ijc4NzM2In0.M1Yy_PZa2_-yzXW8qsvZ7DCpsxtFyx9-4ZD14EdrGNHOgiPYTwkIn2UHYj7eJPV5vfU8jvRUGDD19hx7-1eZ4OoR7gmI4w8j025jPXbwKubC_6LMvCB3KYue4ZkwM-pzZdgB5on4a8M1WX3pDm9Jtk01YGjGBucQHmucfy-wcL8
