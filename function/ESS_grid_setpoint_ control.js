var SolarOperationMode = global.get("SolarOperationMode");     // 0-Off  1-Voltage or current limited  2-MPPT Tracker active 255- Not available
var MultiPlusActiveInput = global.get("MultiPlusActiveInput"); // 0-AC Input 1  1-AC Input 2  240-Disconnected
var MPPTpower = global.get("MPPTpower");                       // MPPT power in watts
//var BatterySOC = global.get("BatterySOC");                     // Battery SOC in %
//var BatteryState = global.get("BatteryState");                 // 0-Idle  1-Charging  2-Discharging
var ActualGridsetpoint = global.get("ActualGridsetpoint");     // ActualGridsetpoint in watts
var ConsumptionL1 = global.get("ConsumptionL1");               // ConsumptionL1 in watts

var ACload = ConsumptionL1 - ActualGridsetpoint

//if(SolarOperationMode == 1 & MPPTpower >= 30)

if(ConsumptionL1 <= 100)
{
    return [{payload:20}];
}
else
{
    return [{payload:50}];
}
