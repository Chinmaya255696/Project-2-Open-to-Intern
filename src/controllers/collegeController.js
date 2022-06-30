const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");
const axios = require("axios");

const isValid = function (value) {
  if (Object.keys(value).length === 0) return false;
  else return true;
};

const isValidValue = function (value) {
  if (typeof value !== "string") return false;
  else if (value.trim().length == 0) return false;
  else return true;
};

const createCollege = async function (req, res) {
  try {
    let data = req.body;
    if (!isValid(data))
      return res
        .status(400)
        .send({ status: false, message: "No information pass" });

    const { name, fullName, logoLink, isDeleted } = req.body;

    if (!name)
      return res
        .status(400)
        .send({ status: false, message: "Name is required" });
    if (!isValidValue(name) || /\d/.test(name))
      return res
        .status(400)
        .send({ status: false, message: "Name is in wrong format" });

    if (!fullName)
      return res
        .status(400)
        .send({ status: false, message: "Full Name is required" });
    if (!isValidValue(fullName) || /\d/.test(fullName))
      return res
        .status(400)
        .send({ status: false, message: "Full Name is in wrong format" });

    if (!logoLink)
      return res
        .status(400)
        .send({ status: false, message: "Logo link is required" });
    if (!isValidValue(logoLink))
      return res
        .status(400)
        .send({ status: false, message: "Logo link is in wrong format" });

    if (isDeleted && typeof isDeleted !== "boolean")
      return res
        .status(400)
        .send({ status: false, message: "isDeleted is in wrong format" });

    let found = false;
    await axios
      .get(logoLink)
      .then((r) => {
        if (r.status == 200 || r.status == 201) {
          if (r.headers["content-type"].startsWith("image/")) found = true;
        }
      })
      .catch((error) => {});//This is group 10
     

    if (found == false)
      return res
        .status(400)
        .send({ status: false, message: "Incorrect logo link" });

    let collegeName = await collegeModel.findOne({ name: req.body.name });
    if (collegeName)
      return res
        .status(400)
        .send({ status: false, message: "College Name is already exist" });

    let college = await collegeModel.create(data);
    return res.status(201).send({ status: true, data: college });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const getCollegeDetails = async function (req, res) {
  try {
    const collegeName = req.query.collegeName;

    if (!isValidValue(collegeName))
      return res
        .status(400)
        .send({ status: false, message: "college name is required" });

    const college = await collegeModel.findOne({
      name: collegeName,
      isDeleted: false,
    });
    if (!college)
      return res
        .status(400)
        .send({ status: false, message: "No college found" });

    const collegeDetails = {
      name: college.name,
      fullName: college.fullName,
      logoLink: college.logoLink,
    };

    const getCollegeId = college._id;
    const internData = await internModel
      .find({ collegeId: getCollegeId, isDeleted: false })
      .select({ name: 1, mobile: 1, email: 1 });

    if (internData.length == 0)
      return res
        .status(400)
        .send({ status: false, message: "No interns for this college" });
    const data = { ...collegeDetails, interns: internData };

    return res.status(200).send({ status: true, data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = {
  createCollege,
  getCollegeDetails,
};
