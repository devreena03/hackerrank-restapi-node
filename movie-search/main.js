"use strict";

const request = require("request");

process.stdin.resume();
process.stdin.setEncoding("utf-8");

let inputString = "";
let currentLine = 0;

process.stdin.on("data", function (inputStdin) {
  console.log(inputStdin);
  inputString += inputStdin;
});

process.stdin.on("end", function () {
  console.log("end");
  inputString = inputString.split("\n");

  main();
});

function readLine() {
  return inputString[currentLine++];
}

/*
 * Complete the 'getMovies' function below.
 *
 * The function is expected to return a 2D_STRING_ARRAY.
 * The function accepts following parameters:
 *  1. INTEGER year
 *  2. STRING query
 */
async function getMovies(year, query) {
  let pattern = query.replace(/\*/g, "");
  if (!query.startsWith("*")) {
    pattern = "^".concat(pattern);
  }
  if (!query.endsWith("*")) {
    pattern = pattern.concat("$");
  }
  let patt = new RegExp(pattern, "i");
  console.log(`final ${pattern}`);

  let data = await getMoviesPerYear(year);

  let newArray = data
    .filter((value) => patt.test(value.Title))
    .map((x) => [x.imdbID, x.Title]);

  console.log(newArray);
  return newArray;
}

async function getMoviesPerYear(year) {
  Array.prototype.pushArray = function (arr) {
    this.push.apply(this, arr);
  };

  let data = [];
  let page = 0;
  let totalPage = 1;
  while (page++ < totalPage) {
    let body = await getMoviesPerPage(year, page);
    data.pushArray(body.data);
    totalPage = body.total_pages;
  }

  return data;
}

async function getMoviesPerPage(year, page) {
  let options = {
    method: "GET",
    url: `https://jsonmock.hackerrank.com/api/movies?Year=${year}&page=${page}`,
  };
  return new Promise((resolve, reject) => {
    request(options, function (error, res, body) {
      if (!error && res.statusCode == 200) {
        resolve(JSON.parse(body));
      } else {
        reject(error);
      }
    });
  });
}

//console.log(getMovies(1999, "harry*"));

async function main() {
  // const ws = fs.createWriteStream(process.env.OUTPUT_PATH);

  const year = parseInt(readLine().trim(), 10);
  console.log(year);

  const query = readLine().trim();
  console.log(query);

  const result = await getMovies(year, query);

  console.log(result);

  //   ws.write(result.map((x) => x.join(" ")).join("\n") + "\n");

  //   ws.end();
}
