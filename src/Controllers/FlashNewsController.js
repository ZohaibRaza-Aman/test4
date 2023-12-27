import { flashnews } from "../Models/FlashSchema.js";
import { errHandler, responseHandler } from "../helper/response.js";

const uploadNews = (req, res) => {
    let body = req.body;
    let { id } = req.query;
    let idPrefix = 'LOKFL';
    flashnews.create({
        _id: `${idPrefix}${id}`,
        ...body,
        userId: id
    })
        .then((data) => {
            responseHandler(res, data);
        })
        .catch((err) => {
            console.log(err)
            errHandler(res, 5, 403);
        });
};


const updateNewsStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (status !== "active" && status !== "inactive") {
        return errHandler(res, "Invalid status provided", 400);
    }

    flashnews.findByIdAndUpdate(
        id,
        { $set: { status } },
        { new: true, useFindAndModify: false }
    )
        .then((data) => {
            if (data) {
                responseHandler(res, data);
            } else {
                errHandler(res, "News item not found", 404);
            }
        })
        .catch((err) => {
            console.log(err);
            errHandler(res, "Internal Server Error", 500);
        });
};


const getAllNews = (req, res) => {
    flashnews.find({})
        .then((data) => {
            responseHandler(res, data);
        })
        .catch(() => {
            errHandler(res, "not Found", 404);
        });
};



export { uploadNews, getAllNews, updateNewsStatus };
