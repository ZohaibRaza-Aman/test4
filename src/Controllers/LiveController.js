import Live from "../Models/LiveSchema.js"
import { errHandler, responseHandler } from "../helper/response.js"

const LiveStream = (req,res) =>{
    const body = req.body 
    Live.create(body).then((data)=>{
        responseHandler(res,data)
    }).catch(()=>{
        errHandler(res,5,403)
    })
}

const GetLiveStream = (req,res)=>{
    let {_id} = req.query
    let obj = {}
    if (_id) {
        obj._id=_id
    }
    Live.find(obj).then((data)=>{
        responseHandler(res,data)
    }).catch(()=>{
        errHandler(res,5,403)
    })
}

export {LiveStream,GetLiveStream}