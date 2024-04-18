const net = require('net');

try {
  const pipeChecker = net.createConnection({ path: '//./pipe/sp_remote_control' }, () => {
  })
  pipeChecker.on('connect', () => {
    console.log('[connect] pipe exists');
    pipeChecker.end();
    process.exit();
  });
  pipeChecker.on('ready', () => {
    console.log('[ready] pipe exists');
    pipeChecker.end();
    process.exit();
  });
  pipeChecker.on('lookup', () => {
    console.log('[lookup] pipe exists');
    pipeChecker.end();
    process.exit();
  });
  pipeChecker.on('error', function (err) {
    dialog.showErrorBox('Soundpad is in trial version', 'Remote control of Soundpad is not available in the trial version. Please purchase Soundpad to use this app.');
    console.log('pipe does not exist');
    process.exit()
  });
} catch (error) {
  console.log('CAUGHT ERROR');
}