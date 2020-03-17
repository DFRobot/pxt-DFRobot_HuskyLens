#include "HUKSYLENS.h"

#ifndef _HUKSYLENS_MIND_PLUS_H
#define _HUKSYLENS_MIND_PLUS_H

typedef struct HUSKYLENSBlockInfo_t
{
	int32_t xCenter;
	int32_t yCenter;
	int32_t width;
	int32_t height;
} HUSKYLENSBlockInfo;

typedef struct HUSKYLENSArrowInfo_t
{
	int32_t xOrigin;
	int32_t yOrigin;
	int32_t xTarget;
	int32_t yTarget;
} HUSKYLENSArrowInfo;

typedef enum HUSKYLENSResultType_t
{
    HUSKYLENSResultBlock,
    HUSKYLENSResultArrow,
}HUSKYLENSResultType;

class HUKSYLENSMindPlus : public HUKSYLENS
{
private:
    bool isWire = false;
public:    

    void beginI2CUntilSuccess(){
        Wire.begin();
        Wire.setClock(100000);
        while (!begin(Wire))
        {
            delay(100);
        }
        isWire = true;
    }

    void beginSoftwareSerialUntilSuccess(int RXPin, int TXPin){
        static SoftwareSerial mySerial(RXPin, TXPin);
        mySerial.begin(9600);
        while (!begin(mySerial))
        {
            delay(100);
        }
        isWire = false;
    }


    bool writeAlgorithm(protocolAlgorithm algorithmType){
        Wire.setClock(100000);
        HUKSYLENS::writeAlgorithm(algorithmType);
    }

    bool request(){
        Wire.setClock(100000);
        HUKSYLENS::request();
    }

    bool isAppear(int ID, HUSKYLENSResultType type){
        switch (type)
        {
        case HUSKYLENSResultBlock:
            return countBlocks();
        case HUSKYLENSResultArrow:
            return countArrows();
        default:
            return false;        
        }
    }

    HUSKYLENSBlockInfo readBlockParameter(int ID, int index=1){
        HUSKYLENSResult result = blocks.read(ID, index-1);
        HUSKYLENSBlockInfo block;
        block.xCenter = result.xCenter;
        block.yCenter = result.yCenter;
        block.width = result.width;
        block.height = result.height;
        return block;
    } 

    HUSKYLENSArrowInfo readArrowParameter(int ID, int index=1){
        HUSKYLENSResult result = arrows.read(ID, index-1);
        HUSKYLENSArrowInfo arrow;
        arrow.xOrigin = result.xOrigin;
        arrow.yOrigin = result.yOrigin;
        arrow.xTarget = result.xTarget;
        arrow.yTarget = result.yTarget;
        return arrow;
    }

    float readLearnedIDCount(){
        return countLearnedIDs();
    }

    float readCount(HUSKYLENSResultType type){
        switch (type)
        {
        case HUSKYLENSResultBlock:
            return countBlocks();
        case HUSKYLENSResultArrow:
            return countArrows();
        default:
            return -1.0f;        
        }
    }

    float readCount(int ID, HUSKYLENSResultType type){
        switch (type)
        {
        case HUSKYLENSResultBlock:
            return countBlocks(ID);
        case HUSKYLENSResultArrow:
            return countArrows(ID);
        default:
            return -1.0f;        
        }
    }


};



#endif