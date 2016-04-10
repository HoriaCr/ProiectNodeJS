var crypto = require('crypto');
var fs = require('fs');
var cp = require('child_process');

var runTest = function(interpreter, filename, options, expected) {
    // start time
    var start = process.hrtime();
    var child = cp.spawnSync(interpreter, [filename], options); 
    if (child.stderr !== '') {
        return ['Compilation error', child.stderr];
    }
    
    // ignore trailing newlines when comparing result
    var output = child.stdout.replace(/\n$/, "");
    
    var deltaMs = process.hrtime(start)[1] / 1000000; 
    // time it takes for execution
    
    var success = ['Wrong answer', 'Accepted', 'Time limit exceeded'];
    if (deltaMs > child.options.timeout) {
        return [success[2], child.options.timeout];
    }
    return [success[output === expected ? 1 : 0], deltaMs];
};



/*
TODO: support compiled languages
var langCompilers = {
    'c' : ['gcc', ['-O2', '-Wextra', '-o']],
    'c++11' : ['g++-5', ['-std=c++11', '-O3', '-Wextra', '-o']],
    'java': ['javac', []]
};
*/

var evalProblem = function(submission, problem) {

    var options = {
        timeout: problem.timeLimit,
        input: problem.examples[0].input,
        encoding: 'utf8'
    };
    
    var langInterpreters = {
        'python3': 'python3', 
        'python2.7': 'python', 
        'ruby': 'ruby', 
        'javascriptv8': 'node'
    };
   

    var language = submission.language;
    var data = submission.submission;
    // generate unique file
    var filename = 'test' + crypto.randomBytes(4).readUInt32LE(0);
    fs.writeFileSync(filename, data);

    var result = runTest(langInterpreters[language], filename, options,
            problem.examples[0].output);
    if (result[0] === 'Compilation error') {
        return result;
    }
    var results = problem.tests.map(function(test) {
        options.input = test.input;
        return runTest(langInterpreters[language], filename, options,
            test.output);
    });

    // remove file
    fs.unlinkSync(filename);
    return results;
};



var evaluateProblem = function(submission, problem) {
    var res = evalProblem(submission, problem);
    var ret = {};
    if (res[0] === 'Compilation error') {
        ret = {
            'evaluationStatus': 'Compilation Error' ,
            'results': []
        };
    } else {
        ret['results'] = res;
        var passed = res.reduce(function (total, result) {
            return result[0] === 'Accepted' ? total + 1 : total;
        });
        if (passed === res.length) {
            ret['evaluationStatus'] = 'Wrong answer';
        } else {
            ret['evaluationStatus'] = 'Accepted';
        }
    }

    return ret;
};

exports.evaluateProblem = evaluateProblem;
