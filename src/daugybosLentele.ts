import http from 'http';

const server = http.createServer((req, res) => {
    const url = req.url;
    console.log(url);

    const method = req.method;
    console.log(method);

    let daugiklis = 1;
    if(url!=null){
        daugiklis = parseInt(url.split('/')[1]);
    }


    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.write('<!DOCTYPE html>');
    res.write('<html>');

    res.write('<head>');
    res.write('<title>Daugybos lentelė</title>');
    res.write('</head>');

    res.write('<body>');

        for(let i = 1; i <= 10; i++){
        res.write(`<a href="/${i}">${i}</a>&nbsp;`);
       
    }

    res.write(`<h1>${daugiklis} daugybos lentelė</h1>`);
    res.write('<table border="1">');

    for(let i = 1; i <= 10; i++){
        res.write('<tr>');
        res.write(`<td>${i}</td><td>*</td><td>${daugiklis}</td><td>=</td><td>${i*daugiklis}</td>`);
        res.write('</tr>');

    }

    res.write('</table>');
    res.write('</body>');
    res.write('</html>');
    res.end();
})

server.listen(2999, 'localhost');

