const internModel = require("../models/internModel");
const collegeModel = require("../models/collegeModel");

const createIntern = async function (req, res) {
  try {
    let data = req.body;
    let collegeName = data.collegeName

    let collegeId = await collegeModel.findOne({ $or : [{name : collegeName}, {fullName : collegeName}]}).select({_id :1})

    delete data.collegeName
    data.collegeId = collegeId._id.toString()

    let intern = await internModel.create(data);
    return res.status(201).send({ status: true, data: {intern} });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports.createIntern = createIntern;