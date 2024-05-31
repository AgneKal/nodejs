import mysql from 'mysql2';
import http from 'http';
import fs from 'fs';
import { Student } from './models/student';
import path from 'path';

let connected = false;

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'labasrytas',
    database: 'students'
});

// const con = mysql.createConnection (`mysql://root:labasrytas@localhost:3306/world`)
    

con.connect((error: any) => {
    if(error) throw error;
    connected = true;
    console.log('Prisijungta');
});

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    let filePath = `public${url}`;

        
    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
        const ext = path.extname(filePath);
        switch(ext) {
            case ".css":
                 res.setHeader('Content-Type', 'text/css');
                 break;
            case ".jpg":
            case ".jpeg":
            case ".png":
                 res.setHeader('Content-Type', 'image/jpg');
                 break;
            case ".js":
                res.setHeader('Content-Type', 'applications/javascript');
                break;
        }
        
        let file = fs.readFileSync(filePath);

        res.write(file);
        // res.write("body {background-color: red}");
        return res.end();
    }   

    // if(url === '/students' && method === 'GET') {
    //     if(connected) {
    //         con.query<Student[]>('SELECT * FROM students', (error, result) => {
    //             if(error) throw error;
    //             res.setHeader("Content-Type", "text/JSON; charset = utf-8");
    //             res.write(JSON.stringify(result));
    //             res.end();
    //         });
    //     }
    // }

    if(url === '/students' && method === 'GET') {
        if(connected) {
            con.query<Student[]>('SELECT * FROM students', (error, result) => {
                if(error) throw error;
                res.setHeader("Content-Type", "text/html; charset = utf-8");
                let rows = "";
                result.forEach((s) => {
                    rows+="<tr>";
                    rows+=`<td>${s.name}</td> <td>${s.surname}</td> <td>${s.phone}</td> <td> <a href='/student/${s.id}' class="btn btn-success">Plačiau</a><a href='/delete/${s.id}' class="btn btn-danger">Ištrinti</a></td>`;
                    rows+="</tr>";
                });
                let template = fs.readFileSync('templates/students.html').toString();
                template = template.replace('{{ students_table }}', rows);
                res.write(template);
                res.end();
            });
        }
    }

    if(url === '/add' && method === 'POST') {
        if(connected){
            const reqBody: any[] = [];
            req.on('data', (d) => {
                reqBody.push(d);
            });
            req.on('end', () => {
                const reqData = decodeURIComponent(Buffer.concat(reqBody).toString());
                const dd = reqData.split('&');
                console.log(dd);
                const name = mysql.escape(dd[0].split('=')[1]);
                const surname = mysql.escape(dd[1].split('=')[1]);
                const phone = mysql.escape(dd[2].split('=')[1]);
                const sex = mysql.escape(dd[3].split('=')[1]);
                const birthday = mysql.escape(dd[4].split('=')[1]);
                const email = mysql.escape(dd[5].split('=')[1]);
                const sql = `INSERT INTO students(name, surname, phone, sex, birthday, email) VALUES (${name}, ${surname}, ${phone}, ${sex}, ${birthday}, ${email})`;
                con.query(sql, (error) => {
                    if(error) throw error;
                });
                res.writeHead(302, {
                    'location': '/students',
                });
                res.end();
            })
        }
    }

    if(url === '/add' && method === 'GET') {
        if(connected){
            let template = fs.readFileSync('templates/add.html').toString();
            res.write(template);
            res.end();
        }
    }

    if(url?.split('/')[1] === 'student') {
        let id = parseInt(url?.split('/')[2]);
        con.query<Student[]>(`SELECT * FROM students WHERE id=${id}`, (error, result) => {
                if(error) throw error;
                let student = result[0];
                res.setHeader("Content-Type", "text/html; charset = utf-8");
                
                let template = fs.readFileSync('templates/student.html').toString();
                template = template.replace("{{ name }}", student.name);
                template = template.replace("{{ surname }}", student.surname);
                template = template.replace("{{ phone }}", student.phone != null ? student.phone : '-');
                template = template.replace("{{ sex }}", student.sex != null ? student.sex : '-');
                template = template.replace("{{ birthday }}", student.birthday != null ? student.birthday.toLocaleDateString('lt-LT') : '-');
                template = template.replace("{{ email }}", student.email != null ? student.email : '-');
        
                res.write(template);
                res.end();
            });
    }

    if(url?.split('/')[1] === 'delete') {
        let id = parseInt(url?.split('/')[2]);
        con.query<Student[]>(`DELETE FROM students WHERE id=${id}`, (error, result) => {
                if(error) throw error; 
                res.writeHead(302, {
                    'location': '/students',
                });
                res.end();
            });
    }

});

server.listen(2999, 'localhost')