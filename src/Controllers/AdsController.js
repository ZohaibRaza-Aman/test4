import { AdsS } from "../Models/AdsSchema.js";
import { errHandler, responseHandler } from "../helper/response.js";

const Ads = (req, res) => {
  let body = req.body;
  let { id } = req.query;
  let { noOfImpression } = req.body;
  console.log(typeof body.StartAt, body.EndAt);
  let StartAt = new Date().setDate(new Date(body.StartAt).getDate());
  let EndAt = new Date().setDate(new Date(body.EndAt).getDate());
  body.noOfImpression = noOfImpression;
  AdsS.create({ ...body, userId: id, StartAt, EndAt })
    .then((data) => {
      responseHandler(res, data);
    })
    .catch((err) => {
      console.log(err)
      errHandler(res, 5, 403);
    });
};

const GetAds = (req, res) => {
  let { side, active } = req.query;
  let obj = {};
  if (side) {
    obj.side = side;
  }
  AdsS.find(obj)
    .then((data) => {
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        const element = data[i];
        if (active) {
          let currentDate = Date.now();
          let StartAt = currentDate >= Number(element.StartAt); //true
          let EndAt = currentDate >= Number(element.EndAt); //false
          console.log(StartAt, "start")
          console.log(EndAt, "end")
          if (StartAt && !EndAt) {
            arr.push(element);
            console.log(arr, "jj")
          }
        }
      }

      responseHandler(res, active ? arr : data);
      console.log(arr)
    })
    .catch((err) => {
      console.log(err)
      errHandler(res, 5, 403);
    });
};
// const ClickAds = (req,res)=>{
//     let {_id} = req.body
//     AdsS.FindByIdAndUpdate(_id,).then((data)=>{
//         responseHandler(res,data)
//     }).catch(()=>{
//         errHandler(res,5,403)
//     })
// }

export { Ads, GetAds };
