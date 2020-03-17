#include "HUKSYLENSMindPlus.h"
#include "pxt.h"

using namespace pxt;

namespace HUKSYLENS {

class HUKSYLENS1 : public HUKSYLENSMindPlus{
    
    void request(){
        HUKSYLENSMindPlus.request();
    }

    void isLearned(int ID){
        return HUKSYLENSMindPlus.isLearned(ID);
    }

}

}