// 在此处测试；当此软件包作为插件使用时，将不会编译此软件包。
huskylens.initI2c()
huskylens.initMode(protocolAlgorithm.ALGORITHM_FACE_RECOGNITION)
basic.forever(function () {
    huskylens.request()
    if (huskylens.isLearned(1)) {
        if (huskylens.isAppear(1, HUSKYLENSResultType_t.HUSKYLENSResultBlock)) {
            serial.writeValue("BOX", huskylens.readeBox(1, Content1.xCenter))
        }
    }
})
