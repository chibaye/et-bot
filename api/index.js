module.exports = (req, res) => {
  res.send({message: process.env.BASE_URL})
}