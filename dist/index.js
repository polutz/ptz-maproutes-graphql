var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import Schema from './core/schema';
import GraphQlHttp from 'express-graphql';
import { MongoClient } from 'mongodb';
import { graphql } from 'graphql';
import { introspectionQuery } from 'graphql/utilities';
import * as fs from 'fs';
import cors from 'cors';
import { UserApp } from 'ptz-user-app';
import { UserRepository } from 'ptz-user-repository';
var app = express();
app.use(cors());
console.log('starting server');
const MONGO_URL = 'mongodb://localhost:27017/polutz-graphql-test', PORT = 3011;
(() => __awaiter(this, void 0, void 0, function* () {
    try {
        var db = yield MongoClient.connect(MONGO_URL);
        var userApp = new UserApp(new UserRepository(db));
        var schema = Schema(userApp);
        app.use('/', GraphQlHttp({
            schema,
            graphiql: true
        }));
        app.listen(PORT, () => console.log('Listening on port ' + PORT));
        var json = yield graphql(schema, introspectionQuery);
        fs.writeFile('./dist/schema.json', JSON.stringify(json, null, 2), err => {
            if (err)
                throw err;
            console.log('Json schema created!');
        });
    }
    catch (e) {
        console.log(e);
    }
}))();
