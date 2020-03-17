/** 
 * @file pxt-huskylens/huskylens.ts
 * @brief DFRobot's huskylens makecode library.
 * @n [Get the module here]()
 * @n 
 * 
 * @copyright    [DFRobot](http://www.dfrobot.com), 2016
 * @copyright    MIT Lesser General Public License
 * 
 * @author [email](jie.tang@dfrobot.com)
 * @version  V0.0.8
 * @date  2019-12-16
*/
// 在此处添加您的代码
enum Content1 {
    //% block="xCenter"
    xCenter = 1,
    //% block="yCenter"
    yCenter = 2,
    //% block="Length"
    width = 3,
    //% block="Width"
    height = 4
}
//
enum Content2 {
    //% block=" xOrigin"
    xOrigin = 1,
    //% block="yOrigin"
    yOrigin = 2,
    //% block="xTarget"
    xTarget = 3,
    //% block="yTarget"
    yTarget = 4
}
enum Content3 {
    //% block="ID"
    ID = 5,
    //% block="xCenter"
    xCenter = 1,
    //% block="yCenter"
    yCenter = 2,
    //% block="Length"
    width = 3,
    //% block="Width"
    height = 4
}
enum Content4 {
    //% block=" xOrigin"
    xOrigin = 1,
    //% block="yOrigin"
    yOrigin = 2,
    //% block="xTarget"
    xTarget = 3,
    //% block="yTarget"
    yTarget = 4,
    //% block="ID"
    ID = 5
}
//
enum HUSKYLENSResultType_t {
    //%block="box"
    HUSKYLENSResultBlock = 1,
    //%block="arrow"
    HUSKYLENSResultArrow = 2,
}
enum protocolCommand {
    COMMAND_REQUEST = 0x20,
    COMMAND_REQUEST_BLOCKS = 0x21,
    COMMAND_REQUEST_ARROWS = 0x22,
    COMMAND_REQUEST_LEARNED = 0x23,
    COMMAND_REQUEST_BLOCKS_LEARNED = 0x24,
    COMMAND_REQUEST_ARROWS_LEARNED = 0x25,
    COMMAND_REQUEST_BY_ID = 0x26,
    COMMAND_REQUEST_BLOCKS_BY_ID = 0x27,
    COMMAND_REQUEST_ARROWS_BY_ID = 0x28,
    COMMAND_RETURN_INFO = 0x29,
    COMMAND_RETURN_BLOCK = 0x2A,
    COMMAND_RETURN_ARROW = 0x2B,
    COMMAND_REQUEST_KNOCK = 0x2C,
    COMMAND_REQUEST_ALGORITHM = 0x2D,
    COMMAND_RETURN_OK = 0x2E,
    COMMAND_REQUEST_LEARN = 0x2F,
    COMMAND_REQUEST_FORGET = 0x30,
    COMMAND_REQUEST_SENSOR = 0x31,

}

