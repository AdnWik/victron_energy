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


// If input data NOT NULL
if (SolarOperationMode != null && MultiPlusActiveInput != null)
{
    // If no ACin
    if (MultiPlusActiveInput == 240)
    {
        return [{payload:2000},{payload:1000}];
    }
    
    // If Acin is OK
    else
    {   
        // If SolarCharger NO LIMIT and MPPTpower <= 25
        if (SolarOperationMode == 2 & MPPTpower <= 25 )
        {
            return [{payload:500},null];
        }
        // If SolarCharger NO LIMIT and MPPT power > 25 and MPPTpower < 80
        if (SolarOperationMode == 2 & MPPTpower > 25 & MPPTpower < 80 )
        {
            return [{payload:50},null];
        }
        
        // If SolarCharger OFF and MPPTpower < 50
        else if (SolarOperationMode == 0 & MPPTpower < 50 )
        {
            return [{payload:500},null];
        }
        
        // If SolarCharger LIMIT and MPPTpower >= 50
        else if(SolarOperationMode == 1 & MPPTpower >= 50)
        {
            return [{payload:1000},null];
        }
        
        // If SolarCharger NO LIMIT and MPPTpower >= 80
        else if(SolarOperationMode == 2 & MPPTpower >= 80)
        {
            var ACload = ConsumptionL1 - ActualGridsetpoint
            var DynamicLimit = dynamicPowerLimit(MPPTpower, BatteryGoal)
            var result = round(DynamicLimit, increment, offset)
            
            // If Inverter power limit is less than ACloads
            if (DynamicLimit < ACload)
            {
                return [{payload:result},null];
            }
            else
            {
                return [{payload:1000},null];
            }
        }
        
        // If Solar charger NOT CONNECTED
        else
        {
            return [{payload:1000},null]; 
        }
    }
}

// If input data IS null
else return [null,{payload:1000}];
