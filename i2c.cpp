#include "pxt.h"
#include "nrf_gpio.h"

#include "pxtbase.h"

//% color=50 weight=80
//% icon="\uf1eb"
namespace i2c { 

//%
 void init(){
     nrf_gpio_cfg(32,NRF_GPIO_PIN_DIR_INPUT,NRF_GPIO_PIN_INPUT_CONNECT,NRF_GPIO_PIN_PULLDOWN,NRF_GPIO_PIN_S0D1,NRF_GPIO_PIN_NOSENSE);
 }
 
}