enum protocolAlgorithm {
    //%block="Face Recognition"
    ALGORITHM_FACE_RECOGNITION = 0,
    //%block="Object Tracking"
    ALGORITHM_OBJECT_TRACKING = 1,
    //%block="Object Recognition"
    ALGORITHM_OBJECT_RECOGNITION = 2,
    //%block="Line Tracking"
    ALGORITHM_LINE_TRACKING = 3,
    //%block="Color Recognition"
    ALGORITHM_COLOR_RECOGNITION = 4,
    //%block="Tag Recognition"
    ALGORITHM_TAG_RECOGNITION = 5
}
//% weight=100  color=#00A654 icon="\uf083"  block="Huskylens"
namespace huskylens {
    let protocolPtr: number[][] = [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0]]
    let Protocol_t: number[] = [0, 0, 0, 0, 0, 0]
    let i = 1;
    let FRAME_BUFFER_SIZE = 128
    let HEADER_0_INDEX = 0
    let HEADER_1_INDEX = 1
    let ADDRESS_INDEX = 2
    let CONTENT_SIZE_INDEX = 3
    let COMMAND_INDEX = 4
    let CONTENT_INDEX = 5
    let PROTOCOL_SIZE = 6
    let send_index = 0;
    let receive_index = 0;

    let COMMAND_REQUEST = 0x20;

    let receive_buffer: number[] = [];
    let send_buffer: number[] = [];
    let buffer: number[] = [];

    let send_fail = false;
    let receive_fail = false;
    let content_current = 0;
    let content_end = 0;
    let content_read_end = false;

    let command: number
    let content: number
    //% block="HuskyLens request once enter the result"
    //% weight=80
    export function request(): void {
        protocolWriteCommand(protocolCommand.COMMAND_REQUEST)
        processReturn();
    }
    /**
     * @param ID to ID ,eg: 1
     */
    //% block="HuskyLens get from result ID|%ID have learned?"
    //% weight=75
    export function isLearned(ID: number): boolean {
        let hk_x = countLearnedIDs();
        if (ID <= hk_x) return true;
        return false;
    }

    /**
     * @param ID to ID ,eg: 1
     */
    //% block="HuskyLens get from result ID |%ID |%Ht in picture?"
    //% weight=70
    export function isAppear(ID: number, Ht: HUSKYLENSResultType_t): boolean {
        switch (Ht) {
            case 1:
                if (countBlocks(ID) != 0) return true;
            case 2:
                if (countArrows(ID) != 0) return true;
            default:
                return false;
        }
    }

    /**
     * @param ID to ID ,eg: 1
     */
    //%block="HuskyLens get from result ID|%ID box parameter|%number1"
    //% weight=65
    export function readeBox(ID: number, number1: Content1): number {
        let hk_y = cycle_block(ID, 1);
        let hk_x
        if (countBlocks(ID) != 0) {
            if (hk_y != null) {
                switch (number1) {
                    case 1:
                        hk_x = protocolPtr[hk_y][1]; break;
                    case 2:
                        hk_x = protocolPtr[hk_y][2]; break;
                    case 3:
                        hk_x = protocolPtr[hk_y][3]; break;
                    case 4:
                        hk_x = protocolPtr[hk_y][4]; break;
                }
            }
            else hk_x = -1;
        }
        else hk_x = -1;
        return hk_x;
    }
    //
    /**
     * @param ID to ID ,eg: 1
     * @param index to index ,eg: 1
     */
    //%block="HuskyLens get from result ID|%ID|%index box parameter|%number1"
    //% weight=45
    //% advanced=true
    export function readeBox_index(ID: number, index: number, number1: Content1): number {
        let hk_y = cycle_block(ID, index);
        let hk_x
        if (countBlocks(ID) != 0) {
            if (hk_y != null) {
                switch (number1) {
                    case 1:
                        hk_x = protocolPtr[hk_y][1]; break;
                    case 2:
                        hk_x = protocolPtr[hk_y][2]; break;
                    case 3:
                        hk_x = protocolPtr[hk_y][3]; break;
                    case 4:
                        hk_x = protocolPtr[hk_y][4]; break;
                    default:
                        hk_x = -1;
                }
            }
            else hk_x = -1;
        }
        else hk_x = -1;
        return hk_x;
    }
    //

    /**
     * @param ID to ID ,eg: 1
     */

    //%block="HuskyLens get from result ID |%ID arrow parameter |%number1"
    //% weight=60
    export function readeArrow(ID: number, number1: Content2): number {
        let hk_y = cycle_arrow(ID, 1);
        let hk_x
        if (countArrows(ID) != 0) {
            if (hk_y != null) {

                switch (number1) {
                    case 1:
                        hk_x = protocolPtr[hk_y][1]; break;
                    case 2:
                        hk_x = protocolPtr[hk_y][2]; break;
                    case 3:
                        hk_x = protocolPtr[hk_y][3]; break;
                    case 4:
                        hk_x = protocolPtr[hk_y][4]; break;
                    default:
                        hk_x = -1;
                }
            }
            else hk_x = -1;
        }
        else hk_x = -1;
        return hk_x;
    }
    //
    /**
        * @param ID to ID ,eg: 1
        * @param index to index ,eg: 1
    */

    //%block="HuskyLens get from result ID|%ID|%index arrow parameter|%number1"
    //% weight=35
    //% advanced=true
    export function readeArrow_index(index: number, ID: number, number1: Content2): number {
        let hk_y = cycle_arrow(ID, index);
        let hk_x
        if (countArrows(ID) != 0) {
            if (hk_y != null) {
                switch (number1) {
                    case 1:
                        hk_x = protocolPtr[hk_y][1]; break;
                    case 2:
                        hk_x = protocolPtr[hk_y][2]; break;
                    case 3:
                        hk_x = protocolPtr[hk_y][3]; break;
                    case 4:
                        hk_x = protocolPtr[hk_y][4]; break;
                    default:
                        hk_x = -1;
                }
            }
            else hk_x = -1;
        }
        else hk_x = -1;
        return hk_x;
    }

    //%block="HuskyLens initialize via I2C until success"
    //% weight=90
    export function initI2c(): void {
        while (!readKnock()) {
            basic.showLeds(`
                # . . . #
                . # . # .
                . . # . .
                . # . # .
                # . . . #
                `, 10)
            basic.pause(500)
            basic.clearScreen()
        }
        basic.showLeds(`
                . . . . .
                . . . . #
                . . . # .
                # . # . .
                . # . . .
                `, 10)
        basic.pause(500)
        basic.clearScreen()
    }

    //%block="HuskyLens change|%mode algorithm until success"
    //% weight=85
    export function initMode(mode: protocolAlgorithm) {
        while (!writeAlgorithm(mode)) {
            basic.showLeds(`
                    . . # . .
                    . . # . .
                    . . # . .
                    . . . . .
                    . . # . .
                    `, 10)
            basic.pause(500)
            basic.clearScreen()
        }
        basic.showLeds(`
                    . . . . .
                    . # . # .
                    . . . . .
                    # . . . #
                    . # # # .
                    `, 10)
        basic.pause(500)
        basic.clearScreen()

    }

    //
    //%block="HuskyLens get from result studyed ID"
    //% weight=55
    //% advanced=true
    export function getIds(): number {
        return Protocol_t[2];
    }
    //
    //%block="HuskyLens get from result|%Httotal"
    //% weight=50
    //% advanced=true
    export function getBox(Ht: HUSKYLENSResultType_t): number {
        switch (Ht) {
            case 1:
                return countBlocks_s();
            case 2:
                return countArrows_s();
            default:
                return 0;
        }
    }
    //
    /**
      * @param ID to ID ,eg: 1
   */
    //%block="KuskyLens get from result ID|%ID|%Httotal"
    //% weight=45
    //% advanced=true
    export function getBox_S(ID: number, Ht: HUSKYLENSResultType_t): number {
        switch (Ht) {
            case 1:
                return countBlocks(ID);
            case 2:
                return countArrows(ID);
            default:
                return 0;
        }
    }
    // //%block="writeLearn|%ID "
    // //% weight=60
    // export function writeLearn1(ID: number) {
    //     while (!writeLearn(ID)) {
    //         // basic.showLeds(`
    //         //         . . # . .
    //         //         . . # . .
    //         //         . . # . .
    //         //         . . . . .
    //         //         . . # . .
    //         //         `, 10)
    //         // basic.pause(500)
    //         // basic.clearScreen()
    //         // //serial.writeNumber(36)
    //         // //serial.writeLine("")
    //     }
    //     // basic.showLeds(`
    //     //             . . . . .
    //     //             . # . # .
    //     //             . . . . .
    //     //             # . . . #
    //     //             . # # # .
    //     //             `, 10)
    //     // basic.pause(500)
    //     // basic.clearScreen()

    // }


    //% block="HuskyLens get from result near the center box|%deta parameter "
    //% weight=60
    export function readBox_s(deta: Content3): number {
        let hk_x 
        let hk_y = readBlockCenterParameterDirect();
        if(hk_y!=-1){
             switch (deta) {
            case 1:
                hk_x = protocolPtr[hk_y][1]; break;
            case 2:
                hk_x = protocolPtr[hk_y][2]; break;
            case 3:
                hk_x = protocolPtr[hk_y][3]; break;
            case 4:
                hk_x = protocolPtr[hk_y][4]; break;
            default:
                hk_x = protocolPtr[hk_y][5];
                }
        }
        else hk_x = -1
       
        return hk_x;
    }

    //% block="HuskyLens get from result near the center arrow|%deta parameter "
    //% weight=60
    export function readArrow_s(deta:Content4):number{
        let hk_x
        let hk_y = readArrowCenterParameterDirect()
        switch (deta) {
            case 1:
                hk_x = protocolPtr[hk_y][1]; break;
            case 2:
                hk_x = protocolPtr[hk_y][2]; break;
            case 3:
                hk_x = protocolPtr[hk_y][3]; break;
            case 4:
                hk_x = protocolPtr[hk_y][4]; break;
            default:
                hk_x = protocolPtr[hk_y][5];
        }
        return hk_x;
    }

    //%block="HuskyLens get from result|%Htin picture?"
    //% weight=60
    export function isAppear_s(Ht:HUSKYLENSResultType_t):boolean{
         switch (Ht) {
            case 1:
                if (countBlocks_s() != 0) return true;
            case 2:
                if (countArrows_s() != 0) return true;
            default:
                return false;
        }
    }


    //% block="HuskyLens get from result |%index box parameter|%deta "
    //% weight=60
    export function readBox_ss(index:number, deta:Content3):number{
            let hk_x
        switch (deta) {
            case 1:
                hk_x = protocolPtr[index][1]; break;
            case 2:
                hk_x = protocolPtr[index][2]; break;
            case 3:
                hk_x = protocolPtr[index][3]; break;
            case 4:
                hk_x = protocolPtr[index][4]; break;
            default:
                hk_x = protocolPtr[index][5];
        }
        return hk_x;
    }


     //% block="HuskyLens get from result |%index arrow parameter|%deta "
    //% weight=60
    export function readArrow_ss(index:number, deta:Content4):number{
            let hk_x
        switch (deta) {
            case 1:
                hk_x = protocolPtr[index][1]; break;
            case 2:
                hk_x = protocolPtr[index][2]; break;
            case 3:
                hk_x = protocolPtr[index][3]; break;
            case 4:
                hk_x = protocolPtr[index][4]; break;
            default:
                hk_x = protocolPtr[index][5];
        }
        return hk_x;
    }

    //
    function validateCheckSum() {

        let stackSumIndex = receive_buffer[3] + CONTENT_INDEX;
        let hk_sum = 0;
        for (let i = 0; i < stackSumIndex; i++) {
            hk_sum += receive_buffer[i];
        }
        hk_sum = hk_sum & 0xff;

        return (hk_sum == receive_buffer[stackSumIndex]);
    }
    //
    function husky_lens_protocol_write_end() {
        if (send_fail) { return 0; }
        if (send_index + 1 >= FRAME_BUFFER_SIZE) { return 0; }
        send_buffer[CONTENT_SIZE_INDEX] = send_index - CONTENT_INDEX;
        let hk_sum = 0;
        for (let i = 0; i < send_index; i++) {
            hk_sum += send_buffer[i];
        }

        hk_sum = hk_sum & 0xff;
        send_buffer[send_index] = hk_sum;
        send_index++;
        return send_index;
    }
    //
    function husky_lens_protocol_write_begin(command = 0) {

        //send_buffer= [0]
        send_fail = false;
        send_buffer[HEADER_0_INDEX] = 0x55;
        send_buffer[HEADER_1_INDEX] = 0xAA;
        send_buffer[ADDRESS_INDEX] = 0x11;
        send_buffer[COMMAND_INDEX] = command;

        send_index = CONTENT_INDEX;

        return send_buffer;
    }
    //
    function protocolWrite(buffer: Buffer) {
        //serial.writeNumber(buffer[4])
        //serial.writeLine("")
        pins.i2cWriteBuffer(0x32, buffer, false);
    }
    //

    function processReturn() {
        if (!wait(protocolCommand.COMMAND_RETURN_INFO)) return false;
        //protocolReadReturnInfo(protocolInfo);
        protocolReadFiveInt16(protocolCommand.COMMAND_RETURN_INFO);

        // protocolPtr = (Protocol_t *) realloc(protocolPtr, protocolInfo.protocolSize * sizeof(Protocol_t));

        for (let i = 0; i < Protocol_t[1]; i++) {
            //serial.writeNumber(12)
            //serial.writeLine("")
            if (!wait()) return false;
            if (protocolReadFiveInt161(i, protocolCommand.COMMAND_RETURN_BLOCK)) continue;
            else if (protocolReadFiveInt161(i, protocolCommand.COMMAND_RETURN_ARROW)) continue;
            else return false;
        }

        return true;
    }
    //   

    function wait(command = 0) {
        timerBegin();
        while (!timerAvailable()) {
            if (protocolAvailable()) {
                if (command) {

                    if (husky_lens_protocol_read_begin(command)) {
                        //serial.writeNumber(3)
                        //serial.writeLine("")
                        return true;
                    }
                }
                else {
                    //serial.writeNumber(4)
                    //serial.writeLine("")
                    return true;
                }
            }
        }
        return false;
    }
    //
    function husky_lens_protocol_read_begin(command = 0) {

        //serial.writeNumber(receive_buffer[COMMAND_INDEX])
        //serial.writeLine("")
        if (command == receive_buffer[COMMAND_INDEX]) {
            content_current = CONTENT_INDEX;
            content_read_end = false;
            receive_fail = false;
            return true;
        }
        return false;
    }
    //
    let timeOutDuration = 100;
    let timeOutTimer: number
    function timerBegin() {
        timeOutTimer = input.runningTimeMicros();

    }
    //
    function timerAvailable() {
        return (input.runningTimeMicros() - timeOutTimer > timeOutDuration);
    }
    //
    let m_i = 16
    function protocolAvailable() {
        let buf = pins.createBuffer(16)
        if (m_i == 16) {
            buf = pins.i2cReadBuffer(0x32, 16, false);
            //for (let i = 0; i < 16; i++)M_buf[i] = buf[i]
            m_i = 0;
        }
        //serial.writeNumber(buf[4])
        //serial.writeLine("")
        for (let i = m_i; i < 16; i++) {
            if (husky_lens_protocol_receive(buf[i])) {
                m_i++;
                return true;
            }
            m_i++;
        }
        return false
    }
    //
    function husky_lens_protocol_receive(data: number): boolean {
        //serial.writeNumber(data)
        //serial.writeLine("")
        switch (receive_index) {
            case HEADER_0_INDEX:
                if (data != 0x55) { receive_index = 0; return false; }
                receive_buffer[HEADER_0_INDEX] = 0x55;
                //serial.writeNumber(receive_buffer[0])
                break;
            case HEADER_1_INDEX:
                if (data != 0xAA) { receive_index = 0; return false; }
                receive_buffer[HEADER_1_INDEX] = 0xAA;
                break;
            case ADDRESS_INDEX:

                receive_buffer[ADDRESS_INDEX] = data;
                //serial.writeNumber(receive_buffer[2])
                break;
            case CONTENT_SIZE_INDEX:

                if (data >= FRAME_BUFFER_SIZE - PROTOCOL_SIZE) { receive_index = 0; return false; }
                receive_buffer[CONTENT_SIZE_INDEX] = data;
                //serial.writeNumber(receive_buffer[3])
                //serial.writeLine("")
                break;
            default:
                receive_buffer[receive_index] = data;

                if (receive_index == receive_buffer[CONTENT_SIZE_INDEX] + CONTENT_INDEX) {
                    content_end = receive_index;
                    receive_index = 0;
                    //serial.writeNumber(receive_buffer[4])
                    return validateCheckSum();

                }
                break;
        }
        receive_index++;
        return false;
    }

    //
    function husky_lens_protocol_write_int16(content = 0) {

        let x: number = ((content.toString()).length)
        if (send_index + x >= FRAME_BUFFER_SIZE) { send_fail = true; return; }
        send_buffer[send_index] = content & 0xff;
        send_buffer[send_index + 1] = (content >> 8) & 0xff;
        send_index += 2;
    }
    // 
    function protocolReadFiveInt16(command = 0) {
        if (husky_lens_protocol_read_begin(command)) {

            Protocol_t[0] = command;
            Protocol_t[1] = husky_lens_protocol_read_int16();
            Protocol_t[2] = husky_lens_protocol_read_int16();
            Protocol_t[3] = husky_lens_protocol_read_int16();
            Protocol_t[4] = husky_lens_protocol_read_int16();
            Protocol_t[5] = husky_lens_protocol_read_int16();
            husky_lens_protocol_read_end();
            return true;
        }
        else {
            return false;
        }
    }
    //
    function protocolReadFiveInt161(i: number, command = 0) {
        if (husky_lens_protocol_read_begin(command)) {
            protocolPtr[i][0] = command;
            protocolPtr[i][1] = husky_lens_protocol_read_int16();
            protocolPtr[i][2] = husky_lens_protocol_read_int16();
            protocolPtr[i][3] = husky_lens_protocol_read_int16();
            protocolPtr[i][4] = husky_lens_protocol_read_int16();
            protocolPtr[i][5] = husky_lens_protocol_read_int16();
            husky_lens_protocol_read_end();
            return true;
        }
        else {
            return false;
        }
    }
    //

    function husky_lens_protocol_read_int16() {
        if (content_current >= content_end || content_read_end) { receive_fail = true; return 0; }
        let result = receive_buffer[content_current + 1] << 8 | receive_buffer[content_current];
        content_current += 2
        return result;
    }
    //
    function husky_lens_protocol_read_end() {
        if (receive_fail) {
            receive_fail = false;
            return false;
        }
        return content_current == content_end;
    }
    // 
    function countLearnedIDs() {
        //serial.writeNumber(Protocol_t[2])
        //serial.writeLine("")
        return Protocol_t[2]
    }
    //
    function countBlocks(ID: number) {
        let counter = 0;
        for (let i = 0; i < Protocol_t[1]; i++) {
            if (protocolPtr[i][0] == protocolCommand.COMMAND_RETURN_BLOCK && protocolPtr[i][5] == ID) counter++;
        }
        return counter;
    }
    //
    function countBlocks_s() {
        let counter = 0;
        for (let i = 0; i < Protocol_t[1]; i++) {
            if (protocolPtr[i][0] == protocolCommand.COMMAND_RETURN_BLOCK) counter++;
        }
        return counter;
    }
    //
    function countArrows(ID: number) {
        let counter = 0;
        for (let i = 0; i < Protocol_t[1]; i++) {
            if (protocolPtr[i][0] == protocolCommand.COMMAND_RETURN_ARROW && protocolPtr[i][5] == ID) counter++;
        }
        return counter;
    }
    //
    function countArrows_s() {
        let counter = 0;
        for (let i = 0; i < Protocol_t[1]; i++) {
            if (protocolPtr[i][0] == protocolCommand.COMMAND_RETURN_ARROW) counter++;
        }
        return counter;
    }
    //
    function readKnock() {
        for (let i = 0; i < 5; i++) {
            protocolWriteCommand(protocolCommand.COMMAND_REQUEST_KNOCK);//I2C
            if (wait(protocolCommand.COMMAND_RETURN_OK)) {
                return true;
            }
        }

        return false;
    }
    function writeForget() {
        for (let i = 0; i < 5; i++) {
            protocolWriteCommand(protocolCommand.COMMAND_REQUEST_FORGET);
            if (wait(protocolCommand.COMMAND_RETURN_OK)) {
                return true;
            }
        }

        return false;
    }
    //
    //
    function protocolWriteCommand(command = 0) {
        Protocol_t[0] = command;
        let buffer = husky_lens_protocol_write_begin(Protocol_t[0]);
        let length = husky_lens_protocol_write_end();
        let Buffer = pins.createBufferFromArray(buffer);
        protocolWrite(Buffer);
    }
    //
    function protocolReadCommand(command = 0) {
        if (husky_lens_protocol_read_begin(command)) {
            Protocol_t[0] = command;
            husky_lens_protocol_read_end();
            return true;
        }
        else {
            return false;
        }
    }
    //
    function writeAlgorithm(algorithmType: number) {

        protocolWriteOneInt16(algorithmType, protocolCommand.COMMAND_REQUEST_ALGORITHM);
        return wait(protocolCommand.COMMAND_RETURN_OK);
    }

    function writeLearn(algorithmType: number) {

        protocolWriteOneInt16(algorithmType, protocolCommand.COMMAND_REQUEST_LEARN);
        return wait(protocolCommand.COMMAND_RETURN_OK);
    }

    //
    function protocolWriteOneInt16(algorithmType: number, command = 0) {
        let buffer = husky_lens_protocol_write_begin(command);
        husky_lens_protocol_write_int16(algorithmType);
        let length = husky_lens_protocol_write_end();
        let Buffer = pins.createBufferFromArray(buffer);
        protocolWrite(Buffer);
    }
    function cycle_block(ID: number, index = 1): number {
        let counter = 0;
        for (let i = 0; i < Protocol_t[1]; i++) {
            if (protocolPtr[i][0] == protocolCommand.COMMAND_RETURN_BLOCK && protocolPtr[i][5] == ID) {
                counter++;
                if (index == counter) return i;

            }
        }
        return null;
    }
    function cycle_arrow(ID: number, index = 1): number {
        let counter = 0;
        for (let i = 0; i < Protocol_t[1]; i++) {
            if (protocolPtr[i][0] == protocolCommand.COMMAND_RETURN_ARROW && protocolPtr[i][5] == ID) {
                counter++;
                if (index == counter) return i;

            }
        }
        return null;
    }

    function readBlockCenterParameterDirect():number{
        let distanceMinIndex = -1;
        let distanceMin = 65535;
        for (let i = 0; i < Protocol_t[1]; i++) {
            if (protocolPtr[i][0] == protocolCommand.COMMAND_RETURN_BLOCK){
                let distance = Math.round(Math.sqrt(Math.abs(protocolPtr[i][1]-320/2))) + Math.round(Math.sqrt(Math.abs(protocolPtr[i][2]-240/2)));
                if (distance <distanceMin){
                    distanceMin = distance;
                    distanceMinIndex = i;
                    }
            }
        }
        return distanceMinIndex
    }

    function readArrowCenterParameterDirect():number{
        let distanceMinIndex = -1;
        let distanceMin = 65535;
        for (let i = 0; i < Protocol_t[1]; i++) {
            if (protocolPtr[i][0] == protocolCommand.COMMAND_RETURN_ARROW){
                let distance = Math.round(Math.sqrt(Math.abs(protocolPtr[i][1]-320/2))) + Math.round(Math.sqrt(Math.abs(protocolPtr[i][2]-240/2)));
                if (distance <distanceMin){
                    distanceMin = distance;
                    distanceMinIndex = i;
                    }
            }
        }

        return distanceMinIndex
    }
}

