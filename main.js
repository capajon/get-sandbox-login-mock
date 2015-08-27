var generateLoginData = require('login-data.js').generate,
    loginConsts = require('login-data.js').consts;

var loginSettings = {
    'daily': {
        'startOverwrite': '2015/04/01', //null, //options for date range overrides: null (for no override) or 'YYYY/MM/DD' format or timestamp    
        'endOverwrite': null,
        'randomCountMax': 10000,
        'randomCountMin': 2000,
        // empty (for no gaps) or 'YYYY/MM/DD' format or timestamp pairs - e.g. { 'start': '1999/04/01', 'end': '2000/05/01' }
        'zeroCountDateRanges': [
            //{ 'start': '2015/02/02', 'end': '2015/02/25' },
            //{ 'start': '2015/08/05', 'end': '2015/09/20' }
        ]
    },
    'monthly': {
        'startOverwrite': null, // null (for no override) or 'YYYY/MM/DD' format or timestamp    
        'endOverwrite': null,
        'randomCountMax': 300000,
        'randomCountMin': 60000,
        // empty (for no gaps) or 'YYYY/MM/DD' format or timestamp pairs - e.g. { 'start': '1999/04/01', 'end': '2000/05/01' }
        'zeroCountDateRanges': [ 
            { 'start': '2013/10/01', 'end': '2014/01/1' }
        ]
    }
};

Sandbox.define('/d2l/api/adp/unstable/events/userinteractionevent/login/count','GET', function(req, res) {
    var granularity = req.query.granularity;
    if (granularity !== loginConsts.MONTHLY_CODE && granularity !== loginConsts.DAILY_CODE) {
        throw('Unknown granularity of ' + granularity);
    }
    
    var result = generateLoginData(granularity, req.query.start, req.query.end, loginSettings);
    
    res.type('application/json');
    res.status(200);
    res.json(result);
});