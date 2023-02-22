var SolarOperationMode = global.get("SolarOperationMode");     // 0-Off  1-Voltage or current limited  2-MPPT Tracker active 255- Not available
var MultiPlusActiveInput = global.get("MultiPlusActiveInput"); // 0-AC Input 1  1-AC Input 2  240-Disconnected
var MPPTpower = global.get("MPPTpower");                       // MPPT power in watts
//var BatterySOC = global.get("BatterySOC");                     // Battery SOC in %
//var BatteryState = global.get("BatteryState");                 // 0-Idle  1-Charging  2-Discharging
var ActualGridsetpoint = global.get("ActualGridsetpoint");     // ActualGridsetpoint in watts
var ConsumptionL1 = global.get("ConsumptionL1");               // ConsumptionL1 in watts

var increment = 50;
var offset = 50;
var BatteryGoal = 40;                                            // Watts


function round(number, increment, offset) 
{
    //return Math.ceil((number - offset) / increment ) * increment + offset;         // Round up
    return Math.floor(Math.abs(number - offset) / increment ) * increment + offset;  // Round down
}

function dynamicPowerLimit(MPPTpower, BatteryGoal)
{
    var PowerLimit = BatteryGoal + MPPTpower

    return PowerLimit;
}



if (SolarOperationMode != null && MultiPlusActiveInput != null) // If input data NOT NULL
{
    if (MultiPlusActiveInput == 240)                            // If no ACin
    {
        return [{payload:2000},{payload:1000}];
    }
    else                                                        // If Acin is OK
    {
        if (SolarOperationMode == 0 || MPPTpower < 30 )                            // If SolarCharger OFF or MPPTpower < 30
        {
            return [{payload:50},null];
        }
        else if(SolarOperationMode == 1 & MPPTpower >= 30)                        // If SolarCharger LIMIT
        {
            return [{payload:1000},null];
        }
        else if(SolarOperationMode == 2 & MPPTpower >= 30)                        // If SolarCharger NO LIMIT
        {
            var ACload = ConsumptionL1 - ActualGridsetpoint
            var DynamicLimit = dynamicPowerLimit(MPPTpower, BatteryGoal)
            var result = round(DynamicLimit, increment, offset)
            
            if (DynamicLimit < ACload)                          // If Inverter power limit is less than ACloads
            {
                return [{payload:result},null];
            }
            else
            {
                return [{payload:1000},null];
            }
        }
        else                                                    // If Solar charger NOT CONNECTED
        {
            return [{payload:1000},null]; 
        }
    }
}
else return [null,{payload:1000}];                              // If input data IS null
