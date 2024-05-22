import http from 'http';
import fs from 'fs';

const server = http.createServer((req, res) => {
    const method = req.method;
    const url = req.url;
    console.log(`Metodas: ${method}, Url: ${url}`);
    
    if(url === '/calculate' && method === "POST") {
        const reqBody: any[] = [];
        req.on('data', (d) => {
            console.log(`Gaunami duomenys ${d}`);
            console.log(`Duomenys ${d}`);
            reqBody.push(d);
        });
    
        req.on('end', () => {
            console.log(`Baigti siųsti duomenys`);
            const reqData = Buffer.concat(reqBody).toString();
            const va = reqData.split('&');
            const x = parseFloat (va[0].split('=')[1]);
            const y = parseFloat (va[1].split('=')[1]);
            console.log(`Visi gauti duomenys ${reqData}`);
            console.log(va);

            res.setHeader('Content-Type', 'text/html');
            let template = fs.readFileSync('templates/calculate.html').toString();
            template = template.replace(`{{result}}`, `Rezultatas: ${x*y}`)
            res.write(template)
            // res.write(`Rezultatas ${x*y}`)
            res.end();
        });
        return;
    }

    if(url == '/') {
        res.setHeader('Content-Type', 'text/html');
        const template = fs.readFileSync('index.html');
        res.write(template)

        return res.end();
    }



    res.writeHead(404, {
        'Content-Type': 'text/html'
    });

    const template = fs.readFileSync('templates/404.html');
    res.write(template)
    // res.write('Puslapis nerastas')
    // res.statusCode = 404;
    return res.end();

});

server.listen(2999, 'localhost');

