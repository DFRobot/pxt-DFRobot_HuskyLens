
huskylens.initMode(protocolAlgorithm.ALGORITHM_OBJECT_TRACKING)
basic.forever(function () {
    huskylens.request()
    if (huskylens.isAppear_s(HUSKYLENSResultType_t.HUSKYLENSResultBlock)) {
        if (huskylens.isLearned(1)) {
            serial.writeValue("x", huskylens.readeBox(1, Content1.xCenter))
            serial.writeValue("y", huskylens.readeBox(1, Content1.yCenter))
            serial.writeValue("k", huskylens.readeBox(1, Content1.width))
            serial.writeValue("h", huskylens.readeBox(1, Content1.height))
        } else {
            serial.writeString("-1")
        }
    } else {
        serial.writeString("-1")
    }
})
