import os from 'node:os';
import fs from 'node:fs';
import readline from 'node:readline';

/*
!  program idea
*! make a .txt file for each day (similar to what I do on google docs)
*! parse specific components of the .txt file and use that to upload to JIRA & JamBoard
    *! jamboard for long-term goals (LTG) (updates weekly)
    *! JIRA for daily goals (updates daily)
    *! upload to github for easy viewing access

*! have a start script that opens the files that I NEED to be open automagically...
*/

/*
pipeline:
    1. create file...

*/

const date = new Date();
const [year, month, day] = [
  date.getFullYear(),
  date.getMonth() + 1,
  date.getDate(), //! GET DATE AND GET DAY (rets 0 for sunday) ARE NOT THE SAME
];
const filename = `${month}_${day}_${year}.txt`;
const filepath = `./Users/siddhantsingh/Projects/2023/Learning JavaScript/Learning Node/src/${filename}`;

const parameters = {
  todos: [],
  goals: [],
  interactions: [],
  links: [],
  learnings: [],
  reflections: [],
};

let flags = {};
const altSet = new Set(['learnings', 'reflections']);

//! "fs.constants.F_OK": flag that checks for the existence of a file...
//* pre: generates the file with fs, post: generat
fs.access(filename, fs.constants.F_OK, (err) => {
  if (err !== null) {
    console.log(`${filename} does NOT exist in this directory...`);
    //! "pgf": potentially generate file
    const pgf = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    pgf.question(
      `would you like to create "${filename}" (y/n) `,
      (makeFile) => {
        // console.log(makeFile); //
        if (makeFile.toLowerCase().trim() === 'y')
          fs.writeFileSync(
            `${filename}`,
            `${filename.split('.')[0]}\n${Object.keys(parameters).join(
              ':\n'
            )}:`,
            (err) => {
              if (err) throw err;
              else console.log('success...');
            }
          );
        pgf.close();
      }
    );
  } else console.log(`${filename} DOES exist in this directory...`);

  flags = generateFlagIndexes(fs.readFileSync(filename).toString());

  //* parse the contents of the text file...
  const PARSE = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  PARSE.question(`parse ${filename} and gen-jira-todos (y/n) `, (ans) => {
    if (ans.toLowerCase().trim() === 'y') {
      //* parse todos...
      //! parse the file content and then break it down into individual todos and send to jira with the message load etc.
      //! 0 - todos
      //! 1 - after todos
      for (const f of Object.keys(flags)) {
        parse({
          fname: filename,
          flag: f,
        });
      }
    }
    PARSE.close();
    //! WOWOWOWOWOWOWOWOWOWOW
    //! WOWOWOWOWOWOWOWOWOWOW
    console.log(parameters);
    //! WOWOWOWOWOWOWOWOWOWOW
    //! WOWOWOWOWOWOWOWOWOWOW
  });
});

const generateFlagIndexes = (file) => {
  const ids = Object.keys(parameters);
  let map = new Map();
  for (const id of ids) map.set(id, file.indexOf(id));
  let sorted = [...map.entries()].sort((a, b) => a[1] - b[1]).map((e) => e[0]);
  let c = {};
  let i = 0;
  for (const key in sorted) {
    c[sorted[key]] = [i, i + 1];
    i += 1;
  }
  c[sorted[sorted.length - 1]] = [i - 1, null];
  return c;
};

