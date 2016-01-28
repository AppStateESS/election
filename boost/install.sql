CREATE TABLE elect_single_chair_vote (
  voterHash varchar(255) NOT NULL,
  electionId INT NOT NULL,
  singleId INT NOT NULL,
  ticketId INT NOT NULL
);

CREATE TABLE elect_multi_chair_vote (
  voterHash varchar(255) NOT NULL,
  electionId INT NOT NULL,
  multipleId INT NOT NULL,
  candidateId INT NOT NULL
);

CREATE TABLE elect_referendum_vote (
  voterHash varchar(255) NOT NULL,
  electionId INT NOT NULL,
  referendumId INT NOT NULL,
  answer smallint not null
);

CREATE TABLE elect_vote_complete (
  voterHash varchar(255) NOT NULL,
  electionId INT NOT NULL
);