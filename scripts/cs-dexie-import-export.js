Dexie.export = function(db) {
  return db.transaction(
    'r',
    db.tables,
    ()=>{
      return Promise.all(
        db.tables.map(
          table =>
            table.toArray().then(
              someRows =>
              {
                 return {
                   tableName: table.name,
                   rows: someRows
                 }
              }
            )
        )
      )
    }
  );
}

// Dexie.import = function(data, db) {
// return db.transaction('rw', db.tables, () => {
// return Promise.all(data.map (t =>
// db.table(t.table).clear()
// .then(()=>db.table(t.table).bulkAdd(t.rows)));
// });
// }
