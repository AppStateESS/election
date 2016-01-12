CREATE TABLE elect_single_chair_vote (
  voterHash varchar(255) NOT NULL,
  ballotId INT NOT NULL,
  ticketId INT NOT NULL
);


CREATE TABLE elect_multi_chair_vote (
  voterHash varchar(255) NOT NULL,
  ballotId INT NOT NULL,
  candidateId INT NOT NULL
);


CREATE TABLE elect_referendum_vote (
  voterHash varchar(255) NOT NULL,
  referendumId INT NOT NULL,
  answer smallint not null
);