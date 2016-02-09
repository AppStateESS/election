CREATE TABLE elect_single_chair_vote (
  voterHash varchar(255) NOT NULL,
  electionId INT NOT NULL,
  singleId INT NOT NULL,
  ticketId INT NOT NULL
);
ALTER TABLE elect_single_chair_vote add unique singlevote (voterHash, electionId, singleId);

CREATE TABLE elect_multi_chair_vote (
  voterHash varchar(255) NOT NULL,
  electionId INT NOT NULL,
  multipleId INT NOT NULL,
  candidateId INT NOT NULL
);
ALTER TABLE elect_multi_chair_vote add unique multivote (voterHash, electionId, multipleId, candidateId);

CREATE TABLE elect_referendum_vote (
  voterHash varchar(255) NOT NULL,
  electionId INT NOT NULL,
  referendumId INT NOT NULL,
  answer smallint not null
);
ALTER TABLE elect_referendum_vote add unique refvote (voterHash, electionId, referendumId);

CREATE TABLE elect_vote_complete (
  bannerId varchar(255) NOT NULL,
  electionId INT NOT NULL
);
ALTER TABLE elect_vote_complete add unique finalvote (bannerId, electionId);