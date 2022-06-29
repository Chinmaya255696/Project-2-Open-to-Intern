const internModel = require("../models/internModel");
const collegeModel = require("../models/collegeModel");

// If there is no data in req.body
// If name is not given 
//If name has empty string or number or undefined or null
// If email is not given
// If email is not valid by regex
// If email id is already given in database
// If mobile number is not given
// If mobile number is already exist in database
// If mobile number is not unique check through regex
// If college id is not valid check through isValid method
const createIntern = async function (req, res) {
  try {
    let data = req.body;
    let collegeName = data.collegeName;

    // TODO : change variable name. It should be college
    let college = await collegeModel
      .findOne({ $or: [{ name: collegeName }, { fullName: collegeName }] })
      .select({ _id: 1 });
   

    delete data.collegeName;
    data.collegeId = college._id;

    let intern = await internModel.create(data);
    return res.status(201).send({ status: true, data: intern });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports.createIntern = createIntern;
