var SolarOperationMode = global.get("SolarOperationMode");     // 0-Off  1-Voltage or current limited  2-MPPT Tracker active 255- Not available
var MultiPlusActiveInput = global.get("MultiPlusActiveInput"); // 0-AC Input 1  1-AC Input 2  240-Disconnected
var MPPTpower = global.get("MPPTpower");                       // MPPT power in watts
var BatterySOC = global.get("BatterySOC");                     // Battery SOC in %
//var BatteryState = global.get("BatteryState");                 // 0-Idle  1-Charging  2-Discharging
var ActualGridsetpoint = global.get("ActualGridsetpoint");     // ActualGridsetpoint in watts
var ConsumptionL1 = global.get("ConsumptionL1");              // ConsumptionL1 in watts
var BatteryLastFullCharge = global.get("BatteryLastFullCharge");
var ESSstate = global.get("ESSstate");
var MultiPlusState = global.get("MultiPlusState")
var BatteryNeedBalance = global.get("BatteryNeedBalance")
var MinSOC = global.get("MinSOC")

var ACload = ConsumptionL1 - ActualGridsetpoint

var increment_batt = 10;
var offset_batt = 20;
var increment_soc = 5;
var offset_soc = 20;

var gridSetPoint
var minimumSOC

function round(number, increment, offset) 
{
    //return Math.ceil((number - offset) / increment ) * increment + offset;         // Round up
    return Math.floor(Math.abs(number - offset) / increment ) * increment + offset;  // Round down
}



if (BatteryLastFullCharge >= 3)
{
    global.set("BatteryNeedBalance",true);
}
else if (BatteryLastFullCharge == 0 & MultiPlusState == 5)
{
    global.set("BatteryNeedBalance",false);
}



if (BatteryNeedBalance == true & MPPTpower > 40 & ConsumptionL1 > 40)
{
    gridSetPoint = round(ConsumptionL1 - 20, increment_batt, offset_batt)
    minimumSOC = 35
    return [{payload:gridSetPoint}, {payload:minimumSOC}];
}
else if (BatteryNeedBalance == true & MPPTpower < 40 & ConsumptionL1 > 40 || BatteryNeedBalance == true & SolarOperationMode == 0 )
{
    gridSetPoint = round(ConsumptionL1 - 20, increment_batt, offset_batt)
    minimumSOC = round(BatterySOC, increment_soc, offset_soc)
    return [{payload:gridSetPoint}, {payload:minimumSOC}];
}
else
{
    if(ConsumptionL1 <= 100)
    {
        gridSetPoint = 20
        minimumSOC = 35
        return [{payload:gridSetPoint}, {payload:minimumSOC}];
    }
    else
    {
        gridSetPoint = 50
        minimumSOC = 35
        return [{payload:gridSetPoint}, {payload:minimumSOC}];
    }
}

