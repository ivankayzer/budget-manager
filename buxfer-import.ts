import * as parse from 'csv-parse';
import * as fs from 'fs';

const FILE = process.cwd() + '/transactions.csv';

console.warn(
  "!!! Make sure IOU column is deleted from your CSV. Otherwise, expect 'CSV_INCONSISTENT_RECORD_LENGTH' error. !!!",
);

const csv: parse.Parser = parse(fs.readFileSync(FILE));

let record;
while ((record = csv.read())) {
  console.log(record);
}
