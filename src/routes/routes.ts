import { Router } from "express";
import { ApiUploadController } from "../controllers/controller";

export class ApiImageRoutes {

    static get routes(): Router {
        const router = Router();
        const controller = new ApiUploadController();

        router.get('/api/image/:name', controller.getImage);
        router.post('/api/image/upload', controller.uploadImage);
        router.put('/api/image/update/:_id', controller.uploadImage);
        router.delete('/api/image/delete/:_id', controller.removeImage);

        return router;

    }
}