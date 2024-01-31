const CsTickets = require("../models/csTickets");

const createCsTicket = async ({ email, category, problemText }) => {
  const definition = { email, category, problemText, isOpen: true };
  const newTicket = new CsTickets(definition);
  await newTicket.save();
  return;
};

const solveTicket = async ({ ticketId, solutionText }) => {
  const update = { isOpen: false, solutionText };
  await CsTickets.findByIdAndUpdate(ticketId, update);
  return;
};

const fetchTicket = async ({ ticketId }) => {
  const myTicket = await CsTickets.findById(ticketId);
  return myTicket;
};

const fetchOpenTickets = async () => {
  const allOpenTickets = await CsTickets.find({ isOpen: true });
  return allOpenTickets;
};

module.exports = {
  createCsTicket,
  solveTicket,
  fetchTicket,
  fetchOpenTickets,
};