/*
! break the list into a 2d array where each [][0] value represents: "task | time"
! calculate time(s) --> store for future tracking?
    ! break each task into a seperate object that will then be sent abroad (to JIRA API as an issue...)
*/
//* pre: {fname: <FILENAME>, flag: <FLAGS>}
//* post: return an array of json objects
const parse = (params) => {
  const filename = params['fname'];
  const [start, end] = flags[params['flag']];
  const fileContent = fs.readFileSync(filename).toString();

  /*
    	! structure of the todos:
        ! task | timings

        !  1. crazy | 12:00-1:30
        !    a. lalala | 12:00
        !    b. basbdasd | 1
        !    c. asdasd
        ! a, b, & c are sub-components of the task NOT seperate tasks

        !  2. wow | 1.5hr
        !  3. wowza | 45m
    */

  // regex to break by numbers + a period ie. 1. or 2.
  let content = '';
  if (end === null)
    content = fileContent
      .substring(
        fileContent.indexOf(`${Object.keys(parameters)[start]}:`) +
          (Object.keys(parameters)[start].length + 1)
      )
      .trim();
  else
    content = fileContent
      .substring(
        fileContent.indexOf(`${Object.keys(parameters)[start]}:`) +
          (Object.keys(parameters)[start].length + 1),
        fileContent.indexOf(`${Object.keys(parameters)[end]}:`)
      )
      .trim();
  if (!altSet.has(params['flag'])) {
    content = content
      .split(/\d+\.\s+/) //! regex to break by # (ie. break by "1." or "2.")
      .filter((e) => e !== '')
      .map((e) =>
        e
          .split('\n')
          .map((el) => el.trim())
          .filter((el) => el !== '')
      );
  }
  //else {
  // console.log(content);
  //}

  switch (params['flag']) {
    /* !todo requirements */
    case 'todos':
      parameters[params['flag']] = parseT(content);
      return;
    /* !link requirements */
    case 'goals':
      parameters[params['flag']] = parseGILi(content);
      return;
    case 'interactions':
      parameters[params['flag']] = parseGILi(content);
      return;
    case 'links':
      parameters[params['flag']] = parseGILi(content);
      return;
    /* !paragraph requirements */
    case 'reflections':
      parameters[params['flag']] = content;
      return;
    case 'learnings':
      parameters[params['flag']] = content;
      return;
    default:
      console.log(`flag: ${params['flag']} not found...`);
      return;
  }
};

const parseT = (content) => {
  const parsedToObjs = [];
  for (const arr of content) {
    const toAdd = {
      task: '',
      time: {},
      otherInfo: [],
    };
    const [task, t] = arr[0]
      .split('|')
      .map((e) => e.trim())
      .filter((e) => e !== '');
    toAdd['task'] = task;
    toAdd['time'] = parseTime(t);
    if (arr.length > 1) {
      const otherInfo = arr.slice(1);
      toAdd['otherInfo'] = otherInfo;
    }
    parsedToObjs.push(toAdd);
  }

  return parsedToObjs;
};

//! works for (G)oals, (I)nteractions, and (Li)nks
const parseGILi = (content) => {
  const parsedToObjs = [];
  for (const arr of content) {
    const toAdd = {
      task: '',
      otherInfo: [],
    };
    const task = arr[0].trim();
    toAdd['task'] = task;
    if (arr.length > 1) {
      const otherInfo = arr.slice(1);
      toAdd['otherInfo'] = otherInfo;
    }
    parsedToObjs.push(toAdd);
  }
  return parsedToObjs;
};

//* pre: enter any specific time component (after the |)
//* post: return an object representing the time ({start, end, duration})
const parseTime = (t) => {
  const time = {
    start: 0,
    end: 0,
    duration: 0,
  };
  if (t === null || t === undefined) return time;
  if (t.indexOf(':') !== -1 && t.indexOf('-') !== -1) {
    // contains a start & stop time
    [time['start'], time['end']] = t.split('-').filter((e) => e.trim());
    //! discarded variables
    const strApp = `${month}/${day}/${year}`;
    time['duration'] =
      (new Date(`${strApp} ${time['end']}`) -
        new Date(`${strApp} ${time['start']}`)) /
      (1000 * 60); //! convert to minutes
  } else if (t.indexOf(':') !== -1 && t.indexOf('-') === -1)
    time['start'] = t.trim();
  //! converts to minutes
  else if (t.indexOf('hr') !== -1)
    time['start'] = `${60 * +t.trim().replace('hr', '')}`;
  else time['start'] = t.trim().replace('m', '');

  return time;
};
