const a100 = require('../result100');
const a200 = require('../result200');
const a300 = require('../result300');
const a400 = require('../result400');
const a500 = require('../result500');
const a600 = require('../result600');
const a700 = require('../result700');
const a800 = require('../result800');
const a900 = require('../result900');

function compare(a, b) {
  if (a.path < b.path) {
    return -1;
  }
  if (a.path > b.path) {
    return 1;
  }
  return 0;
}

const getReport = arr => {
  const index = arr
    .sort(compare)
    .map(e => {
      const [name, flow] = e.path.split('/flow_');

      return { ...e, name, flow };
    })
    .reduce((acc, e) => {
      if (!acc[e.name]) {
        acc[e.name] = [];
      }

      acc[e.name].push(e);

      return acc;
    }, {});

  const makeLink = (flow, path) =>
    `[${flow}](https://github.com/flow-typed/flow-typed/tree/master/definitions/npm/${path})`;

  const strtss = Object.entries(index).map(([name, flows]) => {
    const vers = flows
      .map(({ canRunTest, flow, code, path }) => {
        const link = makeLink(flow, path);

        if (!canRunTest) {
          return `${link}: N/A`;
        }

        if (code === 0) {
          return `${link}: ✔️️`;
        }

        return `${link}: ❌`;
      })
      .join('; ');

    const [pkg]= name.split('_v');
    const down = `[![npm ${pkg}](https://img.shields.io/npm/dm/${pkg}.svg)](https://www.npmjs.com/package/${pkg})`;

    return `| ${name} | ${vers} | ${down} |`;
  });

  return `
| Module | Definition | Download |
|---|---|---|
${strtss.join('\n')}
`;
};

const all = [
  ...a100,
  ...a200,
  ...a300,
  ...a400,
  ...a500,
  ...a600,
  ...a700,
  ...a800,
  ...a900,
];

const getStats = arr => {
  const stat = {
    'N/A': 0,
    '✔️': 0,
    '❌': 0,
  };

  for (const { canRunTest, code } of arr) {
    if (!canRunTest) {
      stat['N/A'] = stat['N/A'] + 1;
    } else if (code === 0) {
      stat['✔️'] = stat['✔️'] + 1;
    } else {
      stat['❌'] = stat['❌'] + 1;
    }
  }

  return `
| Type | Count |
|---|---|
${Object.entries(stat)
  .map(([key, val]) => `| ${key} | ${val} |`)
  .join('\n')}`;
};

if(process.argv[2] === 'all'){
  return console.log(getStats(all));
}

if(process.argv[2] === 'err'){
  return console.log(getReport(all.filter(e => e.code > 0)));
}

if(process.argv[2] === 'full'){
  return console.log(getReport(all));
}

if(process.argv[2] === 'json'){
  return console.log(JSON.stringify(all,null,2));
}


