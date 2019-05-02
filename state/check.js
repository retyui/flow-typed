const fs = require('fs');
const shell = require('shelljs');
const { parseDirString } = require('../cli/dist/lib/flowVersion.js');

const inRange = path => {
  const result = path.split('/');
  const flowVerRange = result[result.length - 1];
  const range = parseDirString(flowVerRange);

  if (range.kind === 'all') {
    return true;
  }

  if (range.upper === null) {
    return true;
  }

  const { major, minor } = range.upper || range.ver;

  if (major >= 0 && minor >= 88) {
    return true;
  }

  return false;
};

const getAllLibs = () => {
  const { code, stdout } = shell.exec(
    `find definitions/ -type d -name "flow_*"`
  );

  if (code === 0) {
    return stdout
      .split('\n')
      .map(path => path.replace(/definitions\/(browser|npm)\//, ''))
      .filter(Boolean);
  }

  return [];
};

const libs = getAllLibs().map(path => {
  return {
    path,
    canRunTest: inRange(path),
  };
});

let result = {};
const fName = 'result.json';
fs.writeFileSync(fName, `[`);

for (const { path, canRunTest } of libs) {
  if (canRunTest) {
    const s = Date.now();
    console.time(path);
    const { code, stdout } = shell.exec(
      `node cli/dist/cli.js run-tests ${path}`
    );
    console.timeEnd(path);
    const e = Date.now();
    result = {
      canRunTest,
      path,
      speed: e - s,
      code,
      stdout: code === 0 ? '' : stdout,
    };
  } else {
    result = {
      path,
      canRunTest,
    };
  }

  fs.appendFileSync(fName, `${JSON.stringify(result, null, 2)},`, 'utf8');
}

fs.writeFileSync(fName, `]`);

shell.exit(0);
