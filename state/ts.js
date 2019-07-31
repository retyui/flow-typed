const fs = require('fs');
const axios = require('axios');
const packages = require('./ls');

function chunkArray(myArray, chunk_size) {
  var index = 0;
  var arrayLength = myArray.length;
  var tempArray = [];

  for (index = 0; index < arrayLength; index += chunk_size) {
    myChunk = myArray.slice(index, index + chunk_size);
    // Do something if you want with the group
    tempArray.push(myChunk);
  }

  return tempArray;
}

const getJson = url => axios.get(url).then(({ data }) => data);

const getDownloadCount = packageName =>
  getJson(
    `https://api.npmjs.org/downloads/point/last-month/${packageName}`
  ).then(({ downloads }) => downloads);

const getInfo = async packageName => {
  let count = 'n/a';

  try {
    count = await getDownloadCount(`@types/${packageName}`);
  } catch (e) {
    console.log(' --- e', e);
  }

  return (v => {
    console.log(' --- ', v);
    return v;
  })({ package: `@types/${packageName}`, count });
};

(async () => {
  const chunks = chunkArray(packages, 3);

  for (const chunk of chunks) {
    const result = await Promise.all(chunk.map(name => getInfo(name)));

    result.map(el =>
      fs.appendFileSync('./log.json', `${JSON.stringify(el)},\n`)
    );
  }

  console.log(' --- Done');
})();
