/**
 * Sweepstakewinner
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  attributes: {
  	userID : 'STRING',
  	userEmail : 'STRING',
  	ticketID : 'STRING',
  	sweepstakeID  : 'STRING',
  	companyID : 'STRING',
  	confirmed : 'BOOLEAN',
  	sweepstake : 'OBJECT'
  }

};
