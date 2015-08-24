var consts =  {
    'DAILY_CODE': 'D',
    'MONTHLY_CODE': 'M',
    'MS_PER_DAY': 86400000
};

var generate = function generate(granularity, startTs, endTs, settings){
    startTs = trySetStartOverride(startTs, granularity, settings);
    endTs = trySetEndOverride(endTs, granularity, settings);
    
    var localStartDate = new Date(+startTs), // + forces string to int
        localEndDate = new Date(+endTs),
        localOffset = localStartDate.getTimezoneOffset() * 60000,
        result = [];
        
    var startDate = (granularity === consts.MONTHLY_CODE) ? 1 : localStartDate.getDate(),
        startUtc = new Date(localStartDate.getFullYear(), localStartDate.getMonth(), startDate).getTime() - localOffset,
        endDate = (granularity === consts.MONTHLY_CODE) ? 1 : localEndDate.getDate(),
        endUtc = new Date(localEndDate.getFullYear(), localEndDate.getMonth(), endDate).getTime() - localOffset,
        curUtcTs = startUtc;
    
    while (curUtcTs <= endUtc) {
        result.push({
           "Time": curUtcTs,
           "Count": getRandomCount(curUtcTs, granularity, localOffset, settings)
        });
        curUtcTs = getNextTs(curUtcTs, granularity, localOffset); 
    }
    return result;
};

var getNextTs = function getNextTs(curUtcTs, granularity, localOffset) {
    if(granularity === consts.DAILY_CODE){
      return curUtcTs + consts.MS_PER_DAY;  
    } else { //month
        var curDate = new Date(curUtcTs);
        return new Date(curDate.getFullYear(), curDate.getMonth() + 2, 1).getTime() - localOffset;
    }
};

var getRandomCount = function getRandomCount(timestamp, granularity, localOffset, settings){
    var randomCountMax = (granularity === consts.MONTHLY_CODE) ? settings.monthly.randomCountMax : settings.daily.randomCountMax,
        randomCountMin = (granularity === consts.MONTHLY_CODE) ? settings.monthly.randomCountMin : settings.daily.randomCountMin;
    
    var randomCount = Math.floor(Math.random() * (randomCountMax - randomCountMin + 1)) + randomCountMin;
    
    return trySetZeroCountDateRanges(randomCount, timestamp, granularity, localOffset, settings);
};

var trySetStartOverride = function trySetStartOverride(startTs, granularity, settings) {
    return trySetOverride(
        startTs,
        (granularity === consts.MONTHLY_CODE) ? settings.monthly.startOverwrite : settings.daily.startOverwrite
    );
};

var trySetZeroCountDateRanges = function trySetZeroCountDateRanges(randomCount, timestamp, granularity, localOffset, settings){
    var zeroCountDateRanges = (granularity === consts.MONTHLY_CODE) ? 
        settings.monthly.zeroCountDateRanges : 
        settings.daily.zeroCountDateRanges,
        result = randomCount;
        
    zeroCountDateRanges.forEach(function(dateRange){
        if(typeof dateRange !== 'undefined' &&
            dateRange !== null  && 
            timestamp >= (new Date(dateRange.start).getTime() - localOffset) &&
            timestamp <= (new Date(dateRange.end).getTime() - localOffset)
        ) {
            result = 0;
        }
    });
    
    return result;
};

var trySetEndOverride = function trySetEndOverride(endTs, granularity, settings) {
    return trySetOverride(
        endTs,
        (granularity === consts.MONTHLY_CODE) ? settings.monthly.endOverwrite : settings.daily.endOverwrite
    );
};

var trySetOverride = function trySetOverride(timestamp, override) {
    if (typeof override != 'undefined' && override !== null) {
        return new Date(override).getTime();
    } else {
        return timestamp;
    }
}

module.exports = {
    'generate': generate,
    'consts': consts
};