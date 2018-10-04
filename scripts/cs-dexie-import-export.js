function export(db) {
    return db.transaction('r', db.tables, ()=>{
        return Promise.all(
            db.tables.map(table => table.toArray()
                .then(rows => ({table: table.name, rows: rows})));
    });
}

function import(data, db) {
    return db.transaction('rw', db.tables, () => {
        return Promise.all(data.map (t =>
            db.table(t.table).clear()
              .then(()=>db.table(t.table).bulkAdd(t.rows)));
    });
}
