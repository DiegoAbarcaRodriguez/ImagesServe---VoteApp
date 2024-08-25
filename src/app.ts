import express, { Request, Response } from "express";
import cors from "cors";
import fileupload, { UploadedFile } from "express-fileupload";
import fileUpload from "express-fileupload";
import path from "path";
import fs from "fs";
import { v4 } from "uuid";
import 'dotenv/config';
import { MongoDatabase } from "./db/init";
import { ApiImageRoutes } from "./routes/routes";


(async () => {

    await MongoDatabase.connect({
        mongoUrl: process.env.MONGO_URL!,
        dbName: process.env.DB_NAME!
    });

    main();
})();

function main() {
    const app = express();

    app.use(cors());
    app.use(fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 }
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(ApiImageRoutes.routes);


    app.listen(process.env.PORT, () => {
        console.log('Server running on PORT 3030');
    });
};

