// Battery SOC in %
var BatterySOC = global.get("BatterySOC");

if (BatterySOC != null)
{
    if (BatterySOC >= 95 )
    {
        return {payload:10};
    }
    else if(BatterySOC >= 93 && BatterySOC < 95)
    {
        return {payload:15};
    }
    else if(BatterySOC >= 90 && BatterySOC < 93)
    {
        return {payload:20};
    }
    else
    {
        return {payload:25}; 
    }
    
}
else return {payload:25};
