var express = require("express");
var router = express.Router();
var path = require("path");
const customerSupportServices = require("../services/customerSupport");

router.post("/createCsTicket", async (req, res, next) => {
  const { email, category, problemText } = req.body;
  await customerSupportServices.createCsTicket({
    email,
    category,
    problemText,
  });
  res.sendStatus(200);
});

router.post("/solveTicket/:ticketId", async (req, res, next) => {
  const { ticketId } = req.path;
  await customerSupportServices.solveTicket({ ticketId, solutionText });
  res.sendStatus(200);
});

router.get("/fetchTicket/:ticketId", async (req, res, next) => {
  const { ticketId } = req.path;
  const result = await customerSupportServices.fetchTicket({ ticketId });
  res.json(result);
});

router.get("/fetchOpenTickets", async (req, res, next) => {
  const result = await customerSupportServices.fetchOpenTickets();
  res.json(result);
});
//cryptoapisverifydomain

module.exports = router;
