const sqlite3 = require("sqlite3").verbose();

function register(first_name, last_name, username, password, email) {
    const db = new sqlite3.Database(
        "./database.sqlite",
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) return console.error(err.message);
            console.log("Connection worked");
        }
    );

    function getUserByEmail(email) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM users WHERE email = ?`;
            db.get(sql, [email], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    return new Promise((resolve, reject) => {
        getUserByEmail(email)
            .then(row => {
                if (row) {
                    resolve("Already register");
                } else {
                    sql1 = `INSERT INTO users(first_name, last_name, username, password, email)
            VALUES(?,?,?,?,?)`;

                    db.run(sql1, [first_name, last_name, username, password, email], (err) => {
                        if (err) return console.error(err.message);
                        resolve("OK");
                    })
                }
            })
            .catch(err => {
                console.error(err.message);
                reject(err);
            })
            .finally(() => {
                db.close((err) => {
                    if (err) {
                        console.error(err.message);
                    }
                });
            });
    });
}

register("Steven", "Affouard", "Palmier", "1234", "charles.affouard@eptech.eu")
    .then(message => {
        console.log(message);
    })
    .catch(err => {
        console.error("Erreur lors de l'enregistrement :", err);
    });