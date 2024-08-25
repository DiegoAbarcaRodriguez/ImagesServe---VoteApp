import fs from 'fs';
import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { v4 } from "uuid";
import path from 'path';
import { VoteOptionModel } from '../models/vote-option.model';

export class ApiUploadController {
    uploadImage = async (req: Request, res: Response) => {

        const { _id } = req.params;
        let urlExistingImage: string;

        if (_id) {
            const optionToVote = await VoteOptionModel.findById(_id);

            if (!optionToVote) {
                res.status(404).json({
                    ok: false,
                    message: 'No OptionToVote found'
                });
            }

            urlExistingImage = `./uploads/${optionToVote!.img}`;

        }

        let validExtensions = ['jpeg', 'jpg', 'jpe', 'png', 'webp'];

        if (!req.files || Object.keys(req.files).length === 0) {
            res.status(404).json({
                ok: false,
                message: 'No file found'
            });
        }


        const file: UploadedFile = Array.isArray(req.files!.img) ? req.files!.img[0] : req.files!.img;
        const extension = file.mimetype.split('/').at(1);

        if (!validExtensions.includes(extension!)) {
            res.status(400).json({
                ok: false,
                message: 'The extension is not valid'
            });
        }

        const imageName = `${v4()}.${extension}`

        file.mv(`./uploads/${imageName}`, (error) => {
            if (error) {
                console.log(error)
                res.status(500).json({
                    ok: false,
                    message: 'It has occured an error moving the file'
                });
            }

            if (urlExistingImage && fs.existsSync(urlExistingImage)) {
                fs.unlinkSync(urlExistingImage);
            }


            res.json({
                ok: true,
                message: 'Image created correctly',
                imageName
            });
        });
    }

    getImage = (req: Request, res: Response) => {

        const { name } = req.params;

        const route = __dirname + '/../../uploads/' + name;

        if (!fs.existsSync(route)) {
            res.status(404).json({
                ok: false,
                message: 'No Image Found'
            });
        }
        const image = path.join(route);

        res.sendFile(image);
    }

    removeImage = async (req: Request, res: Response) => {

        const { _id } = req.params;

        if (!_id) {
            res.status(400).json({
                ok: false,
                message: 'The _id was not provided'
            });
        }

        const optionToVote = await VoteOptionModel.findById(_id);

        if (!optionToVote) {
            res.status(404).json({
                ok: false,
                message: 'No optionToVote found'
            });
        }

        const urlImage = `./uploads/${optionToVote!.img}`;

        if (!fs.existsSync(urlImage)) {
            res.status(404).json({
                ok: false,
                message: 'Image not found'
            });
        }

        fs.unlinkSync(urlImage);

        res.json({
            ok: true,
            message: 'Image removed succesfully'
        });


    }



}