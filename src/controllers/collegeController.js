const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");

const createCollege = async function (req, res) {
  try {
    let data = req.body;
    let college = await collegeModel.create(data);
    return res.status(201).send({ status: true, data:  college  });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports.createCollege = createCollege;


const getCollegeDetails = async function (req, res){
 
  const collegeName = req.query.collegeName
   
  const getCollege = await collegeModel.findOne({name: collegeName})
  
   const getCollegeId= getCollege._id
   const internData = await internModel.find({collegeId: getCollegeId})
   const data = {...getCollege.toJSON(), interns: internData}
  
   return res.status(200).send({ status: true, data: data});
}

module.exports.getCollegeDetails = getCollegeDetails;