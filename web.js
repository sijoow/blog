const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const cors = require('cors');

app.use(cors());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/search/blog', function (req, res) {
    const api_url = `https://openapi.naver.com/v1/search/blog?query=${encodeURIComponent(req.query.query)}&display=${req.query.display}`;

    const request = require('request');
    const options = {
        url: api_url,
        headers: {
            'X-Naver-Client-Id': CLIENT_ID,
            'X-Naver-Client-Secret': CLIENT_SECRET
        }
    };

    request.get(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            const data = JSON.parse(body);
            if (data && data.items) {
                res.json(data.items); 
            } else {
                res.status(500).json({ error: '검색 결과가 없습니다.' });
            }
        } else {
            console.error('API 요청 실패 - 상태 코드:', response.statusCode, '메시지:', response.statusMessage);
            res.status(response.statusCode).json({ error: 'API 요청 실패' });
        }
    });
});

app.listen(8003, function () {
    console.log('실행');
});
